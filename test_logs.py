import time
import os
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

current_dir = 'c:/Users/Ittea/.gemini/antigravity/scratch/Pandas_Series'
html_path = 'file:///' + os.path.join(current_dir, 'index.html').replace('\\', '/')

print("Opening:", html_path)

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.set_capability('goog:loggingPrefs', {'browser': 'ALL'})

driver = webdriver.Chrome(options=options)
driver.get(html_path)

time.sleep(2) # Wait for JS to execute

logs = driver.get_log('browser')
print("Browser Console Logs:")
for log in logs:
    print(f"[{log['level']}] {log['message']}")

driver.quit()
