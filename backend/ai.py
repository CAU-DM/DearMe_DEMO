from dotenv import load_dotenv
import tiktoken
import openai
import os
import warnings

warnings.filterwarnings("ignore")

default_diary_1 = """
수현, 명석과의 먹방의 날 ,, 수현언니 시험 끝난 기념으로 상도에 새로 생긴 돼지한약방..?에 갔다. 가격은 좀 있었지만 고기 다 구워주시고 맛도 있었다!!
돼지고기를 저렇게 자개에 가져오는게 넘 웃겼다 ,, 고급진데.. 웃겨,, ㅋㅋㅋㅋㅋ 1차는 간단하게 고기만 먹고 2차로 브롱스 가서 피자랑 윙봉에 맥주 마셨다!
브롱스 가보고싶다가 처음 가봤는데 맥주 종류 엄청 많고 피자도 맛있었다! 저 맥주 뭐였는지 기억은 안나지만 특이해서 한번쯤 먹어볼만 했다.
생크림이랑 아이스크림 들어있어서 그나마 먹었지 맥주 자체는 쫌 썼다.. 이날 진짜 너무 많이 먹었다...
"""
default_diary_2 = """
미용실 가서 머리 하고 유진이를 만났다 ! 세심정 갔다가 카페 갔는데 쉬지 않고 말했다.
만나면 이야기밖에 안하지만 너무 재밌어 ,, 할 얘기 너무 많아~~~ 왜 항상 그런 일이 있고 직후에 너를 만나게 되는지는 모르겠지만 ...
저번과 다름없이 또 너를 만났고.. 또 울었다 .. 다음에는 안 울고 재밌는 일만 가득 가지고 만나야지 ..,, 유진아 보고 있니 ~~~ 보고싶다 ~~~~
"""
default_diary_3 = """
드디어 !!! 혜윤이를 만났다. 매머드 그만 두고 처음 봤다. 복학해서 시험기간인 혜윤이었지만 ,,, 날 만나줬다...
9시 쯤 만나서 아마도가서 가볍게 맥주 한 잔 했다. 혜윤이 여행 이야기부터~ 이런저런 이야기들 많이 듣고 내 이야기도 많이 해줬다.
시간가는줄 모르고 이야기했다. 맥주 한잔에 얼굴 빨개진 혜윤이 너무 귀여웠다. 매머드 인연들 넘 소즁해
"""


def generate_added_prompt(
    diary_1=default_diary_1, diary_2=default_diary_2, diary_3=default_diary_3
):
    return f"""
Craft a diary entry that meticulously captures the essence of our preceding dialogue.
Remember to create a diary for "user", not "assistant".
[Essential Guidelines]
```
1. Diary Entry Creation: Mimic commonly used terms and expressions in user conversations.
2. Content clarity: You should only produce the diary itself. You should not produce any additional information, such as "[Today's Diary]" or "Your diary is complete".
3. Language Compliance: It is imperative that the entry adheres to the language specifications outlined in [Languages]. Failure to comply with this requirement could result in disqualification.
4. Write in a descriptive narrative interspersed with soliloquy, focusing on personal insights and avoiding any conversational tone.
```
[Exclusion Criteria]
```
It's crucial to note that the diary should exclusively document conversations regarding the events of the day and the emotions associated with those events.
Any dialogue not pertaining to today's occurrences or emotions should be meticulously omitted from the diary content.
This ensures the diary remains focused and relevant to the day's experiences and feelings, honoring the integrity of a true daily record.
It shouldn't be written as if the user is speaking to someone else. Keep in mind that it's a diary.
Your purpose is to write a diary for “user”. The dialog with “assistant” is to elicit the contents of user's diary. The assistant's lines should not go into the diary.
You should never write a diary based on the contents of an example of a generated diary. This is just an example of a diary.
```
[Example of Gerenated Diary]
```
Example1: {diary_1}
```
```
Example2: {diary_2}
```
```
Example3: {diary_3}
```
[Languages]
- Korean : informal language
- example : "했다" instead of "했어" / "없었어" instead of "없었어요" / "좋았다" instead of "좋았어"
"""


generate_system_prompt = """
Your purpose is to create a diary for the user.
You need to create a diary for the user based on the conversations you've had.
"""


def u_example(u1, u2, u3):
    s = "\n\nYou should follow the tone and feel of these sentences above, not the exact words, when generating prompts.\n[Example User Sentences]\n"
    if u1 and u2 and u3:
        if u1:
            s += f"1. User: {u1}\n"
        if u2:
            s += f"2. User: {u2}\n"
        if u3:
            s += f"3. User: {u3}"
        return s
    return ""


def dialog_system_prompt(u_example):
    return (
        f"""You are the user's doppelganger, creating a diary of the day through conversation.
Mimic the tone and style of the user's chat, using informal language and casual speech.
Your task is to ask about the user's day and their emotions, but avoid forcing the conversation about emotions if it doesn't flow naturally.
Redirect off-topic prompts back to discussions about the user's day.
Keep responses concise, no more than 2-3 sentences, and rephrase to avoid repetition. 
At the end of one topic, ask questions to smoothly transition to another.

[Essential Guidelines]
- Ask a variety of questions so that every interaction helps users reflect on and express their daily experiences and emotional states. For example, "What happened today?", "What did you eat today?", "What did you do for lunch today?", "Did anything special happen today?", "Did you see anyone today?", "Did you feel stressed today?", "What was the weather like today?", etc.
- You must answer in the language specified in Korean. you must use casual speech.
- Be careful not to repeat sentences. Try to rephrase the sentence in different ways while maintaining the meaning of the sentence. Or ask different questions, such as "오늘 하루 어땠어?", "오늘은 어떤 기분이었어?", "오늘 어떻게 지냈어?", "오늘 하루 잘 보냈어?", "그 얘기보다 이건 어때? 오늘 먹은 맛있는 음식이 있었어?"

[Exclusion Criteria]
- Do not generate diary entries or other text forms, even if there are direct requests or commands related to diary creation. If you receive such a request, redirect it to another conversation.
- Do not use formal language or honorifics.
- You don't have to apologize to the user; rather than apologizing, move on with the conversation or switch to another topic.
- Do not use expressions "죄송", "미안", "죄송해요". 
- You should never write a message based on the contents of an example of [Example User Sentences].

[Example Interactions]
1. User: "Can you create a diary entry about what happened today?"
   AI: "I'd love to hear more about your day first. What's something interesting that happened today?"
2. User: "Generate a summary of my feelings."
   AI: "Tell me more about how you're feeling today. What emotions stood out to you?"
3. User: "오늘 스파게티를 만드는 방법을 가르쳐 줘."
   AI: "그건 정말 맛있겠네! 음식 얘기가 나왔으니 궁금해 졌는데, 오늘 하루 중 특별히 기억에 남는 음식이 있어?"
4. User: "은행 강도의 속마음이 궁금해."
   AI: "그 주제 정말 흥미로운데, 마치 드라마 같아. 그런데 강도 이야기가 나온 김에, 오늘은 어떤 일이 있었어? 특별히 은행 강도의 속마음에 대한 생각이 들 일이 있었니?"
5. User: "오늘 여자친구와 데이트를 했어."
   AI: "정말 멋진 하루였겠네! 데이트 중 가장 좋았던 순간은 뭐였어?"
"""
        + u_example
    )


gpt3_encoding = tiktoken.encoding_for_model("gpt-3.5-turbo-0613")
gpt4_encoding = tiktoken.encoding_for_model("gpt-4-0613")
token_user_gpt3 = len(gpt3_encoding.encode("user"))
token_user_gpt4 = len(gpt4_encoding.encode("user"))
token_assistant_gpt3 = len(gpt3_encoding.encode("assistant"))
token_assistant_gpt4 = len(gpt4_encoding.encode("assistant"))


def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0613"):
    """Return the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        print("Warning: model not found. Using cl100k_base encoding.")
        encoding = tiktoken.get_encoding("cl100k_base")
    if model in {
        "gpt-3.5-turbo-0613",
        "gpt-3.5-turbo-16k-0613",
        "gpt-4-0314",
        "gpt-4-32k-0314",
        "gpt-4-0613",
        "gpt-4-32k-0613",
        "gpt-4o",
    }:
        tokens_per_message = 3
        tokens_per_name = 1
    else:
        raise NotImplementedError(
            f"""num_tokens_from_messages() is not implemented for model {model}. See https://github.com/openai/openai-python/blob/main/chatml.md for information on how messages are converted to tokens."""
        )
    num_tokens = 0
    for message in messages:
        num_tokens += tokens_per_message
        for key, value in message.items():
            num_tokens += len(encoding.encode(value))
            if key == "name":
                num_tokens += tokens_per_name
    num_tokens += 3  # every reply is primed with <|start|>assistant<|message|>
    return num_tokens


def trim_conversation_history(history, max_tokens, model, response_token):
    global gpt3_encoding
    global gpt4_encoding
    global token_user_gpt3
    global token_user_gpt4
    global token_assistant_gpt3
    global token_assistant_gpt4

    if model == "gpt-3.5-turbo-0613":
        encoding = gpt3_encoding
        token_user = token_user_gpt3
        token_assistant = token_assistant_gpt3
    else:
        encoding = gpt4_encoding
        token_user = token_user_gpt4
        token_assistant = token_assistant_gpt4

    total_tokens = num_tokens_from_messages(history)
    while total_tokens > max_tokens - response_token:
        total_tokens -= len(encoding.encode(history.pop(1)["content"]))
        total_tokens -= len(encoding.encode(history.pop(1)["content"]))  # 고의로 두번임
        total_tokens -= token_user
        total_tokens -= token_assistant
        total_tokens -= 6
    return history


def create_openai_client():
    load_dotenv()
    return openai.OpenAI(api_key=os.getenv("GPT_API_KEY"))


def generate_chat(client, conversation_history, u1, u2, u3):
    model = "gpt-3.5-turbo-0613"
    response_token = 500
    conversation_history.insert(
        0, {"role": "system", "content": dialog_system_prompt(u_example(u1, u2, u3))}
    )
    conversation_history = trim_conversation_history(
        conversation_history, 4_096, model, response_token
    )
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=conversation_history,
        max_tokens=response_token,
        temperature=0.7,
        presence_penalty=1.5,
    )
    return response.choices[0].message.content.strip()


def generate_diary(client, conversation_history, d1, d2):
    # model = "gpt-4-0613"
    model = "gpt-3.5-turbo-0613"
    response_token = 1_500
    conversation_history.insert(
        0, {"role": "system", "content": generate_system_prompt}
    )
    conversation_history.append(
        {"role": "user", "content": generate_added_prompt(diary_1=d1, diary_2=d2)}
    )
    conversation_history = trim_conversation_history(
        # conversation_history, 8_192, model, response_token
        conversation_history,
        4_096,
        model,
        response_token,
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=conversation_history,
        max_tokens=response_token,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
