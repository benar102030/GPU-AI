// ئەم کۆمپۆنێنتە تەواوی ڕووکاری چاتەکە بەڕێوەدەبات.
// This component manages the entire chat interface.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AiAssistant, AiSpecialty, Message, GroundingSource, Part as MessagePart, InlineDataPart, SavedChat } from '../types';
import ai from '../services/geminiService';
import { GenerateContentResponse, Modality, Part as GeminiPart, Content } from '@google/genai';
import { PlusIcon, SaveIcon, MicrophoneIcon, CopyIcon, RefreshIcon, PencilIcon, CheckIcon, DocumentTextIcon, StopIcon, ExportIcon } from './icons/Icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';


// ناساندنی تایپەکان بۆ Web Speech API کە لە هەموو وێبگەڕەکاندا ستاندارد نییە.
// Web Speech API type declaration
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

// کۆمپۆنێنتێکی بچووک بۆ ئایکۆنەکانی ناوخۆیی
// Small components for internal icons
const BackArrowIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const SendIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const PaperclipIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.122 2.122l7.81-7.81" />
  </svg>
);

const UserIcon: React.FC<{ className?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
  </svg>
);

// کۆمپۆنێنتی تایبەت بە پیشاندانی بلۆکی کۆد لەگەڵ Syntax Highlighting
const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const code = String(children).replace(/\n$/, '');
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return !inline && match ? (
        <div className="relative my-4 text-sm">
            <div className="flex items-center justify-between px-4 py-1.5 bg-slate-800 rounded-t-lg border-b border-slate-700">
                <span className="text-xs text-slate-400">{match[1]}</span>
                <button 
                    onClick={handleCopy} 
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                    <CopyIcon className="w-3 h-3"/>
                    {copied ? 'کۆپیکرا!' : 'کۆپی'}
                </button>
            </div>
            <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={atomDark}
                language={match[1]}
                PreTag="div"
                {...props}
                customStyle={{ 
                    margin: 0, 
                    padding: '1rem', 
                    backgroundColor: '#0f172a',
                    borderRadius: '0 0 0.5rem 0.5rem'
                }}
                codeTagProps={{
                    style: {
                        fontFamily: "monospace"
                    }
                }}
            />
        </div>
    ) : (
        <code className={className} {...props}>
            {children}
        </code>
    );
};

// پێناسەکردنی پرۆپسەکانی کۆمپۆنێنتی ChatPage
// Defining the props for the ChatPage component.
interface ChatPageProps {
  assistant: AiAssistant; // زانیاری دەربارەی یاریدەدەری هەڵبژێردراو
  onBack: () => void; // فەنکشن بۆ گەڕانەوە بۆ پەڕەی سەرەکی
  initialMessages: Message[]; // پەیامەکانی پێشوو (ئەگەر چاتێکی پاشەکەوتکراو بکرێتەوە)
}

const ChatPage: React.FC<ChatPageProps> = ({ assistant, onBack, initialMessages }) => {
  // --- ستەیتەکان (States) ---
  const [messages, setMessages] = useState<Message[]>(initialMessages.map(m => ({ ...m, id: m.id || Date.now().toString() })));
  const [input, setInput] = useState(''); // ستەیت بۆ نووسینی بەکارهێنەر
  const [isLoading, setIsLoading] = useState(false); // ستەیت بۆ نیشاندانی دۆخی بارکردن
  const [error, setError] = useState<string | null>(null); // ستەیت بۆ نیشاندانی هەڵە
  const [uploadedFile, setUploadedFile] = useState<{ name: string; content: string; mimeType: string; } | null>(null); // ستەیت بۆ فایلی بارکراو
  const [saveMessage, setSaveMessage] = useState<string>(''); // پەیامی سەرکەوتنی پاشەکەوتکردن
  
  const [isRecording, setIsRecording] = useState(false); // ستەیت بۆ زانینی ئەوەی کە دەنگ تۆماردەکرێت یان نا
  const recognitionRef = useRef<any>(null); // ڕێفەرێنس بۆ هەڵگرتنی ئۆبجێکتی SpeechRecognition

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null); // ستەیت بۆ هەڵگرتنی ئایدی ئەو پەیامەی دەستکاری دەکرێت
  const [isExporting, setIsExporting] = useState(false); // ستەیت بۆ کردنەوەی مێنیوی ناردنەدەرەوە


  // --- ڕێفەرێنسەکان (Refs) ---
  const messagesEndRef = useRef<HTMLDivElement>(null); // بۆ سکڕۆڵکردنی خودکارانە بۆ خوارەوەی پەیامەکان
  const fileInputRef = useRef<HTMLInputElement>(null); // بۆ کردنەوەی پەنجەرەی هەڵبژاردنی فایل
  const textareaRef = useRef<HTMLTextAreaElement>(null); // بۆ فۆکەس کردنە سەر ئینپوتی نووسین
  const isCancelledRef = useRef(false); // بۆ ڕاگرتنی وەڵامی ستریم

  // دیاریکردنی ناوی مۆدێلی Gemini بەپێی جۆری یاریدەدەرەکە
  const getModelForAssistant = (): string => {
    switch (assistant.id) {
      case AiSpecialty.CODE_INTERPRETER:
      case AiSpecialty.MATH_SOLVER:
        return 'gemini-2.5-pro'; // مۆدێلی بەهێزتر بۆ کارە ئاڵۆزەکان
      case AiSpecialty.IMAGE_CREATOR:
        return 'gemini-2.5-flash-image'; // مۆدێلی تایبەت بە دروستکردنی وێنە
      default:
        return 'gemini-2.5-flash'; // مۆدێلی خێرا بۆ کارە گشتییەکان
    }
  };

  // useEffect بۆ سکڕۆڵکردن بۆ دوایین پەیام هەرکاتێک لیستەکە گۆڕا
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- فەنکشنی سەرەکی بۆ ناردنی پەیام ---
  const handleSendMessage = useCallback(async (prompt: string) => {
    // ئەگەر لەکاتی بارکردندابوو یان هیچ نووسین و فایلێک نەبوو، هیچ مەکە
    if (isLoading || (!prompt.trim() && !uploadedFile)) return;

    setIsLoading(true);
    setError(null);
    setInput('');
    isCancelledRef.current = false;
    
    // --- بەڕێوەبردنی ستەیتی پەیامەکان لە UI ---
    let userMessage: Message;
    let baseMessages: Message[];

    if (editingMessageId) {
        // ئەگەر لە دۆخی دەستکاریکردندا بووین
        const editedMessageIndex = messages.findIndex(m => m.id === editingMessageId);
        if (editedMessageIndex === -1) {
            setIsLoading(false);
            return;
        }

        // بڕینی پەیامەکان تا پێش ئەو پەیامەی دەستکاری کراوە
        baseMessages = messages.slice(0, editedMessageIndex);
        userMessage = { id: editingMessageId, role: 'user', parts: [{ text: prompt }] };
        setMessages([...baseMessages, userMessage]); // زیادکردنی پەیامە دەستکاریکراوەکە
    } else {
        // ئەگەر پەیامێکی نوێ بوو
        baseMessages = [...messages];
        userMessage = { id: Date.now().toString(), role: 'user', parts: [] };
        if (uploadedFile) {
            userMessage.parts.push({
                inlineData: { data: uploadedFile.content, mimeType: uploadedFile.mimeType },
            });
        }
        if (prompt.trim()) {
            userMessage.parts.push({ text: prompt });
        }
        setMessages(prev => [...prev, userMessage]);
    }
    
    const currentUploadedFile = uploadedFile; // هەڵگرتنی فایلی ئێستا بۆ ناردن
    setUploadedFile(null); // پاککردنەوەی فایلی بارکراو لە UI

    // زیادکردنی پەیامێکی مۆدێلی بەتاڵ بۆ نیشاندانی دۆخی بارکردن
    const tempModelMessageId = Date.now().toString() + '-model';
    setMessages(prev => [...prev, { id: tempModelMessageId, role: 'model', parts: [{ text: '' }] }]);

    try {
        // --- ئامادەکاری بۆ ناردنی داواکاری بۆ Gemini API ---
        const modelName = getModelForAssistant();
        const config: any = { systemInstruction: assistant.systemInstruction };

        const history: Content[] = baseMessages.map(msg => ({
            role: msg.role,
            parts: msg.parts.map(p => ('text' in p ? { text: p.text } : { inlineData: p.inlineData })) as GeminiPart[]
        }));
        
        const userMessagePartsForApi: GeminiPart[] = userMessage.parts.map(p => ('text' in p ? { text: p.text } : { inlineData: p.inlineData })) as GeminiPart[]

        const contents: Content[] = [...history, { role: 'user', parts: userMessagePartsForApi }];
        
        // دانانی ڕێکخستنی تایبەت بۆ هەندێک یاریدەدەر
        if (assistant.id === AiSpecialty.IMAGE_CREATOR) {
            config.responseModalities = [Modality.IMAGE];
        } else if (assistant.id === AiSpecialty.WEB_RESEARCHER) {
            config.tools = [{ googleSearch: {} }];
        }
        
        if (editingMessageId) setEditingMessageId(null); // ڕีسێتکردنی دۆخی دەستکاریکردن
        
        // --- ناردنی داواکاری و وەرگرتنی وەڵامی ستریم ---
        const stream = await ai.models.generateContentStream({
            model: modelName,
            contents,
            config
        });


        let fullResponseText = ''; // بۆ کۆکردنەوەی هەموو پارچە تێکستەکان
        let fullResponseParts: MessagePart[] = []; // بۆ هەموو بەشەکانی وەڵام (تێکست و وێنە)
        let groundingSources: GroundingSource[] = []; // بۆ سەرچاوەکانی وێب

        // لوپکردن بەسەر هەر پارچەیەک (chunk) لە ستریمەکە
        for await (const chunk of stream) {
            if (isCancelledRef.current) break; // پشکنینی ئەوەی کە بەکارهێنەر داوای ڕاگرتنی کردووە
            
            if (chunk.text) {
                fullResponseText += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].parts = [{ text: fullResponseText }];
                    return newMessages;
                });
            }

            const sources = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (sources) {
                groundingSources = sources.map((s: any) => ({
                    uri: s.web?.uri || s.maps?.uri,
                    title: s.web?.title || s.maps?.title,
                })).filter((s: GroundingSource) => s.uri);
            }

            const imageParts = chunk.candidates?.[0]?.content?.parts?.filter(p => p.inlineData);
            if (imageParts && imageParts.length > 0) {
                 fullResponseParts.push(...imageParts.map(p => ({
                    inlineData: {
                        mimeType: p.inlineData!.mimeType,
                        data: p.inlineData!.data
                    }
                } as InlineDataPart)))
            }
        }
        
        if (fullResponseText.trim()) {
            fullResponseParts.unshift({ text: fullResponseText });
        }
        
        // --- نوێکردنەوەی کۆتایی ستەیتی پەیامەکان ---
        setMessages(prev => {
            const newMessages = [...prev];
            // FIX: Explicitly type `finalModelMessage` as `Message` to prevent TypeScript from incorrectly inferring the `role` property as a generic `string`.
            const finalModelMessage: Message = {
                id: tempModelMessageId,
                role: 'model',
                parts: fullResponseParts.length > 0 ? fullResponseParts : [{ text: 'ببورە، نەمتوانی وەڵامێک بەرهەم بهێنم.' }],
                groundingSources: groundingSources.length > 0 ? groundingSources : undefined,
            };

            // ئەگەر وەڵام بەتاڵ بوو (بۆ نموونە بەهۆی ڕاگرتنەوە)، پەیامی کاتی بسڕەوە
            if(finalModelMessage.parts.length === 0 || (finalModelMessage.parts.length === 1 && 'text' in finalModelMessage.parts[0] && finalModelMessage.parts[0].text.trim() === '')) {
                return newMessages.slice(0, -1);
            }

            newMessages[newMessages.length - 1] = finalModelMessage;
            return newMessages;
        });

    } catch (e: any) {
        // --- بەڕێوەبردنی هەڵە ---
        console.error(e);
        setError(`هەڵەیەک ڕوویدا: ${e.message}`);
        setMessages(prev => prev.slice(0, -1)); // سڕینەوەی پەیامی مۆدێلی بەتاڵ
    } finally {
        setIsLoading(false); // کۆتاییهێنان بە دۆخی بارکردن
        isCancelledRef.current = false;
    }
  }, [isLoading, uploadedFile, assistant, messages, editingMessageId]);
  
  // --- بەڕێوەبردنی نووسینی دەنگی (Voice Input) ---
  useEffect(() => {
    // پشکنینی ئەوەی کە وێبگەڕ پشتگیری دەکات یان نا
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false; // تەنها یەکجار گوێ دەگرێت
      recognition.interimResults = false; // ئەنجامی کاتی ناگەڕێنێتەوە
      recognition.lang = 'ku-IQ'; // زمانی کوردی (عێراق)

      recognition.onstart = () => setIsRecording(true); // کاتێک دەست دەکات بە تۆمارکردن
      recognition.onend = () => setIsRecording(false); // کاتێک تۆمارکردن تەواو دەبێت
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript; // وەرگرتنی تێکستی وتراو
        setInput(transcript); // دانانی لەناو ئینپوت
        handleSendMessage(transcript); // ناردنی ڕاستەوخۆ
      };
      recognitionRef.current = recognition; // هەڵگرتنی ئۆبجێکتەکە لە ref
    }
  }, [handleSendMessage]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
        alert("ببورە، وێبگەڕەکەت پشتگیری لە نووسینی دەنگی ناکات.");
        return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleStopGeneration = () => {
    isCancelledRef.current = true;
  };


  // --- فەنکشنە یارمەتیدەرەکان ---

  // گۆڕینی فایل بۆ stringی base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  // کاتێک بەکارهێنەر فایلێک هەڵدەبژێرێت
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        setUploadedFile({
          name: file.name,
          content: base64String,
          mimeType: file.type,
        });
      } catch (e) {
        setError('هەڵەیەک لە خوێندنەوەی فایلەکەدا ڕوویدا.');
      }
    }
  };

  // دووبارە بەرهەمهێنانەوەی وەڵامی دوایین پرسیار
  const handleRegenerate = useCallback(() => {
    const lastUserMessageIndex = messages.map(m => m.role).lastIndexOf('user');
    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];
    const textPart = lastUserMessage.parts.find(p => 'text' in p) as { text: string } | undefined;
    
    if (textPart) {
        // سڕینەوەی وەڵامی پێشووی مۆدێل و پەیامەکانی دوای
        const messagesForResend = messages.slice(0, lastUserMessageIndex + 1);
        setMessages(messagesForResend);
        // ناردنی هەمان پرسیار
        handleSendMessage(textPart.text);
    }
  }, [messages, handleSendMessage]);

  // دەستکاریکردنی پەیامی بەکارهێنەر
  const handleEdit = (messageId: string) => {
    const messageToEdit = messages.find(m => m.id === messageId);
    const textPart = messageToEdit?.parts.find(p => 'text' in p) as { text: string } | undefined;
    if (textPart) {
        setEditingMessageId(messageId);
        setInput(textPart.text);
        textareaRef.current?.focus();
    }
  };

  // کۆپیکردنی تێکستی وەڵام
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('کۆپیکرا!');
  };

  // دەستپێکردنی گفتوگۆیەکی نوێ
  const handleNewChat = () => {
    if (messages.length > 0 && window.confirm('دڵنیایت دەتەوێت گفتوگۆیەکی نوێ دەستپێبکەیت؟ گفتوگۆی ئێستات پاک دەبێتەوە.')) {
        setMessages([]);
        setError(null);
        setUploadedFile(null);
        setInput('');
    }
  };

  // پاشەکەوتکردنی گفتوگۆی ئێستا
  const handleSaveChat = () => {
    if (messages.length === 0) {
      alert('ناتوانیت گفتوگۆی بەتاڵ پاشەکەوت بکەیت.');
      return;
    }
    const firstUserMessage = messages.find(m => m.role === 'user');
    const titleText = firstUserMessage?.parts.find(p => 'text' in p) as { text: string } | undefined;
    const newChat: SavedChat = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        assistantId: assistant.id,
        title: titleText?.text.substring(0, 50) || `گفتوگۆ لەگەڵ ${assistant.title}`,
        messages: messages,
    };
    const savedChats: SavedChat[] = JSON.parse(localStorage.getItem('gpu-ai-saved-chats') || '[]');
    savedChats.push(newChat);
    localStorage.setItem('gpu-ai-saved-chats', JSON.stringify(savedChats));
    setSaveMessage('گفتوگۆکە بە سەرکەوتوویی پاشەکەوتکرا!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // ناردنەدەرەوەی گفتوگۆ
  const handleExport = (format: 'md' | 'txt') => {
    if (messages.length === 0) return;

    const content = messages.map(msg => {
        const role = msg.role === 'user' ? 'بەکارهێنەر' : assistant.title;
        // FIX: The .join() method was incorrectly placed inside the map() callback. It should be called on the array returned by map().
        const textContent = msg.parts.map(p => ('text' in p ? p.text : '[وێنە/فایل]')).join('\n');
        if (format === 'md') {
            return `**${role}:**\n\n${textContent}\n\n---\n\n`;
        }
        return `${role}:\n${textContent}\n\n--------------------------------\n\n`;
    }).join('');

    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GPU-AI Chat - ${new Date().toISOString()}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* --- Header --- */}
      <header className="flex items-center justify-between p-4 border-b border-slate-700/50 sticky top-0 bg-slate-900/80 backdrop-blur-sm z-20">
        <div className="flex items-center">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Back to home">
            <BackArrowIcon className="w-6 h-6" />
            </button>
            <div className="flex items-center ml-4">
            <div className="bg-slate-800 rounded-full p-2 border border-slate-700">
                {assistant.icon({ className: 'w-8 h-8 text-cyan-400' })}
            </div>
            <div className="ml-3">
                <h2 className="text-lg font-bold">{assistant.title}</h2>
                <p className="text-sm text-slate-400">{assistant.name}</p>
            </div>
            </div>
        </div>
        <div className="flex items-center gap-1 relative">
            <div className="relative">
                 <button onClick={() => setIsExporting(!isExporting)} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Export Chat" title="ناردنەدەرەوەی گفتوگۆ">
                    <ExportIcon className="w-6 h-6" />
                </button>
                {isExporting && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-30">
                        <button onClick={() => handleExport('md')} className="block w-full text-right px-4 py-2 text-sm text-white hover:bg-slate-700">Markdown وەک</button>
                        <button onClick={() => handleExport('txt')} className="block w-full text-right px-4 py-2 text-sm text-white hover:bg-slate-700">Text وەک</button>
                    </div>
                )}
            </div>
            <button onClick={handleSaveChat} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="Save Chat" title="پاشەکەوتکردنی گفتوگۆ">
                <SaveIcon className="w-6 h-6" />
            </button>
            <button onClick={handleNewChat} className="p-2 rounded-full hover:bg-slate-700 transition-colors" aria-label="New Chat" title="گفتوگۆی نوێ">
                <PlusIcon className="w-6 h-6" />
            </button>
        </div>
      </header>

      {/* --- Main Chat Area --- */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-8 animate-fade-in">
            <div className="inline-block bg-slate-800 rounded-full p-4 border border-slate-700 mb-4">
                {assistant.icon({ className: 'w-16 h-16 text-cyan-400' })}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{assistant.title}</h2>
            <p className="max-w-md mx-auto mb-8">{assistant.description}</p>
            {assistant.examplePrompts && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {assistant.examplePrompts.map((prompt, i) => (
                  <button key={i} onClick={() => { setInput(prompt); handleSendMessage(prompt); }} className="bg-slate-800/80 p-4 rounded-lg text-right text-sm hover:bg-slate-700/80 transition-colors border border-slate-700">{prompt}</button>
                ))}
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={msg.id} className={`group flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'model' && (<div className="w-8 h-8 flex-shrink-0 bg-slate-800 rounded-full p-1.5 border border-slate-700 self-start"><assistant.icon className="w-full h-full text-cyan-400" /></div>)}
              <div className={`w-full max-w-xl space-y-2 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`relative inline-block rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-600 rounded-br-none' : 'bg-slate-800 rounded-bl-none'}`}>
                  {msg.parts.map((part, partIndex) => {
                    if ('text' in part) return <ReactMarkdown key={partIndex} className="prose prose-invert prose-p:my-2 prose-headings:my-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 max-w-none" children={part.text + (isLoading && index === messages.length - 1 ? '▍' : '')} remarkPlugins={[remarkGfm]} components={{ code: CodeBlock }} />;
                    if ('inlineData' in part) return <img key={partIndex} src={`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`} alt="Uploaded content" className="rounded-lg mt-2 max-w-sm h-auto" />;
                    return null;
                  })}
                </div>
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="text-xs text-slate-400 pt-2 space-y-1 text-right">
                        <h4 className="font-bold">سەرچاوەکان:</h4>
                        {msg.groundingSources.map((source, i) => (<a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="block truncate text-cyan-400 hover:underline">{i + 1}. {source.title || source.uri}</a>))}
                    </div>
                )}
              </div>
              <div className={`self-end flex-shrink-0 flex gap-1 transition-opacity opacity-0 group-hover:opacity-100 ${msg.role === 'user' ? 'flex-row-reverse mr-3' : 'ml-3'}`}>
                {msg.role === 'model' && !isLoading && (
                    <>
                        <button onClick={() => handleCopy(msg.parts.map(p => 'text' in p ? p.text : '').join('\n'))} className="p-1.5 rounded-full hover:bg-slate-700" title="کۆپیکردن"><CopyIcon className="w-4 h-4 text-slate-400" /></button>
                        {index === messages.length - 1 && <button onClick={handleRegenerate} className="p-1.5 rounded-full hover:bg-slate-700" title="دووبارە دروستکردنەوە"><RefreshIcon className="w-4 h-4 text-slate-400" /></button>}
                    </>
                )}
                {msg.role === 'user' && !isLoading && (
                    <button onClick={() => handleEdit(msg.id)} className="p-1.5 rounded-full hover:bg-slate-700" title="دەستکاریکردن"><PencilIcon className="w-4 h-4 text-slate-400" /></button>
                )}
              </div>
              {msg.role === 'user' && (<div className="w-8 h-8 flex-shrink-0 bg-slate-800 rounded-full p-1.5 border border-slate-700 self-start"><UserIcon className="w-full h-full text-slate-400" /></div>)}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* --- Footer (Input Area) --- */}
      <footer className="p-4 border-t border-slate-700/50 sticky bottom-0 bg-slate-900 z-10">
        {saveMessage && <div className="text-green-400 text-sm mb-2 text-center animate-fade-out">{saveMessage}</div>}
        {error && <div className="text-red-400 text-sm mb-2 text-center">{error}</div>}
        
        {isLoading && (
            <div className="flex justify-center items-center mb-2">
                <button 
                    onClick={handleStopGeneration}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                    <StopIcon className="w-5 h-5" />
                    ڕاگرتنی وەڵام
                </button>
            </div>
        )}

        {uploadedFile && (
            <div className="mb-2 text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded-lg p-2 flex items-start gap-3">
                {uploadedFile.mimeType.startsWith('image/') ? (
                    <img src={`data:${uploadedFile.mimeType};base64,${uploadedFile.content}`} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                ) : (
                    <div className="w-16 h-16 bg-slate-700 rounded-md flex items-center justify-center flex-shrink-0">
                        <DocumentTextIcon className="w-8 h-8 text-slate-400" />
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white break-all">{uploadedFile.name}</p>
                    <button onClick={() => setUploadedFile(null)} className="mt-1 text-red-400 hover:text-red-300 text-xs font-bold">لابردن</button>
                </div>
            </div>
        )}
        
        <div className="relative">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(input); } }}
              placeholder={isRecording ? 'گوێم لێتە...' : 'پرسیارێك بکە...'}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 pr-24 pl-20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '200px' }}
              onInput={(e) => { const target = e.target as HTMLTextAreaElement; target.style.height = 'auto'; target.style.height = `${target.scrollHeight}px`; }}
              disabled={isLoading}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button type="button" onClick={toggleRecording} disabled={isLoading} className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-green-600/30 text-green-400 mic-pulse' : 'hover:bg-slate-700 text-slate-400'} disabled:opacity-50`}>
                    <MicrophoneIcon className="w-5 h-5" />
                </button>
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="p-2 rounded-full hover:bg-slate-700 transition-colors text-slate-400 disabled:opacity-50">
                    <PaperclipIcon className="w-5 h-5" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
            </div>
            <button type="submit" disabled={isLoading || (!input.trim() && !uploadedFile)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-cyan-600 text-white rounded-full p-2 disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-500 transition-colors">
              {editingMessageId ? <CheckIcon className="w-5 h-5" /> : <SendIcon className="w-5 h-5" />}
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;