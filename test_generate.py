import app
import os

with open('debug2.html', 'w', encoding='utf-8') as f:
    # app.py already does this injecting internally and passes it to components.html.
    # Let's extract the exact logic
    current_dir = os.path.dirname(os.path.abspath(__file__))
    css_path = os.path.join(current_dir, "styles.css")
    js_path = os.path.join(current_dir, "script.js")
    html_path = os.path.join(current_dir, "index.html")

    import re
    with open(css_path, "r", encoding="utf-8") as file:
        css_content = file.read()
    with open(js_path, "r", encoding="utf-8") as file:
        js_content = file.read()
    with open(html_path, "r", encoding="utf-8") as file:
        html_content = file.read()

    html_content = re.sub(
        r'<link\s+rel="stylesheet"\s+href="styles\.css[^"]*">',
        lambda m: f"<style>\n{css_content}\n</style>",
        html_content
    )
    html_content = re.sub(
        r'<script\s+src="script\.js[^"]*"></script>',
        lambda m: f"<script>\n{js_content}\n</script>",
        html_content
    )

    f.write(html_content)
print("done")
