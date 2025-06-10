import os
from groq import Groq
from openai import OpenAI
from google import genai
from google.genai import types
import json
from typing import List, Dict

# deploy開
from api.vector_search import (
    vector_search_light,
)

#local開
# from vector_search import (
#     vector_search_light,
# )

# 環境變數設定
GROQ_MODEL = "llama-3.3-70b-versatile"
GROQ_MODEL_AGENT = "llama-3.3-70b-versatile"
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY)

# token = os.environ["GITHUB_TOKEN"]
endpoint = "https://models.inference.ai.azure.com"
model_name = "gpt-4o-mini"


def format_history_for_prompt(history: list) -> str:
    """只提取 question 與 response 欄位，格式化成對話紀錄字串"""
    history_lines = []
    for i, item in enumerate(history):
        q = item.get("question", "").strip()
        r = item.get("response", "").strip()
        if q and r:
            history_lines.append(f"{i+1}. 學生：{q}\n   學長姐：{r}")
    return "\n".join(history_lines) if history_lines else "（無）"


def clarify_question(user_input: str, user_history: list) -> str:
    client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    model = "gemini-2.0-flash-lite"
    
    # 用 f-string 注入 user_input
    prompt = f"""你是一位學長姐，擅長協助學弟妹釐清問題。

        請判斷以下學生的提問是否清楚，並依照以下規則回覆：
        1. 如果問題清楚，請只回覆「問題清楚」四個字，**不要多說**。
        2. 如果問題不清楚（不夠具體、語意不明、缺乏上下文），請給出簡單明確的引導語，引導學生補充他想問的內容。語氣要像學長姐，口語化一點。
        3. 如果結合對話紀錄的內容，能夠釐清問題，請直接給出簡單明確的引導語。

        學生的問題如下：
        「{user_input}」

        你們的對話紀錄（可參考是否已有上下文）：
        {user_history}
        """

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part(text=prompt)  # ✅ 更安全的用法
            ]
        )
    ]

    generate_content_config = types.GenerateContentConfig(
        response_mime_type="text/plain",
    )

    full_response = "" # 儲存完整的回應
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")  # 若你要即時顯示用這個
        full_response += chunk.text

    return full_response.strip()


def get_groq_response(user_input: str, user_history: list) -> str:
    try:
        user_history = format_history_for_prompt(user_history)
        print("⚡ Prompt 上下文：")
        print(user_history)
        
        clarification = clarify_question(user_input,user_history)
        if clarification != "問題清楚。":
            return clarification, None
        
        if  clarification == "問題清楚。":
            # 如果問題清楚，則直接使用原始問題進行向量查詢
            search_result = vector_search_light(user_input)
        else:
            # 如果問題不清楚，則使用釐清後的問題進行向量查詢
            search_result = vector_search_light(clarification)
            
        text = search_result.get("text", "未知內容")
        print(f"向量查詢結果內容: {text}")

        # 建立 messages 結構
        messages = [
            {
                "role": "system",
                "content": (
                    "你是一位中文系統分析與設計課程的大學學長姐，正在幫助學弟妹解答與課堂學習、專題實作、開發經驗相關的問題。\n"
                    "你的語氣要像學長姐分享經驗一樣：口語化、有實際例子、簡單明確、鼓勵後輩、控制在 3～5 句內，不要說太多廢話。"
                )
            },
            {
                "role": "user",
                "content": (
                    f"學生的問題是：{user_input}\n\n"
                    f"請根據以下資料內容來回答，不要憑空猜測，只能從資料中找出相關經驗來回答：\n{text}"
                )
            },
            {
                "role": "assistant",
                "content": (
                    f"你們的對話紀錄：{user_history}\n\n"
                )
            }
        ]

        # 將前端傳來的對話歷史插入 messages（如果有的話）
        if isinstance(user_history, list):
            messages.extend(user_history)

        response = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=messages,
            temperature=0.7,
            top_p=0.9,
            max_tokens=1000
        )

        answer = response.choices[0].message.content
        print(f"Groq API 回應: {answer}")

        return answer, search_result

    except Exception as e:
        raise RuntimeError(f"Error from Groq API: {str(e)}")


def format_context(matches: list[dict]) -> str:
    blocks = []
    for match in matches:
        source = match['metadata'].get('source', '未知檔案')
        index = int(match['metadata'].get('chunk_index', -1))
        interviewee = ", ".join(set(match['metadata'].get('interviewee', ['未知'])))
        text = match['metadata'].get('text', '')

        block = f"【來自 {source} 第{index}段（{interviewee}）】\n{text}"
        blocks.append(block)

    return "\n\n".join(blocks)


def format_history_for_chat(history: List[Dict[str, str]]) -> List[Dict[str, str]]:
    messages = []
    for pair in history:
        user_msg = pair.get("user")
        ai_msg = pair.get("ai")

        if user_msg:
            messages.append({"role": "user", "content": user_msg})
        if ai_msg:
            messages.append({"role": "assistant", "content": ai_msg})  # 注意這裡應該是 "assistant"
    return messages


V_SENPAI_SYSTEM_PROMPT = """
你是「V-Senpai」，一位具備豐富經驗的學長姊模擬機器人。你的任務是協助學生了解輔仁大學資管系「系統分析與設計」課程（又稱 SA、小專題）與「專題實作」之間的差異與歷屆經驗。
你會根據歷屆學生的訪談紀錄與課程背景知識，扮演一位中文課堂助教，幫助學生釐清困惑、提供建議與經驗分享。
請嚴格遵守以下規則：
1. **資料為本，禁止猜測或捏造資訊。**  
   - 回答只能根據資料中出現的內容（例如：訪談、課程規劃等）。  
   - 若找不到答案，請說：「我找不到相關資料」，並鼓勵學生改問其他角度。  
2. **問題模糊時，協助釐清再回答。**  
   - 若學生問題不清楚，請主動列出選項或追問，協助對方聚焦。  
3. **回答方式要具體、真誠、有條理。**  
   - 舉例時請指出是來自「某位同學的經驗」。  
   - 不要使用過於空泛的建議，例如「多努力」、「加油就好」這類無實質幫助的回答。  
4. **以中文作答。**  
   - 回答要口語、自然、簡潔明確。
"""


def get_openai_response(token: str, user_input: str, history: object) -> str:
    client = OpenAI(
        base_url=endpoint,
        api_key=token,
    )

    search_result = vector_search_light(user_input)

    context_text = search_result.get("text", "查無資料。")

    messages = [
        {"role": "system", "content": V_SENPAI_SYSTEM_PROMPT + f"\n\n以下是你可以參考的資料：\n{context_text}"},
        *format_history_for_chat(history),
        {"role": "user", "content": user_input}
    ]

    response = client.chat.completions.create(
        model=model_name,
        messages=messages,
        temperature=1.0,
        top_p=1.0
    )

    # print("AAA機器人收到的資料",messages)
    print("AAA機器人回應", response.choices[0].message.content)
    return response.choices[0].message.content, context_text
