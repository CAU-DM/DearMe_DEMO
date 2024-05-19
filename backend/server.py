from flask import Flask, request, jsonify, session, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
import copy
import os
import ai
import db


def create_app():
    app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
    app.secret_key = os.urandom(24)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.db.init_app(app)
    with app.app_context():
        db.db.drop_all()
        db.db.create_all()
    return app


app = create_app()


@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")


@app.route("/login_success", methods=["POST"])
def login_success():
    user_raw_data = request.json
    user = db.User.query.filter_by(UId=user_raw_data["uid"]).first()
    if user is None:
        user = db.User(
            UId=user_raw_data["uid"],
            UName=user_raw_data["displayName"],
            Email=user_raw_data["email"],
            Persona=None,
        )
        db.db.session.add(user)
        db.db.session.commit()
        print(f"New user added: {user.UId}")
    print(f"UID: {user.UId}, Email: {user.Email}, DisplayName: {user.UName}")
    session["UId"] = user.UId
    session.modified = True
    return jsonify({"status": "success"})


@app.route("/get_messages", methods=["GET"])
def get_messages():
    global client

    if "UId" not in session:
        return jsonify({"status": "error", "message": "User not logged in."})

    chat = (
        db.Chat.query.filter_by(UId=session["UId"])
        .order_by(db.Chat.Date.desc())
        .first()
    )
    if chat is None or chat.Diary:
        chat = db.Chat(UId=session["UId"])
        db.db.session.add(chat)
        db.db.session.flush()
        print("here", chat.ChatId)
        default_message = db.Message(
            ChatId=chat.ChatId,
            Sender=db.SenderEnum.assistant,
            Message="안녕? 오늘 하루는 어땠어?",
            Time=datetime.now().time(),
        )
        db.db.session.add(default_message)
        db.db.session.commit()
    session["ChatId"] = chat.ChatId
    session.modified = True
    return jsonify(
        {"status": "success", "messages": [msg.serialize() for msg in chat.Messages]}
    )


@app.route("/submit_message", methods=["POST"])
def submit_message():
    global client

    if "UId" not in session:
        return jsonify({"status": "error", "message": "User not logged in."})

    chat = db.Chat.query.filter_by(ChatId=session["ChatId"]).first()
    messege_list = chat.Messages
    user_message = db.Message(
        ChatId=session["ChatId"],
        Message=request.get_json()["message"],
        Sender=db.SenderEnum.user,
        Time=datetime.now().time(),
    )
    messege_list_for_ai = [msg.serialize_for_ai() for msg in messege_list]
    messege_list_for_ai.append(user_message.serialize_for_ai())
    print(messege_list_for_ai)
    response_message = db.Message(
        ChatId=session["ChatId"],
        Message=ai.generate_chat(client, messege_list_for_ai),
        Sender=db.SenderEnum.assistant,
        Time=datetime.now().time(),
    )
    db.db.session.add(user_message)
    db.db.session.add(response_message)
    db.db.session.commit()
    return jsonify({"status": "success", "message": response_message.serialize()})


@app.route("/generate_message", methods=["POST"])
def generate_message():
    global client
    request_messages = request.get_json()["message"]

    if "UId" not in session:
        return jsonify({"status": "error", "message": "User not logged in."})

    chat = db.Chat.query.filter_by(ChatId=session["ChatId"]).first()
    messege_list_for_ai = [msg.serialize_for_ai() for msg in chat.Messages]
    response_message = db.Message(
        ChatId=session["ChatId"],
        Message=ai.generate_diary(client, messege_list_for_ai),
        Sender=db.SenderEnum.assistant,
        Time=datetime.now().time(),
    )
    db.db.session.add_all(
        [
            db.Message(
                ChatId=session["ChatId"],
                Sender=db.SenderEnum.user,
                Message=request_messages[0],
                Time=datetime.now().time(),
            ),
            db.Message(
                ChatId=session["ChatId"],
                Sender=db.SenderEnum.assistant,
                Message=request_messages[1],
                Time=datetime.now().time(),
            ),
            response_message,
            db.Message(
                ChatId=session["ChatId"],
                Sender=db.SenderEnum.assistant,
                Message=request_messages[2],
                Time=datetime.now().time(),
            ),
        ]
    )

    new_diary = db.Diary(
        ChatId=session["ChatId"],
        Content=response_message.Message,
        ImgURL="../frontend/public/img/cheon.png",
    )
    db.db.session.add(new_diary)

    db.db.session.commit()
    return jsonify({"status": "success", "message": response_message.serialize()})


@app.route("/get_feeds", methods=["GET"])
def get_feeds():
    if "UId" not in session:
        return jsonify({"status": "error", "message": "User not logged in."})

    user = db.User.query.filter_by(UId=session["UId"]).first()
    chatList = user.Chats
    diaryList = [chat.Diary for chat in chatList if chat.Diary is not None]
    print(diaryList)

    return jsonify({"feedList": [diary[0].serialize() for diary in diaryList]})


if __name__ == "__main__":
    client = ai.create_openai_client()
    app.run(
        host=os.getenv("SERVER_INTERNAL_IP"),
        port=int(os.getenv("SERVER_PORT_NUMBER")),
        debug=True,
    )
