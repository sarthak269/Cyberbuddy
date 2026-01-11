let mode = "phishing";

// ---------- MODE SWITCH ----------
function setMode(selectedMode) {
  mode = selectedMode;

  document.getElementById("result").innerHTML = "";
  document.getElementById("inputBox").value = "";

  document.getElementById("liveStrength").style.display = "none";
  document.getElementById("liveCrackTime").style.display = "none";

  if (mode === "password") {
    document.getElementById("liveStrength").style.display = "block";
    document.getElementById("liveCrackTime").style.display = "block";
  }

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.style.background = "#0f172a";
  });

  document.getElementById(selectedMode + "Tab").style.background = "#2563eb";
}

// ---------- LIVE PASSWORD ANALYSIS ----------
function analyzePasswordLive(password) {
  if (mode !== "password") return;

  let strength = "Weak";
  let crackTime = "Few seconds";
  let colorClass = "phishing";

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 8) score++;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;

  if (score <= 2) {
    strength = "Weak";
    crackTime = "Few minutes to hours";
    colorClass = "phishing";
  } 
  else if (score === 3 || score === 4) {
    strength = "Medium";
    crackTime = "Few days to months";
    colorClass = "suspicious";
  } 
  else if (score === 5) {
    strength = "Strong";
    crackTime = "Years to centuries";
    colorClass = "safe";
  }

  document.getElementById("liveStrength").innerHTML = `
    <div class="badge ${colorClass}">${strength}</div>
  `;

  document.getElementById("liveCrackTime").innerHTML = `
    Estimated crack time: ${crackTime}
  `;
}

// ---------- INPUT LISTENER ----------
document.getElementById("inputBox").addEventListener("input", function () {
  if (mode === "password") {
    analyzePasswordLive(this.value);
  }
});

// ---------- PASSWORD GENERATOR ----------
function generatePassword() {
  if (mode !== "password") return;

  const length = 14;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  document.getElementById("inputBox").value = password;
  analyzePasswordLive(password);
}

// ---------- TOGGLE EXPLANATION ----------
function toggleExplanation() {
  const box = document.getElementById("explanationBox");
  box.style.display = (box.style.display === "none") ? "block" : "none";
}

// ---------- MAIN SCAN ----------
async function scan() {
  const input = document.getElementById("inputBox").value;
  const resultBox = document.getElementById("result");

  resultBox.innerHTML = "";
  document.getElementById("loader").style.display = "block";

  try {
    const response = await fetch(" https://unpliable-discouragingly-jeni.ngrok-free.dev/scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: input, mode: mode }),
    });

    const data = await response.json();
    let output = data.result || data.error;
    let badge = "";

    if (mode === "password") {
      let summary = "Password Analysis";

      if (output.toLowerCase().includes("weak")) {
        badge = `<div class="badge phishing">WEAK</div>`;
        summary = "Your password is Weak";
      } 
      else if (output.toLowerCase().includes("medium")) {
        badge = `<div class="badge suspicious">MEDIUM</div>`;
        summary = "Your password is Medium";
      } 
      else if (output.toLowerCase().includes("strong")) {
        badge = `<div class="badge safe">STRONG</div>`;
        summary = "Your password is Strong";
      }

      resultBox.innerHTML = `
        ${badge}
        <p><strong>${summary}</strong></p>
        <button class="scan-btn" onclick="toggleExplanation()">See Explanation</button>
        <div id="explanationBox" style="display:none; margin-top:10px;">
          <pre>${output}</pre>
        </div>
      `;
    } 
    else {
      if (output.toLowerCase().includes("safe")) {
        badge = `<div class="badge safe">SAFE</div>`;
      } 
      else if (output.toLowerCase().includes("suspicious")) {
        badge = `<div class="badge suspicious">SUSPICIOUS</div>`;
      } 
      else if (output.toLowerCase().includes("phishing") || output.toLowerCase().includes("fake")) {
        badge = `<div class="badge phishing">PHISHING</div>`;
      }

      resultBox.innerHTML = badge + "<pre>" + output + "</pre>";
    }

    resultBox.classList.remove("pop-in");
    void resultBox.offsetWidth;
    resultBox.classList.add("pop-in");

  } catch (error) {
    resultBox.innerHTML = "Server error!";
  }

  document.getElementById("loader").style.display = "none";
}

// ---------- INTRO SOUND + SHIELD ----------
const introScreen = document.getElementById("introScreen");
const introSound = document.getElementById("introSound");

if (introScreen && introSound) {
  introScreen.addEventListener("click", () => {
    introSound.muted = false;
    introSound.volume = 0.7;

    introSound.play()
      .then(() => {
        console.log("Sound playing");
      })
      .catch(err => {
        console.log("Sound blocked:", err);
      });

    introScreen.style.animation = "fadeOut 1s ease forwards";

    setTimeout(() => {
      introScreen.style.display = "none";
    }, 1000);
  });
}

// Hide live UI initially
document.getElementById("liveStrength").style.display = "none";
document.getElementById("liveCrackTime").style.display = "none";

