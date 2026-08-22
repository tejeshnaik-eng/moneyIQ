const fs = require('fs');

const file = 'src/components/dashboard/DashboardShell.tsx';
let c = fs.readFileSync(file, 'utf8');

const tipWidgetComponent = `
const TIPS = [
  "💡 Tip: Ask the AI Chatbot for help adjusting your portfolio!",
  "💡 Tip: You can paste screenshots into the AI Chatbot for instant analysis.",
  "💡 Tip: Not sure what a term means? Ask the AI Chatbot for a quick explanation.",
  "💡 Tip: The AI can generate custom SIP baskets based on your changing goals."
];

const TipWidget = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
        setVisible(true);
      }, 500); // fade out duration
    }, 12000); // change tip every 12 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={\`fixed bottom-6 left-6 z-50 transition-all duration-500 max-w-sm \${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}\`}>
      <div className="bg-[#1C1C1C] border-none shadow-2xl rounded-2xl px-5 py-4 flex items-start gap-3 relative overflow-hidden group cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('ai-chat-prompt', { detail: { prompt: "Can you help me?", autoSend: false } }))}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00D09C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <p className="text-[13px] text-[#A1A1AA] font-medium leading-relaxed relative z-10">{TIPS[tipIndex]}</p>
      </div>
    </div>
  );
};
`;

// Insert the TipWidget component before DashboardShell declaration
c = c.replace(/export const DashboardShell: React\.FC<DashboardShellProps> = \(\{/g, tipWidgetComponent + '\nexport const DashboardShell: React.FC<DashboardShellProps> = ({');

// Insert <TipWidget /> before <AiChatWidget />
c = c.replace(/<AiChatWidget \/>/g, '<TipWidget />\n      <AiChatWidget />');

fs.writeFileSync(file, c);
console.log('Added TipWidget to DashboardShell');
