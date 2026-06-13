import os
import re

directory = '/Users/neil/Green Elegance/frontend/src'

pattern_single = re.compile(r"'http://localhost:8080/api([^']*)'")
pattern_double = re.compile(r'"http://localhost:8080/api([^"]*)"')
pattern_raw = re.compile(r'http://localhost:8080/api')

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = pattern_single.sub(r"`${import.meta.env.VITE_API_URL}\1`", content)
    new_content = pattern_double.sub(r"`${import.meta.env.VITE_API_URL}\1`", new_content)
    new_content = pattern_raw.sub(r"${import.meta.env.VITE_API_URL}", new_content)

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            process_file(os.path.join(root, file))
