from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

from flask import Flask, request, jsonify
from transformers import pipeline

app = Flask(__name__)

classifier = pipeline(
    "text-classification",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

SCAM_KEYWORDS = [
    "urgent",
    "otp",
    "reward",
    "claim",
    "prize",
    "lottery",
    "verify",
    "bank account",
    "click link",
]

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    text = data.get("text", "")

    sentiment = classifier(text)[0]

    fraud_score = 0

    reasons = []

    for keyword in SCAM_KEYWORDS:
        if keyword.lower() in text.lower():
            fraud_score += 15
            reasons.append(
                f"Suspicious keyword detected: {keyword}"
            )

    if sentiment["label"] == "NEGATIVE":
        fraud_score += 20
        reasons.append(
            "Negative/urgent language detected"
        )

    fraud_score = min(fraud_score, 100)

    return jsonify({
        "fraud_score": fraud_score,
        "sentiment": sentiment,
        "reasons": reasons
    })

if __name__ == "__main__":
    app.run(port=8000)