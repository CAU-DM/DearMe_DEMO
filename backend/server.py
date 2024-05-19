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
    user = db.User.query.filter_by(UId=user_raw_data["UId"]).first()
    if user is None:
        user = db.User(
            UId=user_raw_data["UId"],
            Name=user_raw_data["displayName"],
            Email=user_raw_data["email"],
            persona=None,
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
    chat = (
        db.Chat.query.filter_by(UId=session["UId"])
        .order_by(db.Chat.Date.desc())
        .first()
    )
    if chat is None or not chat.Diarie:
        chat = db.Chat(UId=session["UId"])
        default_message = db.Message(
            ChatId=chat.ChatId,
            Sender=db.SenderEnum.ASSISTANT,
            Content="안녕? 오늘 하루는 어땠어?",
        )
        db.db.session.add(chat)
        db.db.session.add(default_message)
        db.db.session.commit()
    session["ChatId"] = chat.ChatId
    session.modified = True
    return jsonify({"messages": [msg.serialize() for msg in chat.Messages]})

    # uIdList = (
    #     db.Element.query.filter_by(user_id=user.UId).order_by(db.Element.id.desc()).first()
    # )
    # if uIdList is None or uIdList.state == 1:
    #     tmpElement = db.Element(
    #         id=nextId,
    #         user_id=uid,
    #         feedId=nextId,
    #         state=0,
    #         content=json.dumps(conversation_history, ensure_ascii=False),
    #     )
    #     db.db.session.add(tmpElement)
    #     db.db.session.commit()
    #     print("New element added")
    # else:
    #     tmpElement = uIdList
    #     print("already exist element")

    # session["ChatId"] = json.loads(tmpElement.content)
    # session["nowEleId"] = tmpElement.id
    # print("nowEleId:", session["nowEleId"])
    # return jsonify({"messages": tmpElement.content})


@app.route("/submit_message", methods=["POST"])
def submit_message():
    global client

    chat = db.Chat.query.filter_by(ChatId=session["ChatId"]).first()
    messege_list = chat.Messages
    user_message = db.Message(
        ChatId=session["ChatId"],
        Message=request.json["messege"],
        Sender=db.SenderEnum.USER,
    )
    messege_list_for_ai = [msg.serialize_for_ai() for msg in messege_list]
    messege_list_for_ai.append(user_message.serialize_for_ai())
    response_message = db.Message(
        ChatId=session["ChatId"],
        Message=ai.generate_chat(client, messege_list_for_ai),
        Sender=db.SenderEnum.ASSISTANT,
    )
    db.db.session.add(user_message)
    db.db.session.add(response_message)
    db.db.session.commit()
    return jsonify({"status": "success", "message": response_message.serialize()})
    # response_message = ai.generate_chat(
    #     client, request.form["message"], session["ChatId"]
    # )
    # session.modified = True
    # tmpElement = (
    #     db.Element.query.filter_by(user_id=session["UId"])
    #     .order_by(db.Element.id.desc())
    #     .first()
    # )
    # tmpElement.content = json.dumps(session["ChatId"], ensure_ascii=False)
    # db.db.session.commit()
    # # print(db.Element.query.order_by(db.Element.id.desc()).first())
    # return jsonify({"status": "success", "message": response_message})


@app.route("/generate_message", methods=["POST"])
def generate_message():
    global client

    response_message = ai.generate_diary(client, session["ChatId"])
    session.modified = True
    tmpElement = db.Element.query.filter_by(id=session["nowEleId"]).first()
    tmpElement.content = json.dumps(session["ChatId"], ensure_ascii=False)
    tmpElement.state = 1
    tmpElement.feed = response_message
    tmpElement.feedTime = datetime.now()
    db.db.session.commit()

    response_data = {"status": "success", "message": response_message}
    return jsonify(response_data)


@app.route("/get_feeds", methods=["GET"])
def get_feeds():
    feedList = (
        db.Element.query.filter_by(user_id=session["UId"], state=1)
        .order_by(db.Element.id.desc())
        .all()
    )
    return jsonify({"feedList": [feed.serialize_feed() for feed in feedList]})


if __name__ == "__main__":
    client = ai.create_openai_client()
    conversation_history = [
        {"role": "system", "content": ai.dialog_system_prompt},
        {"role": "assistant", "content": "안녕? 오늘 하루는 어땠어?"},
    ]
    app.run(
        host=os.getenv("SERVER_INTERNAL_IP"),
        port=int(os.getenv("SERVER_PORT_NUMBER")),
        debug=True,
    )
