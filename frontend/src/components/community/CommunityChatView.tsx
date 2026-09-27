import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Image,
  Dumbbell,
  Sparkles,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  Users,
  Search,
  MessageSquare,
  ArrowLeft,
  Circle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  messagesApi,
  ConversationItem,
  DirectMessageItem,
} from '@/lib/api/messagesApi';
import { usersApi } from '@/lib/api/usersApi';
import {
  getSocket,
  joinConversationRoom,
  leaveConversationRoom,
  emitSocketMessage,
  emitTypingIndicator,
  emitStopTypingIndicator,
  emitReadReceipt,
} from '@/lib/socket';
import { toast } from 'sonner';

export const CommunityChatView: React.FC = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<DirectMessageItem[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({}); // userId -> name
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileListOpen, setIsMobileListOpen] = useState(true);

  // Suggested athletes to start new chat
  const [suggestedBuddies, setSuggestedBuddies] = useState<any[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentUserId = currentUser?._id || (currentUser as any)?.id;

  // 1. Load initial conversations
  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      const res = await messagesApi.getConversations();
      if (res.data) {
        setConversations(res.data);
        if (res.data.length > 0 && !selectedConversation) {
          setSelectedConversation(res.data[0]);
        }
      }
    } catch (err) {
      console.warn('Failed loading conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    loadConversations();

    // Fetch suggested buddies for new chats
    usersApi.getSuggestedUsers().then((res) => {
      if (res.data) setSuggestedBuddies(res.data);
    }).catch(() => {});
  }, []);

  // 2. Load messages when selectedConversation changes
  useEffect(() => {
    if (!selectedConversation) return;

    const convId = selectedConversation.id;
    setLoadingMessages(true);

    // Join Socket Room
    joinConversationRoom(convId, () => {
      emitReadReceipt(convId);
    });

    messagesApi
      .getMessages(convId, { limit: 50 })
      .then((res) => {
        if (res.data) {
          setMessages(res.data);
          scrollToBottom();
        }
      })
      .catch((err) => {
        console.error('Failed to load messages:', err);
      })
      .finally(() => {
        setLoadingMessages(false);
      });

    return () => {
      leaveConversationRoom(convId);
    };
  }, [selectedConversation?.id]);

  // 3. Socket Event Listeners
  useEffect(() => {
    const socket = getSocket();

    const handleNewMessage = (newMsg: DirectMessageItem) => {
      if (selectedConversation && newMsg.conversation === selectedConversation.id) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m.id === newMsg.id || (m as any)._id === (newMsg as any)._id)) {
            return prev;
          }
          return [...prev, newMsg];
        });
        scrollToBottom();
        emitReadReceipt(selectedConversation.id);
      }

      // Update conversation list preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === newMsg.conversation
            ? {
                ...c,
                lastMessage: {
                  text: newMsg.text || 'Shared attachment',
                  sender: newMsg.sender,
                  senderName: newMsg.senderName,
                  createdAt: newMsg.createdAt,
                },
                unreadCount:
                  selectedConversation?.id === newMsg.conversation
                    ? 0
                    : c.unreadCount + 1,
              }
            : c
        )
      );
    };

    const handleReadReceipt = ({ conversationId }: { conversationId: string }) => {
      if (selectedConversation?.id === conversationId) {
        setMessages((prev) =>
          prev.map((m) => (m.isMe ? { ...m, status: 'read' } : m))
        );
      }
    };

    const handleTyping = ({ conversationId, userId, userName }: any) => {
      if (selectedConversation?.id === conversationId && userId !== currentUserId) {
        setTypingUsers((prev) => ({ ...prev, [userId]: userName }));
      }
    };

    const handleStopTyping = ({ conversationId, userId }: any) => {
      if (selectedConversation?.id === conversationId) {
        setTypingUsers((prev) => {
          const updated = { ...prev };
          delete updated[userId];
          return updated;
        });
      }
    };

    const handlePresenceOnline = ({ userId }: { userId: string }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.otherUser.id === userId
            ? { ...c, otherUser: { ...c.otherUser, isOnline: true } }
            : c
        )
      );
      if (selectedConversation?.otherUser.id === userId) {
        setSelectedConversation((prev) =>
          prev ? { ...prev, otherUser: { ...prev.otherUser, isOnline: true } } : null
        );
      }
    };

    const handlePresenceOffline = ({ userId }: { userId: string }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.otherUser.id === userId
            ? { ...c, otherUser: { ...c.otherUser, isOnline: false } }
            : c
        )
      );
      if (selectedConversation?.otherUser.id === userId) {
        setSelectedConversation((prev) =>
          prev ? { ...prev, otherUser: { ...prev.otherUser, isOnline: false } } : null
        );
      }
    };

    socket.on('message:new', handleNewMessage);
    socket.on('message:read', handleReadReceipt);
    socket.on('message:typing', handleTyping);
    socket.on('message:stopTyping', handleStopTyping);
    socket.on('presence:online', handlePresenceOnline);
    socket.on('presence:offline', handlePresenceOffline);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('message:read', handleReadReceipt);
      socket.off('message:typing', handleTyping);
      socket.off('message:stopTyping', handleStopTyping);
      socket.off('presence:online', handlePresenceOnline);
      socket.off('presence:offline', handlePresenceOffline);
    };
  }, [selectedConversation?.id, currentUserId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 4. Handle Typing with Debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (!selectedConversation) return;

    if (!isTyping) {
      setIsTyping(true);
      emitTypingIndicator(selectedConversation.id);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitStopTypingIndicator(selectedConversation.id);
    }, 2000);
  };

  // 5. Send Message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConversation) return;

    const convId = selectedConversation.id;
    const textToSend = inputText.trim();
    setInputText('');

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    emitStopTypingIndicator(convId);
    setIsTyping(false);

    emitSocketMessage(
      {
        conversationId: convId,
        text: textToSend,
      },
      (res) => {
        if (!res?.success) {
          // Fallback to REST API if socket rejected
          messagesApi
            .sendMessage(convId, { text: textToSend })
            .then((r) => {
              if (r.data) {
                setMessages((prev) => [...prev, r.data]);
                scrollToBottom();
              }
            })
            .catch(() => toast.error('Unable to deliver message'));
        }
      }
    );
  };

  // Start new conversation with suggested buddy
  const handleStartChatWithBuddy = async (buddyId: string) => {
    try {
      const res = await messagesApi.getOrCreateConversation(buddyId);
      if (res.data) {
        setSelectedConversation(res.data);
        loadConversations();
        setShowNewChatModal(false);
        setIsMobileListOpen(false);
      }
    } catch (err) {
      toast.error('Unable to initiate chat');
    }
  };

  return (
    <div className="w-full h-[620px] rounded-3xl bg-slate-950/90 border border-teal-500/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex overflow-hidden font-sans select-none relative">
      {/* 1. LEFT PANE: CONVERSATION LIST */}
      <div
        className={`w-full lg:w-80 h-full border-r border-white/10 flex flex-col bg-slate-950/70 shrink-0 ${
          selectedConversation && !isMobileListOpen ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {/* List Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <h3 className="font-extrabold text-sm text-white">Direct Messages</h3>
          </div>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="px-2.5 py-1 rounded-xl bg-teal-400/20 border border-teal-400/40 text-teal-300 font-bold text-[10px] hover:bg-teal-400 hover:text-slate-950 transition"
          >
            + New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {loadingConversations ? (
            <div className="p-6 text-center text-xs text-slate-500 font-mono">
              Loading chat threads...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-xs text-slate-400">No active chat threads.</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="px-3 py-1.5 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs"
              >
                Find Athletes
              </button>
            </div>
          ) : (
            conversations.map((conv) => {
              const isSelected = selectedConversation?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv);
                    setIsMobileListOpen(false);
                  }}
                  className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition ${
                    isSelected
                      ? 'bg-teal-500/15 border border-teal-400/40 text-white'
                      : 'hover:bg-white/5 border border-transparent text-slate-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={
                        conv.otherUser.avatar ||
                        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
                      }
                      alt={conv.otherUser.name}
                      className="w-10 h-10 rounded-full object-cover border border-teal-400/50"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                        conv.otherUser.isOnline ? 'bg-emerald-400' : 'bg-slate-600'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs truncate text-white">{conv.otherUser.name}</div>
                      {conv.unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[9px] font-black">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {conv.lastMessage?.text || 'No messages yet'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. RIGHT PANE: ACTIVE CHAT THREAD */}
      <div
        className={`flex-1 flex flex-col h-full bg-slate-950/90 ${
          isMobileListOpen && !selectedConversation ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {selectedConversation ? (
          <>
            {/* Thread Header */}
            <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileListOpen(true)}
                  className="lg:hidden p-1.5 rounded-xl bg-slate-950 border border-white/10 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                <div className="relative">
                  <img
                    src={
                      selectedConversation.otherUser.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
                    }
                    alt={selectedConversation.otherUser.name}
                    className="w-9 h-9 rounded-full object-cover border border-teal-400"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${
                      selectedConversation.otherUser.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                    }`}
                  />
                </div>

                <div>
                  <div className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
                    <span>{selectedConversation.otherUser.name}</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-bold">
                      {selectedConversation.otherUser.badge || 'PRO'}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono mt-0.5">
                    {Object.keys(typingUsers).length > 0 ? (
                      <span className="text-teal-400 animate-pulse">Typing...</span>
                    ) : selectedConversation.otherUser.isOnline ? (
                      <span className="text-emerald-400">Online • Live Sync</span>
                    ) : (
                      <span className="text-slate-400">Offline</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-mono">
                  ⚡ End-to-End Synced
                </span>
              </div>
            </div>

            {/* Message History List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {loadingMessages ? (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  Retrieving encrypted chat history...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                  <Dumbbell className="w-8 h-8 text-teal-400/40 mx-auto" />
                  <p className="text-xs text-slate-400 font-bold">Encrypted direct channel opened.</p>
                  <p className="text-[11px] text-slate-500">
                    Send a message to compare heart rates, schedule gym sessions, or share workout telemetry!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe =
                    msg.isMe ||
                    (msg.sender && (msg.sender === currentUserId || (msg.sender as any)._id === currentUserId));

                  return (
                    <div
                      key={msg.id || (msg as any)._id}
                      className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : ''}`}
                    >
                      <img
                        src={
                          msg.senderAvatar ||
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
                        }
                        alt="avatar"
                        className="w-7 h-7 rounded-full object-cover border border-white/15 shrink-0"
                      />
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold rounded-tr-none shadow-[0_0_15px_rgba(45,212,191,0.25)]'
                            : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
                        }`}
                      >
                        <div>{msg.text}</div>

                        {/* Workout Telemetry Attachment */}
                        {msg.workoutAttachment && (
                          <div className="mt-2 p-2 rounded-xl bg-slate-950/50 border border-white/15 text-[11px] font-mono space-y-1">
                            <div className="text-amber-300 font-bold">🏋️ {msg.workoutAttachment.workoutType}</div>
                            <div className="text-slate-300">
                              🔥 {msg.workoutAttachment.calories} kcal • ⏱️ {msg.workoutAttachment.duration}
                            </div>
                          </div>
                        )}

                        <div
                          className={`text-[9px] font-mono mt-1 text-right flex items-center justify-end gap-1 ${
                            isMe ? 'text-slate-950/80 font-bold' : 'text-slate-400'
                          }`}
                        >
                          <span>{msg.time}</span>
                          {isMe &&
                            (msg.status === 'read' ? (
                              <CheckCheck className="w-3.5 h-3.5 text-teal-950 font-black" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-white/10 flex items-center gap-2 bg-slate-900/80"
            >
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type message, share workout telemetry, or ask a question..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-sans"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(45,212,191,0.5)] disabled:opacity-40 transition"
              >
                <Send className="w-4 h-4 fill-slate-950" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
            <MessageSquare className="w-10 h-10 text-teal-400/40" />
            <h4 className="font-bold text-white text-base">Select an Athlete Conversation</h4>
            <p className="text-xs text-slate-400 max-w-sm">
              Connect with fellow athletes, share live heart rates, and push fitness performance together.
            </p>
          </div>
        )}
      </div>

      {/* 3. NEW CHAT MODAL */}
      <AnimatePresence>
        {showNewChatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-teal-500/40 shadow-2xl text-white space-y-4"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-bold text-base text-white">Start New Conversation</h3>
                <button onClick={() => setShowNewChatModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                {suggestedBuddies.map((buddy) => (
                  <div
                    key={buddy.id}
                    onClick={() => handleStartChatWithBuddy(buddy.id)}
                    className="p-3 rounded-2xl bg-slate-900/60 hover:bg-teal-500/20 border border-white/5 hover:border-teal-400/40 flex items-center justify-between cursor-pointer transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={buddy.avatar}
                        alt={buddy.name}
                        className="w-10 h-10 rounded-full object-cover border border-teal-400/40"
                      />
                      <div>
                        <div className="font-bold text-xs text-white">{buddy.name}</div>
                        <div className="text-[10px] text-slate-400">{buddy.role}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-500/10">
                      Message
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityChatView;
