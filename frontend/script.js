document.getElementById("imageInput").onchange = function(event) {
    let file = event.target.files[0];
    if (!file) return;

    let preview = document.getElementById("preview");
    let uploadInner = document.getElementById("uploadInner");

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    uploadInner.style.display = "none";
};

function detectDisease() {
    let file = document.getElementById("imageInput").files[0];
    if (!file) {
        alert("Please select an image first!");
        return;
    }

    let formData = new FormData();
    formData.append("image", file);

    document.getElementById("result").innerHTML =
        `<div class="detecting-text">🔍 Analysing image... Please wait</div>`;

    fetch("https://ai-pest-monitoring.onrender.com/predict", {
        method: "POST",
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        let solutionList = data.solutions
            .map(s => `<li>${s}</li>`)
            .join("");

        document.getElementById("result").innerHTML =
            `<div class="result-box">
                <div class="result-title">🌿 Detection Result</div>

                <div class="result-row">
                    <div class="result-icon">🐛</div>
                    <div>
                        <div class="result-label">Detected Pest</div>
                        <div class="pest-name">${data.prediction}</div>
                    </div>
                </div>

                <div class="result-row">
                    <div class="result-icon">⚠️</div>
                    <div>
                        <div class="result-label">Problem</div>
                        <div class="problem-text">${data.problem}</div>
                    </div>
                </div>

                <div class="result-row">
                    <div class="result-icon">💊</div>
                    <div style="width:100%">
                        <div class="result-label">Recommended Solutions</div>
                        <ul class="solutions-list">${solutionList}</ul>
                    </div>
                </div>
            </div>`;
    })
    .catch(err => {
        document.getElementById("result").innerHTML =
            `<p style="color:red; text-align:center; padding:20px;">
                ❌ Error connecting to server. Please make sure the backend is running.
            </p>`;
        console.error(err);
    });
}
