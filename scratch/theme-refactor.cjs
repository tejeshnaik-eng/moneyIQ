
const fs = require("fs");
const path = require("path");

const dir = "src";

const colorMap = {
  "bg-[#F8FAFC]": "bg-[var(--app-bg)]",
  "bg-white": "bg-[var(--app-surface)]",
  "bg-[#FFFFFF]": "bg-[var(--app-surface)]",
  "bg-[#f7f9fb]": "bg-[var(--app-surface-alt)]",
  "bg-[#f2f4f6]": "bg-[var(--app-surface-alt)]",
  "text-[#191c1e]": "text-[var(--app-text)]",
  "text-[#565e74]": "text-[var(--app-text-muted)]",
  "text-[#E2E8F0]": "text-[var(--app-border)]",
  "border-[#E2E8F0]": "border-[var(--app-border)]",
  "bg-[#00b090]": "bg-[var(--primary)]",
  "text-[#00b090]": "text-[var(--primary)]",
  "border-[#00b090]": "border-[var(--primary)]",
  "text-[#006b57]": "text-[var(--primary-dim)]",
  "bg-[#006b57]": "bg-[var(--primary-dim)]",
  "border-[#006b57]": "border-[var(--primary-dim)]",
  "bg-[#eceef0]": "bg-[var(--app-surface-hover)]"
};

function processDir(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
      let content = fs.readFileSync(fullPath, "utf-8");
      let original = content;
      for (const [key, value] of Object.entries(colorMap)) {
        content = content.split(key).join(value);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log("Updated: " + fullPath);
      }
    }
  }
}

processDir(dir);

