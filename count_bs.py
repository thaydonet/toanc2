import re

for f in [
    r"src/pages/lop7/bai-1-tap-hop-so-huu-ti.mdx",
    r"src/pages/lop7/bai-18-bieu-do-hinh-quat-tron.mdx",
    r"src/pages/lop7/bai-8-goc-vi-tri-dac-biet-tia-phan-giac.mdx",
]:
    text = open(f, encoding="utf-8").read()
    m = re.search(r"export const quizData.*?\];", text, re.S)
    seg = m.group(0) if m else ""
    runs = {}
    count = 0
    prev_bs = False
    for ch in seg:
        if ch == "\\":
            count = count + 1 if prev_bs else 1
            prev_bs = True
        else:
            if prev_bs:
                runs[count] = runs.get(count, 0) + 1
            prev_bs = False
    if prev_bs:
        runs[count] = runs.get(count, 0) + 1
    print(f, "-> backslash runs in quizData:", runs)
