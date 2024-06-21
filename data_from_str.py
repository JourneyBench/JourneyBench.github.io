import json
import re
lines = """GPT-4o                      &\textbf{2.83}&\textbf{62.18}&\textbf{56.39}&32.56&&&47.86\\
    LLaVA-Next-Qwen 110B        &3.16&40.43&    &27.18&&&\textbf{60.03}\\
    LLaVA-Next-Llama3-8B        &3.16&20.03&    &28.69&&&39.63\\
    VILA-Llama3-8B              &4.0&8.66 &24.19&\textbf{33.79}&&&21.38\\
    Mantis-Idefics2-8B          &4.5&5.25 &19.90&33.34&&&24.87\\
    GPT-4V                      &4.67&49.34&48.7 &11.24&&&44.73\\
    BEiT3 Large-0.7B            &5.16&4.10 &    &30.90&\textbf{65.90}&56.20&34.21\\
    Blip-2-FlanXXL-12B          &6.33&3.13 &    &26.00&63.78&\textbf{59.97}&20.56\\
    CogVLM v2 (Llama3)-19B      &8.33&8.73 &    &30.31&     &              &38.48\\
    InstructBLIP-Flan-T5-XXL-12B&8.5&4.31 &    &0.46 &&&24.83\\
    MiniGPT4-Vicuna13B          &9.0&3.73 &    &16.21&&&23.39\\
    mPLUG-Owl v2-9.2B           &9.5&7.07 &    &26.74&&&9.53\\
    MiniGPT4-Llama2-7B          &10.0&3.69 &    &20.91&&&15.27\\
    mPLUG-Owl-7.2B              &11.83&3.19 &    &14.68&&&8.05\\
    Human                       &&84.0 &78.9 &85.71&&&84.61\\
    Random Basline              &&0    &16.56&    &0.01&0.02&0.83"""
lines = lines.split('\\')
fields = "Method&Mean Rank&MCOT&Multi-image VQA&Captioning&Text R@1&Image R@1&VQA + Hall. Trig."
fields = [x.strip() for x in fields.split("&")]
results = []
def get_digits_from_string(s):
    return re.findall(r'\d+', s)
for line in lines:
    line = line.split('&')
    result = dict()
    for entry,field in zip(line,fields):
        entry = entry.strip()
        if entry.startswith('extbf{'):
            entry = entry[len('extbf{'):-1]
        if len(entry) == 0:
            entry = 0
        else:
            if field !="Method":
                entry = float(entry)
        
        result[field] = entry
    assert len(result)
    results.append(result)
json.dump(results,open("table_content.json","w+"),indent=4)

