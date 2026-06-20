import fs from 'fs';

const filePath = 'src/pages/lop6/bai-42-ket-qua-co-the-su-kien.mdx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace { and } with JSX expressions, but not in JSX tags or import statements
content = content.replace(/(?<!<[^>]*)\{(?![^}]*>)/g, "{'{'}")
                 .replace(/(?<!<[^>]*)\}(?![^}]*>)/g, "{'}'}");

fs.writeFileSync(filePath, content);
console.log('Fixed braces in MDX file');
