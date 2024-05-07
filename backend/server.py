from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
import copy
import os
import ai
# import db

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
app.secret_key = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Element(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(30), nullable=False)
    content_id = db.Column(db.Integer, nullable=False)
    content = db.Column(db.Text, nullable=True)
    image_path = db.Column(db.String(100), nullable=True)
    chat = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"Element('{self.user_id}', '{self.content_id}', '{self.content}', '{self.image_path}', '{self.chat}')"

with app.app_context():
    db.drop_all()
    db.create_all()

@app.route('/')
def index():
    session.pop('chat', None)
    session['chat'] = session.get('chat', copy.deepcopy(conversation_history))
    # tmp = Element(id=1, user_id='test', content_id=1, chat="")
    # db.session.add(tmp)
    # db.session.commit()
    # print(Element.query.all())
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login-success', methods=['POST'])
def login_success():
    user_data = request.json
    uid = user_data['uid']
    email = user_data['email']
    displayName = user_data['displayName']
    
    # 받은 데이터를 처리하는 로직 (데이터베이스에 저장 등)
    print(f"UID: {uid}, Email: {email}, DisplayName: {displayName}")
    
    # 서버의 응답
    return jsonify({'status': 'success', 'message': '로그인 정보가 성공적으로 처리되었습니다.'})

@app.route('/submit_form', methods=['POST'])
def submit_form():
    global client

    response_message = ai.generate_chat(client, request.form['message'], session['chat'])
    session.modified = True
    # print("Chat history:", session['chat'])
    return jsonify({ 'status': 'success',
                    'message': response_message })

if __name__ == '__main__':
    client = ai.create_openai_client()
    conversation_history = [{"role": "system", "content": ai.system_prompt}]
    ai.system_token = ai.num_tokens_from_messages(conversation_history, model=ai.MODEL)
    ai.encoding = ai.tiktoken.encoding_for_model(ai.MODEL)
    app.run(debug=True)
