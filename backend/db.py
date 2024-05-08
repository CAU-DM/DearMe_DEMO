from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Element(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(30), nullable=False)
    feedId = db.Column(db.Integer, nullable=False)
    feed = db.Column(db.Text, nullable=True)
    state = db.Column(db.Integer, nullable=True)
    image_path = db.Column(db.String(100), nullable=True)
    content = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f"Element('{self.user_id}', '{self.feedId}', '{self.feed}', '{self.image_path}', '{self.content}')"
