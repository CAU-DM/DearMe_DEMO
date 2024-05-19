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
            Name=user_raw_data["displayName"],
            Email=user_raw_data["email"],
            persona=None,
        )
        db.db.session.add(user)
        db.db.session.commit()
        print(f"New user added: {user.UId}")
    print(f"UID: {user.UId}, Email: {user.Email}, DisplayName: {user.UName}")
    session["uid"] = user.UId
    return jsonify({"status": "success"})


@app.route("/get_chat_list", methods=["GET"])
def get_chat_list():
    chat = (
        db.Chat.query.filter_by(UId=session["uid"])
        .order_by(db.Chat.Date.desc())
        .first()
    )
    if chat is None or chat.Done == True:
        chat = db.Chat(UId=session["uid"])
        default_message = db.Message(
            ChatId=chat.ChatId,
            Sender=db.SenderEnum.ASSISTANT,
            Content="안녕? 오늘 하루는 어땠어?",
        )
        db.db.session.add(chat)
        db.db.session.add(default_message)
        db.db.session.commit()
    session["chat"] = chat.ChatId

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

    # session["chat"] = json.loads(tmpElement.content)
    # session["nowEleId"] = tmpElement.id
    # print("nowEleId:", session["nowEleId"])
    # return jsonify({"messeges": tmpElement.content})


@app.route("/submit_form", methods=["POST"])
def submit_form():
    global client

    # print("here")
    # print("Chat history:", session["chat"], "Message:", request.form["message"])
    response_message = ai.generate_chat(
        client, request.form["message"], session["chat"]
    )
    session.modified = True
    tmpElement = (
        db.Element.query.filter_by(user_id=session["uid"])
        .order_by(db.Element.id.desc())
        .first()
    )
    tmpElement.content = json.dumps(session["chat"], ensure_ascii=False)
    db.db.session.commit()
    # print(db.Element.query.order_by(db.Element.id.desc()).first())
    return jsonify({"status": "success", "message": response_message})


@app.route("/generate_form", methods=["POST"])
def generate_form():
    global client

    response_message = ai.generate_diary(client, session["chat"])
    session.modified = True
    tmpElement = db.Element.query.filter_by(id=session["nowEleId"]).first()
    tmpElement.content = json.dumps(session["chat"], ensure_ascii=False)
    tmpElement.state = 1
    tmpElement.feed = response_message
    tmpElement.feedTime = datetime.now()
    db.db.session.commit()

    response_data = {"status": "success", "message": response_message}
    return jsonify(response_data)


@app.route("/get_feeds", methods=["GET"])
def get_feeds():
    feedList = (
        db.Element.query.filter_by(user_id=session["uid"], state=1)
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
