import re
with open('src/pages/lop9/bai-4-pt-quy-ve-bac-nhat.mdx', 'rb') as f:
    c = f.read()
c = c.replace(b'\x0c', b'\\')
with open('src/pages/lop9/bai-