const fs = require('fs');

const file = 'src/components/chat/AiChatWidget.tsx';
let c = fs.readFileSync(file, 'utf8');

// Replace accent color
c = c.replace(/#20EFA0/g, '#E4E4E7');
c = c.replace(/#1bc785/g, '#D4D4D8');
c = c.replace(/bg-\[#20EFA0\]\/20/g, 'bg-[#E4E4E7]/20');
c = c.replace(/focus:border-\[#20EFA0\]\/50/g, 'focus:border-[#E4E4E7]/50');

// Use uploaded icon
c = c.replace(/<Bot className="w-5 h-5 text-\[#E4E4E7\]" \/>/g, '<img src="/favicon.png" alt="mIQ" className="w-5 h-5 object-contain" />');
c = c.replace(/<Bot className="w-4 h-4 text-\[#E4E4E7\]" \/>/g, '<img src="/favicon.png" alt="mIQ" className="w-4 h-4 object-contain" />');
c = c.replace(/import \{.*?Bot,.*\} from 'lucide-react';/, (match) => {
  return match; // Bot is used, maybe leave import to not break TS if unused, or just keep it
});

fs.writeFileSync(file, c);
console.log('Updated Chatbot palette and icon');
