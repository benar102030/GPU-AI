// ئەم فایلە خاڵی دەستپێکی سەرەکی ئەپڵیکەیشنی ڕیاکتەکەیە.
// The main entry point for the React application.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// دۆزینەوەی توخمی (element) root لەناو دۆکیومێنتی HTML. ئەمە ئەو شوێنەیە کە ئەپڵیکەیشنەکەمان تێیدا دادەنرێت.
// Find the root element in the HTML. This is where our React app will be mounted.
const rootElement = document.getElementById('root');
if (!rootElement) {
  // ئەگەر توخمی root نەدۆزرایەوە، هەڵەیەک фрێ دەدەین چونکە ئەپەکە ناتوانێت کاربکات.
  // If the root element isn't found, we throw an error because the app can't render.
  throw new Error("Could not find root element to mount to");
}

// دروستکردنی 'root' بۆ ئەپڵیکەیشنی ڕیاکت بە بەکارهێنانی ReactDOM.createRoot.
// Create a root for the React application using ReactDOM.createRoot.
const root = ReactDOM.createRoot(rootElement);

// ڕێندەرکردنی (نیشاندانی) کۆمپۆنێنتی سەرەکی (App) لەناو root.
// React.StrictMode یارمەتیدەرە بۆ دۆزینەوەی کێشە شاراوەکان لە ئەپەکەدا.
// Render the main App component into the root.
// React.StrictMode is a helper component that helps to find potential problems in the app.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
