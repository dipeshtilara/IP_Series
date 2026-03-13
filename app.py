import streamlit as st
import streamlit.components.v1 as components
import os
import re

# Configure the Streamlit page
st.set_page_config(
    page_title="Pandas Series Visualizer",
    page_icon="🐼",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit UI elements
hide_st_style = """
<style>
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    .block-container {
        padding-top: 0rem;
        padding-bottom: 0rem;
        padding-left: 0rem;
        padding-right: 0rem;
        max-width: 100%;
    }
    iframe {
        border: none;
        width: 100%;
    }
</style>
"""
st.markdown(hide_st_style, unsafe_allow_html=True)

# Get the directory of the current script
current_dir = os.path.dirname(os.path.abspath(__file__))

# File paths
css_path = os.path.join(current_dir, "styles.css")
js_path = os.path.join(current_dir, "script.js")
html_path = os.path.join(current_dir, "index.html")

try:
    with open(css_path, "r", encoding="utf-8") as f:
        css_content = f.read()

    with open(js_path, "r", encoding="utf-8") as f:
        js_content = f.read()

    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    # Inject the CSS and JS directly into the HTML string
    html_content = re.sub(
        r'<link\s+rel="stylesheet"\s+href="styles\.css[^"]*">',
        lambda m: f"<style>\\n{css_content}\\n</style>",
        html_content
    )
    html_content = re.sub(
        r'<script\s+src="script\.js[^"]*"></script>',
        lambda m: f"<script>\\n{js_content}\\n</script>",
        html_content
    )
        
    components.html(html_content, height=900, scrolling=True)

except FileNotFoundError as e:
    st.error(f"Error loading files: {e}. Please ensure index.html, styles.css, and script.js are in the same directory as app.py.")

# Trigger reload
