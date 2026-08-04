import re, sys

sys.stdout.reconfigure(encoding="utf-8")

files = [
    "src/pages/lop7/bai-12-tong-cac-goc-tam-giac.mdx",
    "src/pages/lop7/bai-13-hai-tam-giac-bang-nhau-ccc.mdx",
    "src/pages/lop7/bai-14-truong-hop-bang-nhau-cgc-gcg.mdx",
    "src/pages/lop7/bai-15-tam-giac-vuong-bang-nhau.mdx",
    "src/pages/lop7/bai-16-tam-giac-can-duong-trung-truc.mdx",
    "src/pages/lop7/bai-17-thu-thap-phan-loai-du-lieu.mdx",
    "src/pages/lop7/bai-18-bieu-do-hinh-quat-tron.mdx",
    "src/pages/lop7/bai-19-bieu-do-doan-thang.mdx",
    "src/pages/lop7/bai-on-tap-chuong-4.mdx",
    "src/pages/lop7/bai-on-tap-chuong-5.mdx",
]
cyr = re.compile(r"[А-Яа-я]")
issues = 0
for f in files:
    text = open(f, encoding="utf-8").read()
    for i, line in enumerate(text.splitlines(), 1):
        if "tinv:" in line:
            print("TINV", f, i)
            issues += 1
        if cyr.search(line):
            print("CYR", f, i, repr(line[:80]))
            issues += 1
        stripped = re.sub(r"\$\{tinh:[^}]+\}", "", line)
        d = stripped.count("$")
        if d % 2 != 0:
            print("DOLLAR-ODD", f, i, repr(line[:80]))
            issues += 1
print("total issues:", issues)
