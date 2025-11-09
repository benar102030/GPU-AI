// ئەم فایلە کڕیار (client)ی GoogleGenAI دروست دەکات و ئامادەی دەکات بۆ بەکارهێنان لە هەموو ئەپەکەدا.
// This file creates and initializes the GoogleGenAI client for use throughout the application.

import { GoogleGenAI } from "@google/genai";

// پشکنینی ئەوەی کە کلیلی API لە environment variables بوونی هەیە.
// ئەگەر کلیلی API بوونی نەبێت، ئەپەکە ناتوانێت پەیوەندی بە Gemini API بکات، بۆیە هەڵەیەک نیشان دەدرێت.
// Check if the API key exists in the environment variables.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

// دروستکردنی ئینستانسێکی نوێ لە GoogleGenAI بە بەکارهێنانی کلیلی API.
// ئەم ئینستانسە (ai) لە هەموو شوێنێکی تردا بەکاردێت بۆ ناردنی داواکاری بۆ Gemini.
// Create a new instance of GoogleGenAI using the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// ناردنەدەرەوەی (export) ئینستانسەکە بۆ ئەوەی لە فایلەکانی تردا بتوانرێت 'import' بکرێت و بەکاربهێنرێت.
// Export the instance so it can be used in other files.
export default ai;
