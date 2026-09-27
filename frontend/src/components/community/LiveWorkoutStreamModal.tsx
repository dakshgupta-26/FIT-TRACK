import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Users,
  Heart,
  Flame,
  Activity,
  Sparkles,
  Send,
  Radio,
  StopCircle,
} from 'lucide-react';
import { liveApi, LiveStreamSession } from '@/lib/api/liveApi';
import { connectLiveKitRoom, LiveKitSession } from '@/lib/livekit';
import {
  getSocket,
  joinLiveStreamRoom,
  leaveLiveStreamRoom,
  emitLiveMessage,
  emitLiveReaction,
  emitLiveTelemetry,
} from '@/lib/socket';
import { toast } from 'sonner';

interface LiveWorkoutStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId?: string;
  isViewer?: boolean;
}

interface LiveChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  time: string;
}

interface FloatingReaction {
  id: string;
  reaction: string;
  x: number;
}

export const LiveWorkoutStreamModal: React.FC<LiveWorkoutStreamModalProps> = ({
  isOpen,
  onClose,
  streamId,
  isViewer = false,
}) => {
  const [streamData, setStreamData] = useState<LiveStreamSession | null>(null);
  const [viewerCount, setViewerCount] = useState(1);
  const [comments, setComments] = useState<LiveChatMessage[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const [reactions, setReactions] = useState<FloatingReaction[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Host Controls
  const [streamTitle, setStreamTitle] = useState('High-Intensity Functional & HR Sync');
  const [workoutType, setWorkoutType] = useState('HIIT Sprints & Kettlebell');
  const [currentHR, setCurrentHR] = useState(165);
  const [caloriesBurned, setCaloriesBurned] = useState(520);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const videoElementRef = useRef<HTMLVideoElement>(null);
  const livekitSessionRef = useRef<LiveKitSession | null>(null);
  const activeStreamIdRef = useRef<string | null>(null);

  // 1. Initialize Live Stream (Host creates OR Viewer joins)
  const initializeStream = async () => {
    setConnecting(true);

    try {
      let sessionRes;

      if (isViewer && streamId) {
        // Viewer flow: fetch viewer token
        sessionRes = await liveApi.joinStream(streamId);
      } else {
        // Host flow: initiate new live stream
        sessionRes = await liveApi.createStream({
          title: streamTitle,
          workoutType,
          avgHeartRate: currentHR,
          caloriesBurned,
        });
      }

      const { stream, token, livekitWsUrl } = sessionRes.data;
      setStreamData(stream);
      activeStreamIdRef.current = stream.id;

      // Join Socket.IO room for live chat & viewer counts
      joinLiveStreamRoom(stream.id, (res) => {
        if (res?.count) setViewerCount(res.count);
      });

      // Connect to LiveKit WebRTC room
      try {
        const livekitSession = await connectLiveKitRoom({
          wsUrl: livekitWsUrl,
          token,
          isHost: !isViewer,
          onRemoteTrackSubscribed: (track) => {
            if (videoElementRef.current && track.kind === 'video') {
              track.attach(videoElementRef.current);
            }
          },
          onDisconnected: () => {
            setIsLive(false);
          },
        });

        livekitSessionRef.current = livekitSession;

        // If host, attach local track to video preview
        if (!isViewer && livekitSession.localVideoTrack && videoElementRef.current) {
          livekitSession.localVideoTrack.attach(videoElementRef.current);
        }
      } catch (lkErr: any) {
        console.warn('LiveKit WebRTC notice (preview fallback active):', lkErr.message);
      }

      setIsLive(true);
      toast.success(isViewer ? 'Joined Live Broadcast' : '🔴 You are now LIVE on FitTracker!');
    } catch (err: any) {
      console.error('Failed to initialize stream:', err);
      toast.error(err?.response?.data?.message || err.message || 'Unable to start live stream');
      onClose();
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      initializeStream();
    }

    return () => {
      handleCleanup();
    };
  }, [isOpen]);

  const handleCleanup = () => {
    if (activeStreamIdRef.current) {
      leaveLiveStreamRoom(activeStreamIdRef.current);
    }
    if (livekitSessionRef.current) {
      livekitSessionRef.current.disconnect();
      livekitSessionRef.current = null;
    }
    setIsLive(false);
  };

  // 2. Socket Listeners for Live Chat, Viewer Count, Reactions
  useEffect(() => {
    if (!isLive) return;

    const socket = getSocket();

    const handleLiveMessage = (msg: LiveChatMessage) => {
      setComments((prev) => [...prev.slice(-30), msg]);
    };

    const handleViewerCount = ({ count }: { count: number }) => {
      setViewerCount(count);
    };

    const handleReaction = ({ reaction }: { reaction: string }) => {
      const newReaction: FloatingReaction = {
        id: `react-${Date.now()}-${Math.random()}`,
        reaction,
        x: Math.floor(Math.random() * 80) + 10,
      };
      setReactions((prev) => [...prev, newReaction]);

      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
      }, 2500);
    };

    socket.on('live:message', handleLiveMessage);
    socket.on('live:viewerCount', handleViewerCount);
    socket.on('live:reaction', handleReaction);

    return () => {
      socket.off('live:message', handleLiveMessage);
      socket.off('live:viewerCount', handleViewerCount);
      socket.off('live:reaction', handleReaction);
    };
  }, [isLive]);

  // 3. Send Live Message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !activeStreamIdRef.current) return;

    const streamId = activeStreamIdRef.current;
    const text = inputMsg.trim();
    setInputMsg('');

    emitLiveMessage(streamId, text);
  };

  // 4. Send Live Reaction
  const handleReactionClick = (emoji: string) => {
    if (!activeStreamIdRef.current) return;
    emitLiveReaction(activeStreamIdRef.current, emoji);
  };

  // 5. Host Toggles
  const toggleCamera = () => {
    if (livekitSessionRef.current) {
      livekitSessionRef.current.toggleVideo(isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  const toggleMic = () => {
    if (livekitSessionRef.current) {
      livekitSessionRef.current.toggleAudio(isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const handleEndStream = async () => {
    if (activeStreamIdRef.current && !isViewer) {
      try {
        await liveApi.endStream(activeStreamIdRef.current);
        toast.info('Live broadcast concluded.');
      } catch (e) {}
    }
    handleCleanup();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl font-sans select-none overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl h-[90vh] sm:h-[680px] rounded-3xl bg-slate-950 border border-teal-500/40 shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col text-white"
        >
          {/* Main Video Area */}
          <div className="relative flex-1 w-full overflow-hidden bg-slate-950">
            {/* LiveKit WebRTC Video Stream Player */}
            <video
              ref={videoElementRef}
              autoPlay
              playsInline
              muted={!isViewer}
              className="w-full h-full object-cover"
            />

            {/* Ambient Background Glow & Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40 pointer-events-none" />

            {/* Top Bar Status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse">
                  <Radio className="w-3.5 h-3.5 animate-spin" />
                  <span>{isLive ? 'LIVE' : 'CONNECTING...'}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/20 text-xs font-mono text-slate-200 flex items-center gap-1.5 backdrop-blur-md">
                  <Users className="w-3.5 h-3.5 text-teal-400" />
                  <span>{viewerCount.toLocaleString()} Viewers</span>
                </span>
              </div>

              {/* Host Controls & Close */}
              <div className="flex items-center gap-2">
                {!isViewer && (
                  <>
                    <button
                      onClick={toggleCamera}
                      className={`p-2 rounded-full border backdrop-blur-md transition ${
                        isVideoMuted
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-slate-900/80 border-white/20 text-white'
                      }`}
                      title={isVideoMuted ? 'Turn Camera On' : 'Turn Camera Off'}
                    >
                      {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={toggleMic}
                      className={`p-2 rounded-full border backdrop-blur-md transition ${
                        isAudioMuted
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-slate-900/80 border-white/20 text-white'
                      }`}
                      title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
                    >
                      {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={handleEndStream}
                      className="px-3 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(225,29,72,0.5)] transition"
                    >
                      <StopCircle className="w-4 h-4" />
                      <span>End Stream</span>
                    </button>
                  </>
                )}

                <button
                  onClick={handleEndStream}
                  className="p-2 rounded-full bg-slate-900/80 border border-white/20 text-white hover:bg-slate-800 transition"
                  aria-label="Close live stream"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Live HR & Calories Telemetry Overlay */}
            <div className="absolute top-16 left-4 flex flex-wrap gap-2 z-20 font-mono text-xs font-bold">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>{currentHR} BPM</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 backdrop-blur-md shadow-lg">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{caloriesBurned} kcal</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-teal-500/40 text-teal-300 backdrop-blur-md shadow-lg">
                {workoutType}
              </span>
            </div>

            {/* Animated Floating Reactions */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {reactions.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ y: '85%', x: `${r.x}%`, opacity: 1, scale: 0.8 }}
                  animate={{ y: '10%', opacity: 0, scale: 1.6 }}
                  transition={{ duration: 2.2, ease: 'easeOut' }}
                  className="absolute text-3xl drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                >
                  {r.reaction}
                </motion.div>
              ))}
            </div>

            {/* Floating Live Comments Overlay */}
            <div className="absolute bottom-20 left-4 right-24 max-h-44 overflow-y-auto space-y-1.5 z-20 custom-scrollbar pointer-events-auto">
              {comments.length === 0 ? (
                <div className="px-3 py-1 rounded-xl bg-slate-950/70 border border-white/10 text-[11px] text-slate-400 inline-block backdrop-blur-md">
                  Live chat initialized. Send workout reactions!
                </div>
              ) : (
                comments.map((c, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-white/10 text-xs backdrop-blur-md inline-block max-w-full"
                  >
                    <span className="font-bold text-teal-300 mr-2">{c.senderName}:</span>
                    <span className="text-slate-100">{c.text}</span>
                  </motion.div>
                ))
              )}
            </div>

            {/* Floating Quick Reaction Buttons */}
            <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-20">
              {['❤️', '🔥', '👏', '💪', '⚡'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="p-2.5 rounded-full bg-slate-950/80 border border-white/20 text-lg hover:scale-125 transition backdrop-blur-md shadow-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Live Chat Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-slate-900 border-t border-white/10 flex gap-2 z-30"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Send live encouragement, ask trainer form questions..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-sans"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(45,212,191,0.4)] disabled:opacity-40 transition"
            >
              <Send className="w-3.5 h-3.5 fill-slate-950" />
              <span>Send</span>
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LiveWorkoutStreamModal;
