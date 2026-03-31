import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ role: string, content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLog, loading]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const newLog = [...chatLog, { role: 'user', content: message }];
    setChatLog(newLog);
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/chat', { message }, {
        headers: { 'Content-Type': 'application/json' }
      });
      
      setChatLog([...newLog, { role: 'bot', content: response.data.reply }]);
    } catch (error: any) {
      let errorDisplay = "Problème de connexion au serveur.";
      if (error.response) {
        errorDisplay = error.response.data.reply || `Erreur: ${error.response.status}`;
      }
      setChatLog([...newLog, { role: 'bot', content: errorDisplay }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans">
      {/* Bot Button مع كلمة Assistante */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#567c6d] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:bg-[#456357] transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        {isOpen ? (
          <span className="text-xl px-2">✕</span>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-semibold tracking-wide">Assistante</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 max-sm:w-[85vw] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-500">
          
          {/* Header - تم توحيد الخط ووضعه في الوسط */}
          <div className="bg-[#567c6d] p-5 text-white flex flex-col items-center justify-center shadow-sm text-center">
            <h3 className="font-bold text-lg tracking-normal">RoomAI Assistant</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <p className="text-[10px] opacity-90 uppercase tracking-[0.2em] font-light">En ligne</p>
            </div>
          </div>
          
          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="h-[400px] overflow-y-auto p-5 space-y-4 bg-gray-50/50"
          >
            {chatLog.length === 0 && (
              <div className="text-center py-12 px-6">
                <p className="text-gray-400 text-sm leading-relaxed">
                  Bienvenue. Posez-moi vos questions sur le design d'intérieur ou la décoration.
                </p>
              </div>
            )}
            
            {chatLog.map((chat, index) => (
              <div 
                key={index} 
                className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    chat.role === 'user' 
                    ? 'bg-[#567c6d] text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-none'
                  }`}
                >
                  {chat.content}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.5s]"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="w-full bg-gray-100 border-none rounded-2xl px-5 py-3.5 pr-14 text-sm outline-none focus:ring-1 focus:ring-[#567c6d]/30 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={loading || !message.trim()}
                className="absolute right-2 p-2.5 bg-[#567c6d] text-white rounded-xl disabled:opacity-30 hover:bg-[#456357] transition-all active:scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
            <p className="mt-3 text-[9px] text-center text-gray-400 uppercase tracking-tighter opacity-60">Powered by Gemini & RoomAI</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;