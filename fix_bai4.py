import re

with open('src/pages/lop9/bai-4-pt-quy-ve-bac-nhat.mdx', 'r', encoding='utf-8') as f:
    content = f.read()

# Thực hành 1 after Part 1 (after first </div> before heading)
old1 = '</div>\n\n<h3 id="pt-an-o-mau" style="margin-top:2rem;">📖 2. Phương trình chứa ẩn ở mẫu</h3>'

new1 = '''</div>

<VanDung title="📝 Thực hành 1 — Phương trình tích">

<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:1rem;margin:1rem 0;border-radius:0 8px 8px 0;">

**Giải các phương trình tích sau:**

a) $(x - 1)(2x + 6) = 0$

b) $x^2 - 3x = 0$

c) $(3x - 1)^2 - (x + 2)^2 = 0$

d) $x^2 - 5x + 6 = 0$ (Phân tích thành $(x-2)(x-3)=0$)

</div>

</VanDung>

<h3 id="pt-an-o-mau" style="margin-top:2rem;">📖 2. Phương trình chứa ẩn ở mẫu</h3>'''

# Thực hành 2 after Part 2 (after second </div> before </KhamPha>)
old2 = '</div>\n\n</KhamPha>'

new2 = '''</div>

<VanDung title="📝 Thực hành 2 — Phương trình chứa ẩn ở mẫu">

<div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:1rem;margin:1rem 0;border-radius:0 8px 8px 0;">

**Giải các phương trình chứa ẩn ở mẫu sau:**

a) $\frac{x-1}{x+2} = \frac{3}{x-1}$ (ĐKXĐ: $x \neq -2, x \neq 1$)

b) $\frac{2}{x} + \frac{1}{x-1} = \frac{3x-2}{x(x-1)}$ (ĐKXĐ: $x \neq 0, x \neq 1$)

c) $\frac{x+1}{x-3} - \frac{2}{x} = \frac{4x+3}{x(x-3)}$ (ĐKXĐ: $x \neq 0, x \neq 3$)

</div>

</VanDung>

</KhamPha>'''

# Apply both replacements
count1 = content.count(old1)
count2 = content.count(old2)
print(f"Found old1 {count1} time(s)")
print(f"Found old2 {count2} time(s)")

if count1 == 1 and count2 == 1:
    content = content.replace(old1, new1)
    content = content.replace(old2, new2)
    with open('src/pages/lop9/bai-4-pt-quy-ve-bac-nhat.mdx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("File updated successfully!")
else:
    print(f"ERROR: Expected 1 match each, got {count1} and {count2}")
