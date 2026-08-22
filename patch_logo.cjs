const fs = require('fs');

function replaceLogo(file, target, replacement) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(target, replacement);
  fs.writeFileSync(file, c);
}

replaceLogo(
  'src/components/landing/LandingPage.tsx',
  `<div className="flex items-center justify-center w-10 h-10 bg-black rounded-full text-white">
                  <Landmark className="w-5 h-5" />
                </div>`,
  `<img src="/logo.png" alt="MoneyIQ Logo" className="h-7 w-auto object-contain" />`
);

replaceLogo(
  'src/components/auth/AuthModal.tsx',
  `<div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-6 shadow-md">
              <Landmark className="text-white w-6 h-6" />
            </div>`,
  `<img src="/logo.png" alt="MoneyIQ Logo" className="h-10 w-auto mb-6 object-contain" />`
);

replaceLogo(
  'src/components/dashboard/DashboardSidebar.tsx',
  `<div className="p-4 pt-6">
          <button 
            onClick={() => onSelectModule('overview')}
            className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#E4E4E7] transition-colors font-heading text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            {!collapsed && <span>Dashboard</span>}
          </button>
        </div>`,
  `<div className="p-5 pt-8 pb-4">
          <button onClick={() => onSelectModule('overview')} className="flex items-center">
            {collapsed ? (
              <img src="/logo.png" alt="MoneyIQ" className="w-8 h-8 object-cover object-left" />
            ) : (
              <img src="/logo.png" alt="MoneyIQ Logo" className="h-8 w-auto object-contain" />
            )}
          </button>
        </div>`
);

console.log("Logo updated in LandingPage, AuthModal, and DashboardSidebar.");
