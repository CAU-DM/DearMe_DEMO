import deepl
import os
import ai
import asyncio

translator = None


def translate_text(text, target_lang):
    translation = translator.translate_text(text, target_lang=target_lang)
    return translation.text


def create_moderation(text):
    response = ai.client.moderations.create(input=text)
    # print("[", text, "]", " <- 에 대한 테스트 수행 결과")
    # print(*response.results[0].category_scores, sep="\n")
    return response.results[0].flagged


async def moderation(messege_list_for_ai, u1, u2, u3):
    text = messege_list_for_ai[-1]["content"]
    loop = asyncio.get_event_loop()
    gen_content_task = loop.run_in_executor(
        None, ai.generate_chat, messege_list_for_ai, u1, u2, u3
    )
    en_translation_task = loop.run_in_executor(None, translate_text, text, "EN-US")
    fr_translation_task = loop.run_in_executor(None, translate_text, text, "FR")

    en_text, fr_text, gen_content = await asyncio.gather(
        en_translation_task, fr_translation_task, gen_content_task
    )

    # AI 모델 요청을 동시에 수행
    en_response_task = loop.run_in_executor(None, create_moderation, en_text)
    fr_response_task = loop.run_in_executor(None, create_moderation, fr_text)

    en_flag, fr_flag = await asyncio.gather(en_response_task, fr_response_task)
    if en_flag | fr_flag:
        return gen_content
    return None


def init():
    global translator
    if translator is None:
        translator = deepl.Translator(os.getenv("DEEPL_API_KEY"))


init()
