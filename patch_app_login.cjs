const fs = require('fs');

const file = 'src/App.tsx';
let c = fs.readFileSync(file, 'utf8');

const target = `const [pendingModule, setPendingModule] = useState<ModuleId>('overview');`;
const replacement = `const [pendingModule, setPendingModule] = useState<ModuleId>('overview');

  // CRITICAL FIX: Automatically route to dashboard if already logged in (resolves double-click bug)
  React.useEffect(() => {
    if (isLoggedIn && currentView === 'landing') {
      setCurrentView('dashboard');
    }
  }, [isLoggedIn, currentView]);`;

c = c.replace(target, replacement);

fs.writeFileSync(file, c);
console.log('App.tsx patched for auto-login redirect.');
