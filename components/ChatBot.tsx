
import React, { useState, useRef, useEffect } from 'react';
import { assistant } from '../services/geminiService';
import { Language } from '../types';
import { TRANSLATIONS, MOCK_CANDIDATES, MOCK_EVENTS, MOCK_VOTING_CENTERS } from '../constants';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface ChatBotProps {
  lang: Language;
}

interface Message {
  text: string;
  isUser: boolean;
}

// Audio Utilities
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const ChatBot: React.FC<ChatBotProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { text: TRANSLATIONS.chatWelcome[lang], isUser: false }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<any>(null);
  const audioContextInRef = useRef<AudioContext | null>(null);
  const audioContextOutRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Listen for the custom "open-ai-call" event from the Home page CTA
  useEffect(() => {
    const handleVoiceCallRequest = () => {
      setIsOpen(true);
      if (!isCalling) {
        // We delay slightly to let the modal animate in
        setTimeout(() => startCall(), 500);
      }
    };
    window.addEventListener('open-ai-call', handleVoiceCallRequest);
    return () => window.removeEventListener('open-ai-call', handleVoiceCallRequest);
  }, [isCalling]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { text: userMsg, isUser: true }]);
    setIsTyping(true);
    const response = await assistant.ask(userMsg, lang);
    setIsTyping(false);
    setMessages(prev => [...prev, { text: response || 'Error', isUser: false }]);
  };

  const startCall = async () => {
    if (isCalling) return;
    
    // Request microphone permission early
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      alert(lang === Language.BN ? "মাইক্রোফোন অ্যাক্সেস করতে সমস্যা হচ্ছে।" : "Could not access microphone.");
      return;
    }

    setIsCalling(true);
    setMessages(prev => [...prev, { text: lang === Language.BN ? "[ভয়েস কল শুরু হয়েছে]" : "[Voice Call Started]", isUser: false }]);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const candidateContext = MOCK_CANDIDATES.map(c => `${c.name} (${c.party}): ${c.manifesto}`).join("\n");
    const centerContext = MOCK_VOTING_CENTERS.map(vc => `${vc.name} in ${vc.area}`).join("\n");
    
    const systemInstruction = `
      You are the Dhaka-17 Election Voice Assistant. 
      Speak in a friendly, formal ${lang === Language.BN ? 'Bengali' : 'English'} voice.
      Ground all answers in these candidates: ${candidateContext}
      And these centers: ${centerContext}
      Be concise. If asked about voting centers, mention specific areas like Gulshan, Banani, or Baridhara.
      Follow the Digital Security Act 2018 guidelines for neutrality.
    `;

    audioContextInRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    audioContextOutRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

    const sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          const source = audioContextInRef.current!.createMediaStreamSource(stream);
          const processor = audioContextInRef.current!.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            
            const pcmBlob: Blob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            
            sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
          };

          source.connect(processor);
          processor.connect(audioContextInRef.current!.destination);
          (window as any)._voiceStream = stream;
          (window as any)._voiceProcessor = processor;
        },
        onmessage: async (message: LiveServerMessage) => {
          const audioBase64 = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audioBase64 && audioContextOutRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextOutRef.current.currentTime);
            const buffer = await decodeAudioData(decode(audioBase64), audioContextOutRef.current, 24000, 1);
            const source = audioContextOutRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextOutRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onclose: () => endCall(),
        onerror: () => endCall()
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
        systemInstruction,
        inputAudioTranscription: {},
        outputAudioTranscription: {}
      }
    });

    sessionRef.current = await sessionPromise;
  };

  const endCall = () => {
    setIsCalling(false);
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    if ((window as any)._voiceStream) {
      (window as any)._voiceStream.getTracks().forEach((t: any) => t.stop());
    }
    if ((window as any)._voiceProcessor) {
      (window as any)._voiceProcessor.disconnect();
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setMessages(prev => [...prev, { text: lang === Language.BN ? "[ভয়েস কল শেষ হয়েছে]" : "[Voice Call Ended]", isUser: false }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[500px] shadow-2xl rounded-3xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-green-700 p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-xl">🤖</div>
              <div>
                <h3 className="font-black text-sm tracking-tight">{TRANSLATIONS.aiAssistant[lang]}</h3>
                <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest">
                  {isCalling ? (lang === Language.BN ? 'কল চলছে...' : 'On Call...') : (lang === Language.BN ? 'অনলাইন' : 'Online')}
                </p>
              </div>
            </div>
            <button onClick={() => { endCall(); setIsOpen(false); }} className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors font-bold">✕</button>
          </div>
          
          <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  m.isUser 
                  ? 'bg-green-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            
            {isCalling && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="flex gap-1 items-center h-8">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-1.5 bg-green-500 rounded-full animate-bounce" style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                <button 
                  onClick={endCall}
                  className="bg-red-500 text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-lg hover:bg-red-600 transition-all active:scale-95"
                >
                  {lang === Language.BN ? 'কল শেষ করুন' : 'End Call'}
                </button>
              </div>
            )}

            {isTyping && !isCalling && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 px-5 py-2 rounded-2xl text-xs font-black animate-pulse border border-gray-100 uppercase tracking-widest">
                  {lang === Language.BN ? 'উত্তর তৈরি হচ্ছে...' : 'Typing...'}
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t bg-white">
            <div className="flex gap-3">
              <button 
                onClick={isCalling ? endCall : startCall}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-md transition-all active:scale-90 ${
                  isCalling ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-700 hover:bg-green-100'
                }`}
                title={lang === Language.BN ? 'ভয়েস কল' : 'Voice Call'}
              >
                {isCalling ? '🛑' : '📞'}
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  disabled={isCalling}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={lang === Language.BN ? 'প্রশ্ন করুন...' : 'Ask a question...'}
                  className="w-full !bg-white !text-gray-900 border-2 border-gray-300 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-green-500 focus:bg-white transition-all disabled:opacity-50"
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={isCalling || !input.trim()}
                className="bg-green-700 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-green-800 transition-all shadow-lg active:scale-90 disabled:opacity-50"
              >
                ➔
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white w-16 h-16 rounded-[24px] shadow-2xl flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-95 group relative"
        >
          <span className="group-hover:animate-bounce">🤖</span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>
        </button>
      )}
    </div>
  );
};
