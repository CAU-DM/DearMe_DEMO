import deepl
import os
import ai
import asyncio

translator = None


def moderation_task(text, target_lang):
    translation = translator.translate_text(text, target_lang=target_lang)
    return create_moderation(translation.text)


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
    en_moderation_task = loop.run_in_executor(None, moderation_task, text, "EN-US")
    fr_moderation_task = loop.run_in_executor(None, moderation_task, text, "FR")

    en_flag, fr_flag, gen_content = await asyncio.gather(
        en_moderation_task, fr_moderation_task, gen_content_task
    )

    if en_flag | fr_flag:
        return None
    return gen_content


def init():
    global translator
    if translator is None:
        translator = deepl.Translator(os.getenv("DEEPL_API_KEY"))


init()
