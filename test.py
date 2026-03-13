import re
import os

current_dir = 'c:/Users/Ittea/.gemini/antigravity/scratch/Pandas_Series'
css_path = os.path.join(current_dir, 'styles.css')
js_path = os.path.join(current_dir, 'script.js')
html_path = os.path.join(current_dir, 'index.html')

with open(css_path, 'r', encoding='utf-8') as f: css_content = f.read()
with open(js_path, 'r', encoding='utf-8') as f: js_content = f.read()
with open(html_path, 'r', encoding='utf-8') as f: html_content = f.read()

html_content = re.sub(r'<link\s+rel=\"stylesheet\"\s+href=\"styles\.css[^\"]*\">', lambda m: f'<style>\n{css_content}\n</style>', html_content)
html_content = re.sub(r'<script\s+src=\"script\.js[^\"]*\"></script>', lambda m: f'<script>\n{js_content}\n</script>', html_content)

with open(os.path.join(current_dir, 'debug.html'), 'w', encoding='utf-8') as f: f.write(html_content)
print('Done writing debug.html')
