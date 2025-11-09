import React from 'react';

// دروستکردنی کۆمپۆنێنتێکی بنەڕەتی بۆ ئایکۆنەکان بۆ دووبارە بەکارنەهێنانەوەی کۆد
// Create a base icon component to avoid code repetition.
const Icon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    {children}
  </svg>
);

// ئایکۆنی مێشک (بۆ یاریدەدەری گشتی)
export const BrainIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.898 20.624l.259-1.035a3.375 3.375 0 0 0-2.456-2.456L13.75 16.5l1.035-.259a3.375 3.375 0 0 0 2.456-2.456l.259-1.035L18 13.5l.259 1.035a3.375 3.375 0 0 0 2.456 2.456l1.035.259L20.25 18l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
  </Icon>
);

// ئایکۆنی کۆمپیوتەر (بۆ یاریدەدەری IT)
export const ComputerIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h9.75a2.25 2.25 0 0 1 2.25 2.25Z" />
  </Icon>
);

// ئایکۆنی بیستۆکی پزیشک (بۆ یاریدەدەری پەرستاری)
export const StethoscopeIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </Icon>
);

// ئایکۆنی دکتۆر (بۆ شیکاری نەخۆشی)
export const DoctorIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </Icon>
);

// ئایکۆنی گێڕ (بۆ یاریدەدەری ئەندازیاری)
export const GearIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.003 1.11-1.226.55-.223 1.159-.223 1.71 0 .55.223 1.02.684 1.11 1.226l.08 1.02.09.282c.22.682.22 1.396 0 2.078l-.09.282-.08 1.02c-.09.542-.56 1.003-1.11 1.226-.55.223-1.159-.223-1.71 0-.55-.223-1.02-.684-1.11-1.226l-.08-1.02-.09-.282c-.22-.682-.22-1.396 0-2.078l.09-.282.08-1.02Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.938 12.375c.09-.542.56-1.003 1.11-1.226.55-.223 1.159-.223 1.71 0 .55.223 1.02.684 1.11 1.226l.08 1.02.09.282c.22.682.22 1.396 0 2.078l-.09.282-.08 1.02c-.09.542-.56 1.003-1.11 1.226-.55.223-1.159-.223-1.71 0-.55-.223-1.02-.684-1.11-1.226l-.08-1.02-.09-.282c-.22-.682-.22-1.396 0-2.078l.09-.282.08-1.02Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.062 12.375c-.09.542-.56 1.003-1.11 1.226-.55.223-1.159-.223-1.71 0-.55-.223-1.02-.684-1.11-1.226l-.08-1.02-.09-.282c-.22-.682-.22-1.396 0-2.078l.09-.282.08-1.02c.09-.542.56-1.003 1.11-1.226.55-.223 1.159-.223 1.71 0 .55.223 1.02.684 1.11 1.226l.08 1.02.09.282c.22.682.22 1.396 0-2.078l-.09.282-.08-1.02Z" />
  </Icon>
);

// ئایکۆنی ئاژەڵ (بۆ یاریدەدەری ڤێتێرنەری)
export const VetIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75s.168-.75.375-.75.375.336.375.75Zm4.5 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Z" />
  </Icon>
);

// ئایکۆنی فڵچەی نیگارکێشان (بۆ دروستکەری وێنە)
export const PaintBrushIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L17.625 7.9c.44.44.44 1.152 0 1.591L8.67 18.444M2.25 12h10.5M16.5 7.5h.008v.008H16.5V7.5Z" />
  </Icon>
);

// ئایکۆنی گۆی زەوی (بۆ لێکۆڵەری وێب)
export const GlobeIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
  </Icon>
);

// ئایکۆنی دۆکیومێنت (بۆ شیکاری دۆکیومێnt)
export const DocumentTextIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.5a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </Icon>
);

// ئایکۆنی کۆد (بۆ وەرگێڕی کۆد)
export const CodeBracketIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
  </Icon>
);

// ئایکۆنی نیشانەی پرسیار (بۆ دروستکەری کویز)
export const QuestionMarkCircleIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
  </Icon>
);

// ئایکۆنی حاسیبە (بۆ شیکاری بیرکاری)
export const CalculatorIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008s.008 3 0 3h-3.375a.625.625 0 0 1-.625-.625V18.375m0-10.125a.625.625 0 0 1 .625-.625h3.375c.345 0 .625.28.625.625v10.125c0 .345-.28.625-.625.625h-3.375a.625.625 0 0 1-.625-.625V8.25ZM9 4.5h.008v.008H9V4.5Z" />
  </Icon>
);

// ئایکۆنی شاشەی پێشکەشکردن (بۆ دروستکەری پێشکەشکردن)
export const PresentationScreenIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3M3.75 21h16.5M12 16.5v4.5" />
  </Icon>
);

// ئایکۆنی زەرفی نامە (بۆ نووسەری ئیمەیڵ)
export const EnvelopeIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.625a2.25 2.25 0 0 1-2.36 0l-7.5-4.625A2.25 2.25 0 0 1 2.25 6.993V6.75" />
  </Icon>
);

// ئایکۆنی زیادکردن (بۆ گفتوگۆی نوێ)
export const PlusIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </Icon>
);

// ئایکۆنی پاشەکەوتکردن (بۆ پاشەکەوتکردنی گفتوگۆ)
export const SaveIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.75A2.25 2.25 0 0 0 4.5 6v12a2.25 2.25 0 0 0 2.25 2.25h10.5A2.25 2.25 0 0 0 19.5 18V6A2.25 2.25 0 0 0 17.25 3.75h-2.25m-5.625 0V3m0 0h4.5m-4.5 0a2.25 2.25 0 0 1-2.25-2.25h9.75a2.25 2.25 0 0 1-2.25 2.25m-4.5 0a2.25 2.25 0 0 0-2.25 2.25v9.75c0 1.243 1.007 2.25 2.25 2.25h4.5c1.243 0 2.25-1.007 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25m-4.5 0h4.5" />
  </Icon>
);

// ئایکۆنی سەتڵی خۆڵ (بۆ سڕینەوە)
export const TrashIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </Icon>
);

// ئایکۆنی کاتژمێر (بۆ نیشاندانی کات)
export const ClockIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </Icon>
);

// ئایکۆنی گفتوگۆ (بۆ سەردێڕی گفتوگۆ پاشەکەوتکراوەکان)
export const ChatBubbleLeftRightIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a55.45 55.45 0 0 1-1.576 0l-3.722-.537C6.347 17.1 5.5 16.136 5.5 15v-4.286c0-.97.616-1.813 1.5-2.097m6.5-4.509a.75.75 0 0 1 .75.75v3.182c0 .537-.433.97-.97.97H13.25c-.537 0-.97-.433-.97-.97V4.75a.75.75 0 0 1 .75-.75h2.5Zm-7.5 0-3.112 3.112a.75.75 0 0 0 0 1.061l3.112 3.112" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H4.5a.75.75 0 0 1-.75-.75v-.008Zm.75 3.75a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H4.5Zm.75 3.75a.75.75 0 0 0 0 1.5h.008a.75.75 0 0 0 0-1.5H4.5Z" />
  </Icon>
);

// ئایکۆنی مایکرۆفۆن (بۆ نووسینی دەنگی)
export const MicrophoneIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m12 0v-1.5a6 6 0 0 0-12 0v1.5m6 6.75a.75.75 0 0 0 .75-.75V3.375a.75.75 0 0 0-1.5 0v12.375a.75.75 0 0 0 .75.75Z" />
    </Icon>
);

// ئایکۆنی کۆپیکردن
export const CopyIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m9.375 0a9.06 9.06 0 0 0-9.063-9.063" />
    </Icon>
);

// ئایکۆنی نوێکردنەوە (بۆ دووبارە دروستکردنەوەی وەڵام)
export const RefreshIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.691V5.25a8.25 8.25 0 0 0-11.667 0L2.985 9.348" />
    </Icon>
);

// ئایکۆنی پێنوس (بۆ دەستکاریکردن)
export const PencilIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </Icon>
);

// ئایکۆنی نیشانەی ڕاست (بۆ پشتڕاستکردنەوە)
export const CheckIcon: React.FC<{ className?: string }> = (props) => (
    <Icon {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </Icon>
);

// ئایکۆنی وەستان (بۆ ڕاگرتنی وەڵام)
export const StopIcon: React.FC<{ className?: string }> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
    </svg>
);

// ئایکۆنی ناردنەدەرەوە (بۆ ئێکسپۆرتکردنی چات)
export const ExportIcon: React.FC<{ className?: string }> = (props) => (
  <Icon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </Icon>
);