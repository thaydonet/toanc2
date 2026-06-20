const fs = require('fs');
const path = require('path');

const dir = 'd:/toanthcs/src/pages/lop8';
for (let i = 2; i <= 10; i++) {
    const filename = `bai-on-tap-chuong-${i}.mdx`;
    const filepath = path.join(dir, filename);
    if (!fs.existsSync(filepath)) {
        console.log(`${filename} does not exist`);
        continue;
    }
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    // First, change type: "tln" to type: "sa"
    content = content.replace(/type:\s*["']tln["']/g, 'type: "sa"');
    
    // Also remove any type: "sa" lines that have unit: and tolerance: 
    // Wait, the user said "trong các câu này bỏ hàng unit:..... tolerance:...."
    // "trong các câu này" means in these questions. We can just aggressively remove all instances of unit: ... and tolerance: ...
    // Let's do a replace that matches unit: "...", or unit: "", and tolerance: 0.1, it can have trailing commas
    
    content = content.replace(/^[ \t]*unit:\s*["'][^"']*["'],?\s*\r?\n/gm, '');
    content = content.replace(/^[ \t]*tolerance:\s*[0-9.]+,?\s*\r?\n/gm, '');
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filename}`);
}
