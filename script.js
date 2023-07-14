/* require("dotenv").config();
var i = 0;
var txt1 = "Hello(with Rizz), I'm your personal Rizz A.I. Assistant.";
var txt2 = "How can I help you today?";
var speed = 50;

function intro() {
  var introElement = document.getElementById("intro-txt");
  var intro2 = document.getElementById("intro-txt2");

  if (i < txt1.length) {
    introElement.innerHTML += txt1.charAt(i);
    i++;
    setTimeout(intro, speed);
    return;
  }

  if (i >= txt1.length && i < txt1.length + txt2.length) {
    intro2.innerHTML += txt2.charAt(i - txt1.length);
    i++;
    setTimeout(intro, speed);
    return;
  }
}*/

let response;
let chat = [
  { role: "user", content: "hey(with rizz)" },
  { role: "assistant", content: "hi(with rizz), how may i rizz you today?" },
];

async function UserChatAdd(Emotion, Question) {
  chat.push({
    role: "user",
    content:
      "My emotion was: " +
      Emotion +
      ", My input was: " +
      Question +
      ", The output was:" +
      response +
      ".",
  });
}

async function AIChatAdd(res) {
  chat.push({ role: "assistant", content: res });
}

async function ConnectionTest() {
  let part1 = "sk";
  let part2 = "-5bpxzQt9pRMB76Vl0GXRT3B";
  let part3 = "lbkFJJcrNpEhBx1KMnMPG7tjH";

  let allParts = part1 + part2 + part3;

  const URL = "https://api.openai.com/v1/chat/completions";

  let data = {
    model: "gpt-3.5-turbo",
    messages: chat,
  };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${allParts}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const ResData = await response.json();
      const message = ResData.choices[0].message.content;
      AIChatAdd(message);
      const TTS = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(TTS);
      return message;
    } else {
      throw new Error("Response not OK");
    }
  } catch (error) {
    console.log("Oops, an error occurred: " + error);
  }
}

/*------------------------------
      teachable machine code
------------------------------*/

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/Q42kRjFbU/";

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // load the model and metadata
  // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  // or files from your local hard drive
  // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Convenience function to setup a webcam
  const flip = true; // whether to flip the webcam
  webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  await webcam.setup(); // request access to the webcam
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append elements to the DOM
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
  // predict can take in an image, video or canvas html element
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const classPrediction =
      prediction[i].className + ": " + prediction[i].probability.toFixed(2);
    labelContainer.childNodes[i].innerHTML = classPrediction;
    document.getElementById("number").value =
      prediction[i].probability.toFixed(2) * 10;
  }
}
