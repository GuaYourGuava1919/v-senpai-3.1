import json
from flask_cors import CORS
from flask import Flask, request, jsonify

from dotenv import load_dotenv
load_dotenv()

# deploy 開
from api.llm_client import get_openai_response

# local 開
# from llm_client import get_groq_response, get_openai_response

app = Flask(__name__)
CORS(app)  # 啟用 CORS

@app.route('/')
def home():
    return jsonify({"message": "LLM Flask API is running."})


@app.route('/api/test', methods=['POST'])
def test():
    data = request.get_json()
    print(f"收到的資料: {data}")
    
    user_input = data.get("message", "")
    access_token = data.get("accessToken")
    history = data.get("history", [])
    
    reply = get_openai_response(access_token, user_input, history)
    
    return jsonify({"reply": reply}), 200
        
if __name__ == "__main__":
    app.run(debug=True)
