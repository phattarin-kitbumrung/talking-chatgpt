const speechRecognition = window.webkitSpeechRecognition;
const recognition = new speechRecognition();
let speech = new SpeechSynthesisUtterance();
speech.lang = "en-EN";
const textbox = $("#textbox");
let question = "--- Waiting for message ---";
recognition.continuous = true;
recognition.lang = "en-EN";
textbox.val(question);

recognition.onresult = async function (event) {
  recognition.stop();
  const current = event.resultIndex;
  const transcript = event.results[current][0].transcript;
  question = transcript;
  textbox.val(question);
  callchatgpt();
};

recognition.onend = () => {
  question = textbox.val();
  callchatgpt();
};

$("#start-btn").click(function (event) {
  recognition.start();
  question = textbox.val();
});

function callchatgpt() {
  const OPENAI_API_KEY = "";
  const http = new XMLHttpRequest();
  http.open("POST", "https://api.openai.com/v1/completions");
  http.setRequestHeader("Accept", "application/json");
  http.setRequestHeader("Content-Type", "application/json");
  http.setRequestHeader("Authorization", "Bearer " + OPENAI_API_KEY);

  http.onreadystatechange = function () {
    if (http.readyState === 4) {
      try {
        const message = JSON.parse(http.responseText);
        console.log(message.choices[0].text);
        const answer = message.choices[0].text;
        speech.text = answer;
        window.speechSynthesis.speak(speech);
        textbox.val(answer);
      } catch (err) {
        console.log("Error: " + err.message);
      }
    }
  };

  const data = {
    model: "text-davinci-003",
    prompt: question,
  };
  http.send(JSON.stringify(data));
}
