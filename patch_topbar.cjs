const fs = require('fs');

const file = 'src/components/dashboard/DashboardTopBar.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /<button className="hover:text-white transition-colors ml-2 w-12 h-12 flex items-center justify-center rounded-full hover:bg-\[#2A2A2A\]"><UserCircle className="w-7 h-7" \/><\/button>/;

const newString = `
          <div className="relative group ml-2">
            <button className="flex items-center gap-3 hover:text-white transition-colors h-12 px-3 rounded-full hover:bg-[#2A2A2A]">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-semibold text-white">{user.name || 'User'}</span>
                <span className="text-[11px] text-[#71717A] font-medium leading-none">Settings</span>
              </div>
              <UserCircle className="w-7 h-7" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#2A2A2A] rounded-xl shadow-2xl border border-[#333] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:bg-[#333] transition-colors">
                Sign Out
              </button>
            </div>
          </div>
`;

c = c.replace(regex, newString);

fs.writeFileSync(file, c);
console.log('DashboardTopBar patched to include Sign Out menu.');
