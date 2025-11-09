import React from 'react';

// پێناسەکردنی پسپۆڕییە جیاوازەکانی یاریدەدەرە زیرەکەکان بە شێوەی Enum.
// Enum یارمەتیدەرە بۆ ئەوەی هەڵە لە نووسینی ناوەکاندا کەمببێتەوە.
// Defines the different specialties of the AI assistants as an Enum.
export enum AiSpecialty {
  GENERAL = 'general',
  IT = 'it',
  NURSING = 'nursing',
  MEDICAL = 'medical',
  ENGINEERING = 'engineering',
  VETERINARY = 'veterinary',
  IMAGE_CREATOR = 'image_creator',
  WEB_RESEARCHER = 'web_researcher',
  DOC_ANALYZER = 'doc_analyzer',
  CODE_INTERPRETER = 'code_interpreter',
  QUIZ_GENERATOR = 'quiz_generator',
  MATH_SOLVER = 'math_solver',
  PRESENTATION_CREATOR = 'presentation_creator',
  EMAIL_WRITER = 'email_writer',
}

// پێناسەکردنی پێکهاتەی داتای هەر یاریدەدەرێکی زیرەک.
// Defines the data structure for each AI assistant.
export interface AiAssistant {
  id: AiSpecialty; // ناسنامەی تایبەت، یەکێکە لە پسپۆڕییەکانی ناو Enum.
  name: string; // ناوی یاریدەدەرەکە (زۆرتر بۆ کاری ناوخۆیی).
  title: string; // ناونیشانی یاریدەدەرەکە کە بە بەکارهێنەر نیشان دەدرێت.
  description: string; // وەسفێکی کورت دەربارەی کاری یاریدەدەرەکە.
  systemInstruction: string; // ڕێنمایی سیستەم بۆ مۆدێلی Gemini، کە ڕۆڵی یاریدەدەرەکە دیاری دەکات.
  icon: (props: { className?: string }) => React.ReactNode; // کۆمپۆنێنتێکی ڕیاکت بۆ نیشاندانی ئایکۆن.
  examplePrompts?: string[]; // چەند پرسیارێکی نموونەیی بۆ ئەوەی بەکارهێنەر خێراتر دەستپێبکات.
}

// پێناسەکردنی بەشێکی تێکست لەناو پەیامێکدا.
// Defines a text part within a message.
export interface TextPart {
  text: string;
}

// پێناسەکردنی بەشێکی داتا (وەک وێنە) لەناو پەیامێکدا، کە ڕاستەوخۆ داتاکەی تێدایە.
// Defines a data part (like an image) within a message.
export interface InlineDataPart {
  inlineData: {
    mimeType: string; // جۆری فایل, وەک 'image/jpeg'.
    data: string; // داتای فایلەکە کە بە base64 کۆدکراوە.
  };
}

// یەکگرتنی جۆرەکانی بەشی پەیام. پەیامێک دەکرێت تێکست یان داتای inline بێت.
// Union type for the parts of a message.
export type Part = TextPart | InlineDataPart;

// پێناسەکردنی پێکهاتەی سەرچاوەیەکی وێب کە لەلایەن Web Researcherـەوە بەکاردێت.
// Defines the structure of a web source.
export interface GroundingSource {
    uri: string; // URLی سەرچاوەکە.
    title: string; // ناونیشانی سەرچاوەکە.
}

// پێناسەکردنی پێکهاتەی پەیامێک لەناو گفتوگۆدا.
// Defines the structure of a message.
export interface Message {
  id: string; // ناسنامەی تایبەت بۆ هەر پەیامێک، بۆ کاری ناوخۆیی وەک 'key' لە React.
  role: 'user' | 'model'; // ڕۆڵی نێرەری پەیام (بەکارهێنەر یان مۆدێل).
  parts: Part[]; // بەشەکانی پەیام، کە دەکرێت تێکست یان وێنە بن.
  groundingSources?: GroundingSource[]; // سەرچاوەکانی وێب (ئەگەر هەبن).
}

// پێناسەکردنی پێکهاتەی چاتێکی پاشەکەوتکراو.
// Defines the structure of a saved chat session.
export interface SavedChat {
  id: string; // ناسنامەی تایبەتی چاتەکە.
  timestamp: number; // کاتی پاشەکەوتکردن (بۆ ڕیزکردن).
  assistantId: AiSpecialty; // ناسنامەی ئەو یاریدەدەرەی کە چاتەکەی لەگەڵ کراوە.
  title: string; // ناونیشانێک بۆ چاتەکە (بۆ نموونە، یەکەم پرسیاری بەکارهێنەر).
  messages: Message[]; // هەموو پەیامەکانی ناو چاتەکە.
}

// پێناسەکردنی ئینتەرفەیسی تایبەت بە eventی 'beforeinstallprompt'.
// ئەم eventە ستاندارد نییە و بۆ دامەزراندنی Progressive Web App (PWA) بەکاردێت.
// Defines the interface for the non-standard beforeinstallprompt event.
export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}
