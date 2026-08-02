import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Image, Dumbbell, Sparkles, CheckCheck, Paperclip, Smile } from 'lucide-react';
import { sampleChatMessages, ChatMessage } from '@/data/communityData';

export const CommunityChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(sampleChatMessages);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'user-me',
      senderName: 'Daksh Gupta',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
    };

    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="w-full h-[580px] rounded-3xl bg-slate-950/90 border border-teal-500/30 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col font-sans select-none overflow-hidden">
      {/* Top Chat Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
              alt="Sarah"
              className="w-10 h-10 rounded-full object-cover border border-teal-400"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
          </div>

          <div>
            <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
              Sarah Connor <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300">PRO</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-400">Online • Typing...</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-mono">
            ⚡ Encrypted Chat
          </span>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${msg.isMe ? 'flex-row-reverse' : ''}`}
          >
            <img
              src={msg.senderAvatar}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover border border-white/15"
            />
            <div
              className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.isMe
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-bold rounded-tr-none'
                  : 'bg-slate-900 border border-white/10 text-slate-200 rounded-tl-none'
              }`}
            >
              <div>{msg.text}</div>
              <div
                className={`text-[9px] font-mono mt-1 text-right flex items-center justify-end gap-1 ${
                  msg.isMe ? 'text-slate-900/80' : 'text-slate-400'
                }`}
              >
                <span>{msg.time}</span>
                {msg.isMe && <CheckCheck className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-3 border-t border-white/10 flex items-center gap-2 bg-slate-900/80">
        <button
          type="button"
          className="p-2 rounded-xl bg-slate-950 border border-white/10 text-slate-400 hover:text-white"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type message, share workout, or audio note..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
        />

        <button
          type="submit"
          className="p-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black shadow-[0_0_15px_rgba(45,212,191,0.5)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
