// ئەمە کۆمپۆنێنتی سەرەکی ئەپڵیکەیشنەکەیە.
// This is the main component of the application.

import React, { useState } from 'react';
import { AiAssistant, SavedChat } from './types';
import HomePage from './components/HomePage';
import ChatPage from './components/ChatPage';
import { ASSISTANTS } from './constants';

const App: React.FC = () => {
  // ستەیتێک بۆ هەڵگرتنی یاریدەدەرە هەڵبژێردراوەکە. ئەگەر null بێت، پەڕەی سەرەکی نیشان دەدرێت.
  // State to hold the selected assistant. If null, the home page is displayed.
  const [selectedAssistant, setSelectedAssistant] = useState<AiAssistant | null>(null);
  
  // ستەیتێک بۆ هەڵگرتنی ئەو گفتوگۆیەی کە پێویستە بکرێتەوە.
  // State to hold the chat that needs to be loaded.
  const [chatToLoad, setChatToLoad] = useState<SavedChat | null>(null);

  // ئەم فەنکشنە بانگ دەکرێت کاتێک بەکارهێنەر یاریدەدەرێک هەڵدەبژێرێت لە پەڕەی سەرەکی.
  // This function is called when a user selects an assistant from the home page.
  const handleSelectAssistant = (assistant: AiAssistant) => {
    setSelectedAssistant(assistant);
    setChatToLoad(null); // دڵنیابوونەوە لەوەی کە گفتوگۆیەکی نوێ دەستپێدەکات نەک هی پێشوو.
  };

  // ئەم فەنکشنە بانگ دەکرێت کاتێک بەکارهێنەر دەیەوێت گفتوگۆیەکی پاشەکەوتکراو بکاتەوە.
  // This function is called when a user wants to load a saved chat.
  const handleLoadChat = (chat: SavedChat) => {
    // دۆزینەوەی زانیاری یاریدەدەرەکە لەسەر بنەمای ئایدی پاشەکەوتکراو لە چاتەکەدا.
    const assistant = ASSISTANTS.find(a => a.id === chat.assistantId);
    if (assistant) {
      setSelectedAssistant(assistant); // دانانی یاریدەدەری پەیوەندیدار.
      setChatToLoad(chat); // دانانی داتای چاتەکە بۆ ئەوەی لە ChatPage بکرێتەوە.
    } else {
      // ئەگەر یاریدەدەرەکە نەدۆزرایەوە (بۆ نموونە ئەگەر لە ვერსیۆنی نوێدا لابرا بێت).
      console.error("Assistant for saved chat not found");
      alert("یاریدەدەری ئەم گفتوگۆیە نەدۆزرایەوە!");
    }
  };


  // ئەم فەنکشنە بۆ گەڕانەوەیە بۆ پەڕەی سەرەکی لە ChatPage ەوە.
  // This function is for returning to the home page from the ChatPage.
  const handleBackToHome = () => {
    setSelectedAssistant(null); // ستەیتی یاریدەدەرەکە بەتاڵ دەکەینەوە.
    setChatToLoad(null); // ستەیتی چاتی کراوە بەتاڵ دەکەینەوە.
  };

  return (
    <div
      className="bg-slate-900 text-white min-h-screen"
      style={{
        // ستایلی باکگراوند بۆ جوانکاری، دوو بازنەی ڕووناک دروست دەکات.
        // Background style for aesthetics, creating two light circles.
        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(56, 189, 248, 0.1), transparent 50%), radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.1), transparent 50%)'
      }}
    >
      {/* 
        ڕێندەری مەرجدار (Conditional Rendering):
        - ئەگەر `selectedAssistant` دانرابوو (واتە بەکارهێنەر یاریدەدەرێکی هەڵبژاردووە)، ئەوا ChatPage نیشان بدە.
        - ئەگەرنا (واتە `selectedAssistant` null بوو)، ئەوا HomePage نیشان بدە.
      */}
      {selectedAssistant ? (
        <ChatPage
          // دانانی `key`ـی تایبەت:
          // ئەمە وا دەکات هەر جارێک چاتێکی نوێ یان یاریدەدەرێکی نوێ هەڵبژێردرا،
          // کۆمپۆنێنتی ChatPage بە تەواوی ڕีسێت ببێتەوە و ستەیتەکانی پێشووی لەگەڵ نەیەت.
          key={chatToLoad ? chatToLoad.id : selectedAssistant.id}
          assistant={selectedAssistant}
          // ئەگەر چاتێک بۆ کردنەوە هەبوو، پەیامەکانی تێبپەڕێنە، ئەگەرنا لیستی بەتاڵ بنێرە.
          initialMessages={chatToLoad ? chatToLoad.messages : []}
          onBack={handleBackToHome}
        />
      ) : (
        <HomePage
          onSelectAssistant={handleSelectAssistant}
          onLoadChat={handleLoadChat}
          assistants={ASSISTANTS}
        />
      )}
    </div>
  );
};

export default App;
