with open("src/pages/lop9/bai-4-pt-quy-ve-bac-nhat.mdx", "rb") as f:
    content = f.read()

# Fix: \x0crac -> \\frac
content = content.replace(b"\x0crac", b"\\frac")

# Fix: \x0cneq -> \\neq (this pattern may be split across lines)
import re
# Fix broken \neq patterns
