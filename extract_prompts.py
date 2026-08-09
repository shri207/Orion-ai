import json
import re

transcript_path = r"C:\Users\shrik\.gemini\antigravity-ide\brain\2104734e-f617-478d-8559-cd2512fa00b2\.system_generated\logs\transcript.jsonl"
output_path = r"d:\New11\user_prompts.md"

with open(transcript_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

prompts = []
for line in lines:
    try:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            match = re.search(r'<USER_REQUEST>(.*?)</USER_REQUEST>', content, re.DOTALL)
            if match:
                request_text = match.group(1).strip()
                if request_text:
                    prompts.append(request_text)
            else:
                # Fallback if no tags
                prompts.append(content.strip())
    except:
        pass

with open(output_path, 'w', encoding='utf-8') as f:
    f.write("# User Prompts Used for the Project\n\n")
    f.write("**Model Name:** Gemini 3.1 Pro (High)\n\n")
    for idx, prompt in enumerate(prompts):
        f.write(f"### Prompt {idx + 1}\n\n")
        f.write(f"```text\n{prompt}\n```\n\n")
        f.write("---\n\n")
