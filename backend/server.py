from flask import Flask, request, jsonify, session, send_from_directory
import copy
import os
import ai

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.secret_key = os.urandom(24)

@app.route('/')
def index():
    session.pop('chat', None)
    session['chat'] = session.get('chat', copy.deepcopy(conversation_history))
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/submit_form', methods=['POST'])
def submit_form():
    global client

    response_message = ai.generate_chat(client, request.form['message'], session['chat'])
    session.modified = True
    print("Chat history:", session['chat'])

    response_data = {
        'status': 'success',
        'message': response_message
    }
    return jsonify(response_data)

if __name__ == '__main__':
    client = ai.create_openai_client()
    conversation_history = [{"role": "system", "content": ai.system_prompt}]
    ai.system_token = ai.num_tokens_from_messages(conversation_history, model=ai.MODEL)
    ai.encoding = ai.tiktoken.encoding_for_model(ai.MODEL)
    app.run(debug=True)
