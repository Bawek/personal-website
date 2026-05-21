from pathlib import Path
import re

root = Path('frontend')
methods = 'get|post|put|patch|delete'

for path in list(root.rglob('*.js')) + list(root.rglob('*.jsx')) + list(root.rglob('*.ts')) + list(root.rglob('*.tsx')):
    text = path.read_text(encoding='utf-8')
    if "import axios from 'axios'" not in text and 'import axios from "axios"' not in text:
        continue
    if '/api' not in text:
        continue

    new = text.replace("import axios from 'axios'", "import api from '@/lib/api'")
    new = new.replace('import axios from "axios"', "import api from '@/lib/api'")
    new = re.sub(rf'\baxios\.({methods})\(([`\"\'])/api(?=[/`\"\'?])', r'api.\1(\2', new)

    if new != text:
        path.write_text(new, encoding='utf-8')
        print(path)
