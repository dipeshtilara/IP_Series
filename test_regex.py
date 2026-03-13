import re
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
css_path = os.path.join(current_dir, "styles.css")
js_path = os.path.join(current_dir, "script.js")
html_path = os.path.join(current_dir, "index.html")

with open(css_path, "r", encoding="utf-8") as f:
    css_content = f.read()

with open(js_path, "r", encoding="utf-8") as f:
    js_content = f.read()

with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

print("Original HTML length:", len(html_content))

html_content = re.sub(
    r'<link\s+rel="stylesheet"\s+href="styles\.css[^"]*">',
    lambda m: f"<style>\n{css_content}\n</style>",
    html_content
)
print("After CSS length:", len(html_content))
print("CSS Injected:", "styles.css" not in html_content)


html_content = re.sub(
    r'<script\s+src="script\.js[^"]*"></script>',
    lambda m: f"<script>\n{js_content}\n</script>",
    html_content
)
print("After JS length:", len(html_content))
print("JS Injected:", "script.js" not in html_content)
