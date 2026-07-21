import sys
with open('js/modules/inventory.js', 'r', encoding='utf-8') as f:
    c = f.read()
c = c.replace('\\`', '`').replace('\\${', '${')
with open('js/modules/inventory.js', 'w', encoding='utf-8') as f:
    f.write(c)
