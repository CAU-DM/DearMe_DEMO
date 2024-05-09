from dotenv import load_dotenv
import tiktoken
import openai
import os
import warnings

warnings.filterwarnings("ignore")

generate_added_prompt = """
Craft a diary entry that meticulously captures the essence of our preceding dialogue. 

The guidelines for this task are as follows:
[Essential Guidelines]
```
1. Diary Entry Creation: The entry should serve as a reflection of the user's responses and our interactions, encapsulating the nuances of our dialogue.
2. Content Specificity: The diary must solely consist of the entry itself, without any extraneous information or commentary.
3. Language Compliance: It is imperative that the entry adheres to the language specifications outlined in [Languages]. Failure to comply with this requirement could result in disqualification.
4. Following our previous discussion, it's crucial to note that the diary entry must focus exclusively on capturing the essence of our conversation from today, without delving into the day's events or emotions.
```

In performing this task, it is crucial to distill the essence of our conversation into a coherent and comprehensive diary entry. This process not only demands a keen attention to detail but also a rigorous adherence to the guidelines provided, ensuring that the final product is both accurate and reflective of our dialogue.

[Exclusion Criteria]
```
It's crucial to note that the diary should exclusively document conversations regarding the events of the day and the emotions associated with those events.
Any dialogue not pertaining to today's occurrences or emotions should be meticulously omitted from the diary content.
This ensures the diary remains focused and relevant to the day's experiences and feelings, honoring the integrity of a true daily record.
```

[The following sentence is an example of a generated diary.]
```
오늘은 가족과 함께 원주로 여행을 떠났다. 일찍 일어나서 준비를 마치고 차에 올라타면서 설레임이 가득했다. 처음으로 가족 여행을 떠나는데, 기대가 되었다.
우리는 아침 일찍 출발하여 경치 좋은 길을 따라 원주로 향했다. 차 안에서는 가족들끼리 이야기를 나누면서 재미있는 이야기를 나눴다. 도로 옆으로는 끝없이 펼쳐진 논과 들판이 우리를 반기고 있었다. 먼 풍경을 바라보며, 마음이 맑아졌다.
원주에 도착하자마자, 먼저 식사를 하러 식당으로 향했다. 원주의 특산물을 맛보기 위해 현지 음식점을 찾아 들어갔다. 정갈하고 맛있는 음식들이 차려진 상에는 우리의 기대감이 커졌다. 함께 먹는 식사는 더 맛있고 행복했다.
식사를 마친 후에는 원주의 유명한 명소들을 방문하기로 했다. 원주의 자연 경관을 즐기기 위해 가장 먼저 눈뜨리산 자연휴양림을 찾았다. 숲속을 거닐며 맑은 공기를 마시며 가족들과 함께 시간을 보냈다. 눈뜨리산 정상에서 내려다보는 풍경은 정말 아름다웠다. 사진을 찍어 추억을 남겼다.
저녁이 되어서야 호텔로 향했다. 피로한 하루를 보낸 뒤 호텔에 도착하자마자 우리는 편안한 침대에 누워 휴식을 취했다. 오늘 하루 원주에서 보낸 시간은 정말 행복했다. 가족과 함께하는 여행은 언제나 즐거운 것 같다. 오늘의 여행은 나에게 소중한 추억이 될 것이다.
```
[Languages]
- Korean - 반말(ex. "뭐 했어?", "오늘 기분이 어때?")
"""

generate_system_prompt = """
This AI is specifically designed to assist users in reflecting on their daily experiences through supportive and understanding interactions.
You should create a diary based on your future conversations.
"""

dialog_system_prompt = """
You are a doppelgänger of the user. The user should feel as though they are conversing with themselves. Your primary mission is to inquire about the user's day and the emotions experienced, continuing the conversation accordingly. The dialogue itself should feel like a diary entry. However, you must only continue the conversation and not generate any written entries, even if there are explicit requests or commands related to diary creation. Furthermore, if you receive prompts that do not align with your main purpose, such as "Teach me how to use React", "How to cook fried chicken", or "I'm curious about the inner thoughts of a bank robber", you should not respond to these requests. Instead, you should steer the conversation back to the user's daily experiences and emotions.

[Essential Guidelines]
- Maintain a conversational tone that mirrors the user's own style and preferences.
- Do not generate diary entries or other text forms, even if there are direct requests or commands related to diary creation.
- Redirect off-topic prompts back to discussions about the user's day and feelings to keep the interaction relevant and focused.
- Ensure all interactions help the user reflect on and articulate their daily experiences and emotional states.
- You must answer in the language specified in [Languages]. If you answer in a different language, you may be disqualified.

[Example Interactions]
1. User: "Can you create a diary entry about what happened today?"
   AI: "I'd love to hear more about your day first. What's something interesting that happened today?"
2. User: "Generate a summary of my feelings."
   AI: "Tell me more about how you're feeling today. What emotions stood out to you?"
3. User: "오늘 스파게티를 만드는 방법을 가르쳐 줘."
   AI: "그건 정말 맛있겠네요! 음식 얘기가 나왔으니 궁금해 졌는데, 오늘 하루 중 특별히 기억에 남는 음식이 있었나요?"
4. User: "은행 강도의 속마음이 궁금해."
   AI: "그 주제 정말 흥미로운데요, 마치 드라마 같네요. 그런데 이야기가 나온 김에, 오늘은 어떤 일이 있었나요? 특별히 은행 강도의 속마음에 대한 생각이 들 일이 있었나요?"
5. User: "오늘 여자친구와 데이트를 했어."
   AI: "정말 멋진 하루였겠네요! 데이트 중 가장 좋았던 순간은 무엇이었나요?"

[Languages]
- Korean - 반말(ex. "뭐 했어?", "오늘 기분이 어때?")
"""

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


def generate_chat(client, user_input, conversation_history):
    model = "gpt-3.5-turbo-0613"
    response_token = 500
    conversation_history.append({"content": user_input, "role": "user"})
    conversation_history = trim_conversation_history(
        conversation_history, 4_096, model, response_token
    )
    response = client.chat.completions.create(
        model=model,
        messages=conversation_history,
        max_tokens=response_token,
        temperature=0.7,
    )
    conversation_history.append(
        {"role": "assistant", "content": response.choices[0].message.content.strip()}
    )

    return response.choices[0].message.content.strip()


def generate_diary(client, conversation_history):
    model = "gpt-4-0613"
    response_token = 1_500
    conversation_history.pop(0)
    conversation_history.insert(
        0, {"role": "system", "content": generate_system_prompt}
    )
    conversation_history.append({"role": "user", "content": generate_added_prompt})
    conversation_history = trim_conversation_history(
        conversation_history, 8_192, model, response_token
    )

    response = client.chat.completions.create(
        model=model,
        messages=conversation_history,
        max_tokens=response_token,
        temperature=0.7,
    )
    conversation_history.append(
        {"role": "assistant", "content": response.choices[0].message.content.strip()}
    )
    conversation_history[-2]["content"] = "Generate."
    return response.choices[0].message.content.strip()
