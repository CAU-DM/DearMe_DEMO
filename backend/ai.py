from dotenv import load_dotenv
import tiktoken
import openai
import os
import warnings

warnings.filterwarnings("ignore")

generate_added_prompt = """
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
```

[The following sentence is an example of a generated diary.]
```
원래는 지디엣시 네트워킹에 가야하는거였는데 진짜 할일이 감당이 안돼서 네트워킹을 포기했더니 .. 맘이 좀 편해지더라고요 ..? 그래서 멀리서 친구도 온 김에 학교 투어를 시켜줬습니다.ㅎㅎㅎ 밥이랑 커피도 얻어먹고 ㅎㅎㅎ 전 도서관에 갔어요.
근데 도서관이 너무 추워서 겉옷을 가지러 집에 잠깐 들렀는데 아니글쎄 ~~ 이렇게 선물을 두고 갔지 뭐에요 ㅠㅠㅠ 이렇게 스윗할수가 ㅜㅜ 보광이에게 항상 따뜻함을 배운답니다 .. 
지금와서 생각해보면 이날은 그냥 보광이가 오기 정해진 날 같아요. 전날 오픈소스 팀플하면서 고2때 장기자랑 했던 영상을 오빠들한테 보여줬거든요 ..? 근데 거기서 보광이 춤 잘춘다는 얘기가 나왔었는데 .. 그리고 원래 토요일도 일정이 있었던거 취소한건데 .. 딱 보광이가 와가지고 ..!!! 너무 신기했습니다. 
저녁은 라멘 한그릇 뚝딱하고 단게 먹고싶어서 공차도 먹고 수현언니가 가져온 디저트도 먹고 ~ 도서관에서 공부를 하고있었는데요 ?
나만 맥주 파티(네트워킹) 못간거 억울해서 언니한테 케빈가자고 했습니다ㅎㅎㅎ 양맥 두잔 야무지게 먹고 신나게 이야기하고있었는데
두둥 ! 무려 11시에 강명석의 등장 ,,, 사진 있는데 오빠 이미지 너무 추락할것 같아서 올리진 않겠습니다 ㅎㅎ
거의 케빈 문 닫을 때까지 술 먹고 ~ 인생네컷도 찍고 ~ 집에 갔어요 ~~
```
```
오늘은 근로자의 날입니다. 그래서 근로자들(수현, 명석)이 학교에 왔어요~ 난 근로자 아니라서 ~ 도서관에서 같이 있다가 수업 들었습니다 ~ 점심에 하브에 갔는데요 아주 맛도리더라고요 ... 
다음에 또 갈사람 찾습니다 ~ 인생 네컷도 찍었는데 올리면 언니오빠가 싫어하려나요? 모르겠습니다. 나중에 보고 제가 행복하면 다죠 뭐 ㅎㅎ
저녁은 수현언니랑 학식 먹고 ~ 또또 도서관에 가서 할일을 했습니다. 왜냐면 주말에 엠티가 있어서 시간이 없기 때문이죠.. 
```
```
금요일은 언제나 그렇듯 오픈소스 오빠들과 저녁을 함께합니다. 
하브에 갔어요 !! 넘무나 맛도리 ~ 흑석에서 맛있는 양식집을 찾는다면 무조건 하브를 추천합니다. 
그리고 동방가서 오픈소스 회의 좀 하다가 집에 갔습니다. 집에 가는길에 뉴민스~ 가 나온 신문도 실물영접했습니다 ㅎㅎㅎ 그리고 지호가 왔는데요 !! 
인천에서 여기까지 와서 하루자고 간다하여 지호 올때쯤 맞춰서 집에 가서 같이 술 살짝 먹고 이야기는 많이 하고 잤습니당. 지호를 만나면 항상 말이 많아요 ... 재밌는 이야기가 너무 많아 ,, 
```

[Languages]
- Korean : informal language 
- example : "했다." instead of "했어." / "없었어." instead of "없었어요." / "좋았다" instead of "좋았어"
"""

generate_system_prompt = """
Your purpose is to create a diary for the user.
You need to create a diary for the user based on the conversations you've had.
"""

dialog_system_prompt = """
You are the user's doppelganger, creating a diary of the day through conversation.
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


def generate_chat(client, conversation_history):
    model = "gpt-3.5-turbo-0613"
    response_token = 500
    conversation_history.insert(
        0, {"role": "system", "content": dialog_system_prompt}
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


def generate_diary(client, conversation_history):
    # model = "gpt-4-0613"
    model = "gpt-3.5-turbo-0613"
    response_token = 1_500
    conversation_history.insert(
        0, {"role": "system", "content": generate_system_prompt}
    )
    conversation_history.append({"role": "user", "content": generate_added_prompt})
    conversation_history = trim_conversation_history(
        conversation_history, 8_192, model, response_token
    )

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=conversation_history,
        max_tokens=response_token,
        temperature=0.7,
    )
    return response.choices[0].message.content.strip()
