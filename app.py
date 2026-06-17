from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from pest_solutions import solutions
import numpy as np
import os

app = Flask(__name__, static_folder='frontend', static_url_path='')
CORS(app)

UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

model = load_model("pest_model.keras")

class_names = [
    "ants", "aphids", "armyworm", "bees", "beetle",
    "bollworm", "catterpillar", "earthworms", "earwig",
    "grasshopper", "mites", "moth", "sawfly", "slug",
    "snail", "stem_borer", "wasp", "weevil"
]

@app.route("/")
def home():
    return app.send_static_file("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    file = request.files["image"]
    path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(path)

    img = image.load_img(path, target_size=(224, 224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = img / 255.0

    pred = model.predict(img)
    result = class_names[np.argmax(pred)]

    pest_info = solutions.get(result, {
        "problem": "Unknown pest",
        "solution": ["No solution available"]
    })

    return jsonify({
        "prediction": result,
        "problem": pest_info["problem"],
        "solutions": pest_info["solution"]
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)
