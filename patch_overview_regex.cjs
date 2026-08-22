const fs = require('fs');

const file = 'src/components/modules/OverviewModule.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /const fetchDashboardData = async \(\) => \{[\s\S]*?fetchDashboardData\(\);/m;

const newBlock = `const fetchDashboardData = async () => {
      try {
        const { data: portData } = await supabase.from('portfolios').select('current, ticker, name');
        if (portData) {
          setHoldings(portData);
          setAssets(portData.reduce((s, x) => s + (Number(x.current) || 0), 0));
        }

        const { data: profileData } = await supabase.from('risk_profiles').select('profile_data').maybeSingle();
        if (profileData?.profile_data) {
          setProfile(profileData.profile_data);
          setLiabilities(0);
          setHasProfile(true);
        }

        const { data: spendData } = await supabase.from('transactions').select('amount, category');
        if (spendData) {
          setTxns(spendData);
          setLeakage(spendData.filter(t => t.category === 'Discretionary/Leaks')
            .reduce((s, x) => s + Math.abs(Number(x.amount) || 0), 0));
        }

        const { data: goalsData } = await supabase.from('goals').select('id, title');
        if (goalsData) {
          setGoals(goalsData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDashboardData();`;

c = c.replace(regex, newBlock);

const regexUI = /\{\/\*\s*Liability Burden\s*\*\/\}[\s\S]*?<\/div>/m;
const newUI = `{/* Liability Burden */}
          <div className={\`\${widgetClass} bg-[#DDF6F5]\`}>
            <Scale className="w-7 h-7 text-[#008F91] mb-5" />
            <h3 className="text-[15px] font-medium text-[#58645F] mb-1">Liability Burden</h3>
            {liabilities > 0 ? (
              <p className="text-[28px] leading-tight font-bold text-[#101413] mb-2">₹{liabilities.toLocaleString('en-IN')}</p>
            ) : (
              <p className="text-[28px] leading-tight font-bold text-[#71717A] mb-2">₹0</p>
            )}
            <p className="text-[13px] font-medium text-[#008F91]">No active liabilities logged</p>
          </div>`;

c = c.replace(regexUI, newUI);

fs.writeFileSync(file, c);
