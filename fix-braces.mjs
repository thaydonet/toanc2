import fs from 'fs';

const file = 'src/pages/lop6/bai-42-ket-qua-co-the-su-kien.mdx';
let content = fs.readFileSync(file, 'utf8');

// Replace set notation braces with escaped versions
// Match patterns like: = {something}
content = content.replace(/= \{([^}]+)\}/g, '= {"{"} $1 {"}"}');

fs.writeFileSync(file, content);
console.log('Fixed!');
