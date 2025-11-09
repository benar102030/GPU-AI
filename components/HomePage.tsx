import React, { useState, useEffect } from 'react';
import { AiAssistant, SavedChat, BeforeInstallPromptEvent } from '../types';
import { ASSISTANTS } from '../constants';
import { TrashIcon, ClockIcon, ChatBubbleLeftRightIcon } from './icons/Icons';

// پێناسەکردنی پرۆپسەکانی (props) کۆمپۆنێنتی HomePage.
// Defining the props for the HomePage component.
interface HomePageProps {
  assistants: AiAssistant[]; // لیستی هەموو یاریدەدەرەکان
  onSelectAssistant: (assistant: AiAssistant) => void; // فەنکشنێک کە کاتێک یاریدەدەرێک هەڵدەبژێردرێت بانگ دەکرێت
  onLoadChat: (chat: SavedChat) => void; // فەنکشنێک کە کاتێک چاتێکی پاشەکەوتکراو هەڵدەبژێردرێت بانگ دەکرێت
}

// کۆمپۆنێنتێکی بچووک بۆ نیشاندانی کارتی هەر یاریدەدەرێک.
// A small component to display the card for each assistant.
const AssistantCard: React.FC<{ assistant: AiAssistant; onClick: () => void, style: React.CSSProperties }> = ({ assistant, onClick, style }) => (
  <div
    onClick={onClick}
    style={style}
    className="relative group bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center text-center cursor-pointer transition-all duration-300 overflow-hidden shadow-lg border border-slate-700 hover:-translate-y-1 animate-slide-in-bottom"
  >
    {/* بۆردەری جوڵاوی جوانکاری کە تەنها لە کاتی hover نیشان دەدرێت */}
    {/* Animated gradient border for aesthetics that only shows on hover */}
    <div className="absolute -inset-0.5 group-hover:inset-0 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-all duration-300 blur group-hover:blur-md"></div>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl opacity-0 group-hover:opacity-75 transition-all duration-300"></div>
    
    <div className="relative z-10 flex flex-col items-center">
      <div className="mb-4 bg-slate-900/50 rounded-full p-3 border border-slate-700">
        {assistant.icon({ className: 'w-10 h-10 text-cyan-400' })}
      </div>
      <h3 className="text-xl font-bold text-white">{assistant.title}</h3>
      <p className="text-slate-400 text-sm">{assistant.description}</p>
    </div>
  </div>
);

// کۆمپۆنێنتی سەرەکی بۆ پەڕەی یەکەم، کە لیستی یاریدەدەرەکان و چاتە پاشەکەوتکراوەکان نیشان دەدات.
// The main component for the home page, which displays the list of assistants and saved chats.
const HomePage: React.FC<HomePageProps> = ({ assistants, onSelectAssistant, onLoadChat }) => {
  // ستەیت بۆ هەڵگرتنی گفتوگۆ پاشەکەوتکراوەکان
  const [savedChats, setSavedChats] = useState<SavedChat[]>([]);
  // ستەیت بۆ دیاریکردنی ئەو چاتەی کە بەکارهێنەر دەیەوێت بیسڕێتەوە (بۆ نیشاندانی پەیامی دڵنیابوونەوە)
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  // ستەیت بۆ هەڵگرتنی eventی دامەزراندنی ئەپ (PWA)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // ئەم useEffectـە یەکجار کاردەکات کاتێک کۆمپۆنێنتەکە باردەبێت
  // بۆ خوێندنەوەی گفتوگۆ پاشەکەوتکراوەکان لە localStorage.
  useEffect(() => {
    const chatsFromStorage = JSON.parse(localStorage.getItem('gpu-ai-saved-chats') || '[]');
    // گفتوگۆکان بەپێی نوێترین ڕیز دەکەین (descending)
    chatsFromStorage.sort((a: SavedChat, b: SavedChat) => b.timestamp - a.timestamp);
    setSavedChats(chatsFromStorage);
  }, []);

  // ئەم useEffectـە گوێ لە eventی 'beforeinstallprompt' دەگرێت.
  // ئەم eventە لەلایەن وێبگەڕەوە фрێ دەدرێت کاتێک ئەپەکە دەتوانرێت دابمەزرێنرێت (PWA).
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // ڕێگری لە نیشاندانی داواکاری خودکاری وێبگەڕ
      setInstallPrompt(e as BeforeInstallPromptEvent); // هەڵگرتنی eventەکە لە ستەیت
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // پاککردنەوەی event listener کاتێک کۆمپۆنێنتەکە نامێنێت
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // ئەم فەنکشنە بانگ دەکرێت کاتێک بەکارهێنەر کلیک لە دوگمەی دامەزراندن دەکات.
  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    await installPrompt.prompt(); // نیشاندانی داواکاری دامەزراندن
    const { outcome } = await installPrompt.userChoice; // چاوەڕێکردنی وەڵامی بەکارهێنەر
    console.log(`User response to the install prompt: ${outcome}`);
    setInstallPrompt(null); // لابردنی دوگمەی دامەزراندن دوای هەوڵدان
  };

  // ئەم فەنکشنە چاتێکی دیاریکراو لە ستەیت و localStorage دەسڕێتەوە.
  const handleDeleteChat = (chatId: string) => {
    const updatedChats = savedChats.filter(chat => chat.id !== chatId);
    setSavedChats(updatedChats);
    localStorage.setItem('gpu-ai-saved-chats', JSON.stringify(updatedChats));
    setChatToDelete(null); // شاردنەوەی پەیامی دڵنیابوونەوە
  };


  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <header className="text-center mb-12 animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          <span className="animated-gradient-text">GPU</span> AI
        </h1>
        <p className="text-slate-400 mt-4 text-lg">یارمەتیدەری زیرەکی تۆ بۆ زانکۆ</p>
        {/* ئەگەر ئەپەکە شایەنی دامەزراندن بوو، دوگمەکە نیشان بدە */}
        {installPrompt && (
          <div className="mt-6">
            <button 
              onClick={handleInstallClick}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2 mx-auto animate-slide-in-bottom"
              style={{ animationDelay: '0.2s' }}
              aria-label="Install App"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>دامەزراندنی ئەپ</span>
            </button>
          </div>
        )}
      </header>

      <main>
        {/* بەشی گفتوگۆ پاشەکەوتکراوەکان - تەنها ئەگەر چات هەبوو نیشان دەدرێت */}
        {savedChats.length > 0 && (
            <section className="mb-16 animate-slide-in-bottom" style={{ animationDelay: '0.3s' }}>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <ChatBubbleLeftRightIcon className="w-7 h-7 text-cyan-400" />
                    گفتوگۆ پاشەکەوتکراوەکان
                </h2>
                <div className="space-y-4">
                    {savedChats.map(chat => {
                        // دۆزینەوەی زانیاری یاریدەدەرەکە بۆ نیشاندانی ئایکۆن و ناو
                        const assistant = ASSISTANTS.find(a => a.id === chat.assistantId);
                        return (
                            <div key={chat.id} className={`border border-slate-700 rounded-lg p-4 flex items-center justify-between transition-all duration-300 ${chatToDelete === chat.id ? 'bg-red-900/40' : 'bg-slate-800/60 hover:bg-slate-800'}`}>
                                {/* پشکنینی ئەوەی کە ئایا لە دۆخی سڕینەوەداین */}
                                {chatToDelete === chat.id ? (
                                    <>
                                        <p className="font-bold text-white">دڵنیایت لە سڕینەوە؟</p>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleDeleteChat(chat.id)} className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded-md text-white text-sm font-semibold transition-colors">بەڵێ</button>
                                            <button onClick={() => setChatToDelete(null)} className="px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded-md text-white text-sm font-semibold transition-colors">نەخێر</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center gap-4 cursor-pointer flex-1 min-w-0" onClick={() => onLoadChat(chat)}>
                                            {assistant && (
                                                <div className="bg-slate-900/50 rounded-full p-2 border border-slate-600 flex-shrink-0">
                                                    {assistant.icon({ className: 'w-6 h-6 text-cyan-400' })}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-white truncate">{chat.title}</p>
                                                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap">
                                                    <ClockIcon className="w-4 h-4" />
                                                    <span>{new Date(chat.timestamp).toLocaleString()}</span>
                                                    {assistant && <span className="font-semibold hidden sm:inline"> • {assistant.title}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setChatToDelete(chat.id)} className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors flex-shrink-0 ml-2" aria-label="Delete chat">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
                 <hr className="border-slate-700 my-12" />
            </section>
        )}

        {/* بەشی هەڵبژاردنی یاریدەدەر */}
        <h2 className="text-2xl font-bold text-white mb-6 text-center animate-slide-in-bottom" style={{ animationDelay: '0.4s' }}>
            یاریدەدەرێکی نوێ هەڵبژێرە
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {assistants.map((assistant, index) => (
            <AssistantCard
              key={assistant.id}
              assistant={assistant}
              onClick={() => onSelectAssistant(assistant)}
              // دانانی دواکەوتنێکی جیاواز بۆ ئەنیمەیشنی هەر کارتێک
              style={{ animationDelay: `${0.5 + index * 0.05}s`, opacity: 0, animationFillMode: 'forwards' }}
            />
          ))}
        </div>
      </main>

      <footer className="text-center mt-16 text-slate-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()} GPU AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default HomePage;
