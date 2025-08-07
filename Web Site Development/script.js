const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessage = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = fileUploadWrapper.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");

// Your Gemini API key setup
const API_KEY = "PASTE-YOUR-API-KEY";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = { message:null, file:{ data:null, mime_type:null }};
const chatHistory = [];
const initialInputHeight = messageInput.scrollHeight;

const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
}

const generateBotResponse = async (incomingMessageDiv) => {
  const messageElement = incomingMessageDiv.querySelector(".message-text");
  chatHistory.push({
    role: "user",
    parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])]
  });
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify({ contents:chatHistory })
  };
  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);
    const apiText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiText;
    chatHistory.push({ role:"model", parts:[{ text:apiText }]} );
  } catch (err) {
    messageElement.innerText = err.message;
    messageElement.style.color = "#ff0000";
  } finally {
    userData.file = {};
    incomingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top:chatBody.scrollHeight, behavior:"smooth" });
  }
};

const handleOutgoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = "";
  messageInput.dispatchEvent(new Event("input"));
  fileUploadWrapper.classList.remove("file-uploaded");

  const content = `<div class="message-text"></div>` +
    (userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>` : "");
  const userMsgDiv = createMessageElement(content, "user-message");
  userMsgDiv.querySelector(".message-text").innerText = userData.message;
  chatBody.appendChild(userMsgDiv);
  chatBody.scrollTo({ top:chatBody.scrollHeight, behavior:"smooth" });

  setTimeout(() => {
    const thinkingContent = `<svg class="bot-avatar" ...>...</svg><div class="message-text"><div class="thinking-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
    const botMsgDiv = createMessageElement(thinkingContent, "bot-message", "thinking");
    chatBody.appendChild(botMsgDiv);
    chatBody.scrollTo({ top:chatBody.scrollHeight, behavior:"smooth" });
    generateBotResponse(botMsgDiv);
  }, 600);
};

// Input auto-resize
messageInput.addEventListener("input", () => {
  messageInput.style.height = `${initialInputHeight}px`;
  messageInput.style.height = `${messageInput.scrollHeight}px`;
  document.querySelector(".chat-form").style.borderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Enter key sends
messageInput.addEventListener("keydown", (e) => {
  const txt = e.target.value.trim();
  if (e.key === "Enter" && !e.shiftKey && txt && window.innerWidth > 768) {
    handleOutgoingMessage(e);
  }
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    fileInput.value = "";
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    userData.file = { data: e.target.result.split(",")[1], mime_type: file.type };
  };
  reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

// Emoji picker setup
const picker = new EmojiMart.Picker({
  theme: "light", skinTonePosition: "none", previewPosition: "none",
  onEmojiSelect: emoji => {
    const { selectionStart:start, selectionEnd:end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: e => {
    if (e.target.id==="emoji-picker") document.body.classList.toggle("show-emoji-picker");
    else document.body.classList.remove("show-emoji-picker");
  }
});
document.querySelector(".chat-form").appendChild(picker);

// UI toggles
sendMessage.addEventListener("click", handleOutgoingMessage);
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
