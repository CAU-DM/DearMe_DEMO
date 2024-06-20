import deepl
import os

translator = 0

def init():
    global translator
    if translator == 0:
        translator = deepl.Translator(os.getenv("DEEPL_API_KEY"))

init()
