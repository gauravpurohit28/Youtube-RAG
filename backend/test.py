import google.generativeai as genai

# Authenticate first
genai.configure(api_key="AIzaSyBK-VZXAI3kHufzyuCKcbQ5vWv9X9eFX68")

# List all available models
for model in genai.list_models():
    print(model.name)
