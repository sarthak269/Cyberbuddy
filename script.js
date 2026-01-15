let mode = "phishing";

function setMode(newMode) {
  mode = newMode;
  document.getElementById("result").innerHTML = "";
  document.getElementById("inputBox").value = "";
}

async function scan() {
  const input = document.getElementById("inputBox").value.trim();
  const resultBox = document.getElementById("result");
  const loader = document.getElementById("loader");

  if (!input) {
    resultBox.innerHTML = "<span style='color:#f87171'>Please enter something.</span>";
    return;
  }

  loader.style.display = "block";
  resultBox.innerHTML = "";

  try {
    // 🔥 Replace this with your real API call
    const fakeApiResponse = `
Verdict: Legit

Red Flags:
- Large scale campaigns can be highly competitive
- Always verify the official source
- Never share OTP or passwords

Advice:
Check official website & LinkedIn before applying.
    `;

    setTimeout(() => {
      loader.style.display = "none";
      renderFormattedResult(fakeApiResponse);
    }, 1000);

  } catch (err) {
    loader.style.display = "none";
    resultBox.innerHTML = "<span style='color:red'>API Error</span>";
  }
}

function renderFormattedResult(text) {
  const resultBox = document.getElementById("result");

  text = text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  resultBox.innerHTML = `
    <div style="
      white-space: normal;
      word-break: break-word;
      overflow-wrap: anywhere;
      max-width: 100%;
    ">
      ${text}
    </div>
  `;
}
