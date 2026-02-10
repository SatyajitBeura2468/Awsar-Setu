import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, X, ExternalLink } from 'lucide-react';
import { ChatMessage, Scheme } from '../types';
import { chatWithGemini } from '../services/geminiService';

interface ChatBotProps {
  scheme: Scheme;
  onClose?: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ scheme, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Namaste! I'm your Awsar Sahayak. I am connected to live government data for **${scheme.title}**. Ask me about deadlines, documents, or how to apply!`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Prepare history for API
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      const responseText = await chatWithGemini(userMsg.text, scheme, history);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Helper to render text with bolding and links
  const renderMessageText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Check for Markdown links: [Title](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <a 
            key={match.index} 
            href={match[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline inline-flex items-center gap-0.5 hover:text-blue-800"
          >
            {match[1]} <ExternalLink size={10} />
          </a>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      // If no links, process bolding
      if (parts.length === 0) {
         const boldParts = line.split(/(\*\*[^*]+\*\*)/g).map((part, idx) => {
             if (part.startsWith('**') && part.endsWith('**')) {
                 return <strong key={idx}>{part.replace(/\*\*/g, '')}</strong>;
             }
             return part;
         });
         return <p key={i} className={`min-h-[1rem] ${line.startsWith('-') ? 'ml-2' : ''}`}>{boldParts}</p>;
      }

      return <p key={i} className={`min-h-[1rem] ${line.startsWith('-') ? 'ml-2' : ''}`}>{parts}</p>;
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-100 shadow-sm z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-yellow-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 animate-pulse">
            <Bot size={20} />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Awsar Sahayak</h4>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <p className="text-xs text-slate-500">Live & Grounded</p>
            </div>
          </div>
        </div>
        {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X size={20} />
            </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] md:max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-gov-blue text-white rounded-tr-none'
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}
            >
              {renderMessageText(msg.text)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-2 py-1.5 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition-all shadow-sm">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask doubts about eligibility, dates..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-sm text-slate-800 placeholder:text-slate-400"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 bg-brand-500 text-white rounded-full hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-brand-500/20"
          >
            {isTyping ? <Sparkles size={18} className="animate-pulse" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;