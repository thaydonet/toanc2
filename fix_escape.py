path = r"src/pages/lop7/bai-18-bieu-do-hinh-quat-tron.mdx"
data = open(path, "rb").read()

start = data.index(b"export const quizData")
end = data.index(b"];", start) + 2
region = data[start:end]

fixed = region.replace(b"\\\\\\\\", b"\\\\")

data = data[:start] + fixed + data[end:]
open(path, "wb").write(data)
print(
    "replaced",
    region.count(b"\\\\\\\\"),
    "quad-backslash runs ->",
    fixed.count(b"\\\\"),
    "double-backslash runs",
)
