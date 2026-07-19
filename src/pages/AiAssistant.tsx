import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ArrowLeft, Loader2, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const renderInlineFormatting = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

const renderFormattedText = (text: string, isTyping: boolean) => {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const isLast = i === lines.length - 1;
    const cursorEl = (isLast && isTyping) ? <span className="inline-block w-1.5 h-3.5 ml-0.5 align-middle bg-neonGreen animate-pulse shadow-[0_0_5px_#50FFB0]"></span> : null;

    if (line.startsWith('### ')) {
      return <h3 key={i} className="text-base font-bold mt-3 mb-1 text-neonBlue">{renderInlineFormatting(line.slice(4))}{cursorEl}</h3>;
    }
    if (line.startsWith('## ')) {
      return <h2 key={i} className="text-lg font-bold mt-4 mb-2 text-neonBlue">{renderInlineFormatting(line.slice(3))}{cursorEl}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={i} className="text-xl font-bold mt-5 mb-2 text-neonBlue">{renderInlineFormatting(line.slice(2))}{cursorEl}</h1>;
    }
    if (line.startsWith('- ') || line.startsWith('* ')) {
      return (
        <div key={i} className="flex ml-1 mt-1 mb-1">
          <span className="mr-2 text-neonGreen font-bold">•</span>
          <span className="flex-1">{renderInlineFormatting(line.slice(2))}{cursorEl}</span>
        </div>
      );
    }
    const match = line.match(/^(\d+)\.\s(.*)/);
    if (match) {
      return (
        <div key={i} className="flex ml-1 mt-1 mb-1">
          <span className="mr-2 font-bold text-neonBlue">{match[1]}.</span>
          <span className="flex-1">{renderInlineFormatting(match[2])}{cursorEl}</span>
        </div>
      );
    }
    if (line.trim() === '') {
      return <div key={i} className="h-1.5">{cursorEl}</div>;
    }
    return <p key={i} className="mb-2 leading-relaxed">{renderInlineFormatting(line)}{cursorEl}</p>;
  });
};

const TypewriterMessage: React.FC<{ text: string; onTyping: () => void; onComplete?: () => void }> = ({ text, onTyping, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
        onTyping(); // trigger scroll
      }, 15); // typing speed
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && !hasCompleted.current) {
      hasCompleted.current = true;
      if (onComplete) onComplete();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, text]);

  return (
    <div className="flex flex-col">
      {renderFormattedText(displayedText, currentIndex < text.length)}
    </div>
  );
};

const AiAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(true); // AI is typing initial message
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Assalamu'alaikum. Saya Asisten AI WarisSync. Ada pertanyaan seputar hukum Faraid atau pembagian warisan yang bisa saya bantu?", sender: 'ai' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Track real-time network status
  useEffect(() => {
    const checkActualConnection = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          setIsOnline(navigator.onLine);
          return;
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        await fetch(supabaseUrl, {
          method: 'HEAD',
          mode: 'no-cors',
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        setIsOnline(true);
      } catch (err) {
        setIsOnline(false);
      }
    };

    // Initial check
    checkActualConnection();

    // Event listeners for immediate state changes
    const handleOnline = () => {
      setIsOnline(true);
      checkActualConnection(); // double check if it is actually connected
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic check every 5 seconds to ensure status is always accurate
    const intervalId = setInterval(checkActualConnection, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || isTyping) return;
    
    // Add user message
    const userText = input.trim();
    const newMsg = { id: Date.now(), text: userText, sender: 'user' };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);
    
    // Check connection first
    if (!navigator.onLine) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now() + 1, 
          text: "Maaf, koneksi internet terputus. Mohon periksa kembali jaringan internet Anda dan coba lagi.", 
          sender: 'ai' 
        }]);
        setIsTyping(true);
        setIsLoading(false);
      }, 800); // Simulate thinking time for native feel
      return;
    }

    try {
      // Format history for OpenAI standard (Groq compatible)
      const chatHistory = messages.map(m => ({
        role: m.sender === 'ai' ? 'assistant' : 'user',
        content: m.text
      }));
      chatHistory.push({ role: 'user', content: userText });

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !anonKey) {
        throw new Error("Supabase URL / Key belum dikonfigurasi di .env");
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${anonKey}`
        },
        body: JSON.stringify({ messages: chatHistory }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi server AI');
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: data.reply || "Maaf, saya tidak dapat memproses permintaan tersebut.", 
        sender: 'ai' 
      }]);
      setIsTyping(true);
    } catch (error: any) {
      console.error("AI Error:", error);
      
      // If it fails due to network/internet connection issues
      const errorMessage = !navigator.onLine || error.message?.includes('Failed to fetch') || error.message?.includes('network')
        ? "Maaf, koneksi internet terputus. Mohon periksa kembali jaringan internet Anda dan coba lagi."
        : `Error: ${error.message || 'Terjadi kesalahan jaringan/server. Pastikan internet aktif dan .env terkonfigurasi.'}`;

      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: errorMessage, 
        sender: 'ai' 
      }]);
      setIsTyping(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayStoreRedirect = () => {
    window.open("https://play.google.com/store/apps/details?id=com.exatemplate.warissync", "_blank");
  };

  const handleCopy = (text: string, id: number) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(() => {
        fallbackCopyText(text, id);
      });
    } else {
      fallbackCopyText(text, id);
    }
  };

  const fallbackCopyText = (text: string, id: number) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-dark font-sans overflow-hidden">
      {/* Mobile App Container */}
      <div className="animate-slide-in-right w-full bg-[#0A0A0A] h-full relative overflow-hidden shadow-2xl shadow-neonBlue/10">
        
        {/* Header */}
        <div className="absolute top-0 left-0 w-full bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/5 p-4 pt-6 flex items-center shadow-xl z-50">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors p-2 -ml-2 rounded-full hover:bg-white/5">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-neonBlue/20 flex items-center justify-center text-neonBlue">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Konsultan AI</h2>
              {isOnline ? (
                <p className="text-[10px] text-neonGreen font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-neonGreen animate-pulse shadow-[0_0_5px_#50FFB0]"></span> Online
                </p>
              ) : (
                <p className="text-[10px] text-yellow-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span> Offline
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="absolute top-[76px] bottom-[84px] w-full overflow-y-auto p-5 space-y-5 no-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed bg-white/[0.01]">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-[13px] leading-relaxed shadow-lg ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-br from-neonBlue/90 to-blue-600/90 text-white rounded-tr-sm shadow-neonBlue/20' 
                  : 'glass-card bg-[#181818]/95 text-gray-200 rounded-tl-sm border border-white/5'
              }`}>
                {msg.sender === 'ai' ? (
                  <TypewriterMessage text={msg.text} onTyping={scrollToBottom} onComplete={() => setIsTyping(false)} />
                ) : (
                  msg.text
                )}
              </div>
              
              {/* Feedback buttons for AI messages */}
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-2 mt-1.5 ml-2 animate-fade-in">
                  <button 
                    onClick={handlePlayStoreRedirect}
                    className="p-1.5 rounded-full bg-white/[0.02] border border-white/5 text-gray-500 hover:text-neonGreen hover:bg-neonGreen/10 hover:border-neonGreen/20 transition-all active:scale-90 flex items-center justify-center"
                    title="Sukai Jawaban (Beri Rating)"
                  >
                    <ThumbsUp size={11} />
                  </button>
                  <button 
                    onClick={handlePlayStoreRedirect}
                    className="p-1.5 rounded-full bg-white/[0.02] border border-white/5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all active:scale-90 flex items-center justify-center"
                    title="Laporkan Masalah (Beri Rating)"
                  >
                    <ThumbsDown size={11} />
                  </button>
                  <button 
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className={`p-1.5 rounded-full bg-white/[0.02] border border-white/5 transition-all active:scale-90 flex items-center justify-center ${
                      copiedId === msg.id ? 'text-neonGreen border-neonGreen/20 bg-neonGreen/10' : 'text-gray-500 hover:text-neonBlue hover:bg-neonBlue/10 hover:border-neonBlue/20'
                    }`}
                    title="Salin Jawaban"
                  >
                    {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                  <span className="text-[9px] text-gray-600 font-medium ml-1">
                    {copiedId === msg.id ? 'Tersalin ke papan klip!' : 'Bantu kami menilai jawaban'}
                  </span>
                </div>
              )}

              {/* Actions toolbar for User messages */}
              {msg.sender === 'user' && (
                <div className="flex items-center gap-2 mt-1.5 mr-2 animate-fade-in">
                  {copiedId === msg.id && (
                    <span className="text-[9px] text-neonGreen font-medium mr-1">Tersalin!</span>
                  )}
                  <button 
                    onClick={() => handleCopy(msg.text, msg.id)}
                    className={`p-1.5 rounded-full bg-white/[0.02] border border-white/5 transition-all active:scale-90 flex items-center justify-center ${
                      copiedId === msg.id ? 'text-neonGreen border-neonGreen/20 bg-neonGreen/10' : 'text-gray-500 hover:text-neonBlue hover:bg-neonBlue/10 hover:border-neonBlue/20'
                    }`}
                    title="Salin Pertanyaan"
                  >
                    {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl p-4 text-[13px] leading-relaxed shadow-lg glass-card bg-[#181818]/95 text-gray-200 rounded-tl-sm border border-white/5 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-neonGreen" />
                <span className="animate-pulse">Berpikir...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full px-5 pb-6 pt-4 bg-[#0A0A0A] border-t border-white/5 z-40">
           <div className="relative flex items-center shadow-2xl">
             <input 
               type="text" 
               disabled={isLoading || isTyping}
               className="w-full bg-[#1A1A1A]/90 backdrop-blur-md border border-white/10 rounded-full py-4 pl-5 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neonBlue/50 focus:bg-[#222] transition-all shadow-inner disabled:opacity-50"
               placeholder={isLoading ? "Berpikir..." : isTyping ? "AI sedang mengetik..." : "Ketik pertanyaan Anda..."}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyPress={handleKeyPress}
             />
             <button 
                onClick={handleSend}
                disabled={isLoading || isTyping}
                className="absolute right-2 w-[2.4rem] h-[2.4rem] rounded-full bg-neonBlue flex items-center justify-center text-dark hover:scale-105 hover:shadow-[0_0_15px_rgba(0,225,255,0.5)] transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
             >
               <Send size={16} className="ml-0.5" />
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default AiAssistant;
