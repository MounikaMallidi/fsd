
function triggerChatbotWithPrompt(promptText, fileInfo = null) {
  // Check for dependencies from demoscript.js to ensure it has loaded.
  if (typeof createMessageElement !== 'function' || typeof generateBotResponse !== 'function' || !window.userData || !window.chatBody || !window.fileUploadWrapper) {
    console.error("Chatbot dependencies from demoscript.js are not loaded.");
    alert("Could not connect to the chatbot. Please try again.");
    return;
  }

  // 1. Show the chatbot UI.
  document.body.classList.add("chatbot-popup");

  // 2. Set the global user data for the API call.
  userData.message = promptText;
  userData.file = fileInfo ? { data: fileInfo.data, mime_type: fileInfo.mime_type } : { data: null, mime_type: null };

  // 3. Update the chatbot's file preview UI if a file was passed.
  if (fileInfo && fileInfo.data) {
    fileUploadWrapper.querySelector("img").src = fileInfo.raw_src;
    fileUploadWrapper.classList.add("file-uploaded");
  }

  // 4. Create and display the user's message in the chat, mimicking demoscript.js logic.
  const content = `<div class="message-text"></div>` + (userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment"/>` : "");
  const userMsgDiv = createMessageElement(content, "user-message");
  userMsgDiv.querySelector(".message-text").innerText = userData.message;
  chatBody.appendChild(userMsgDiv);

  // 5. Show bot "thinking" indicator and then generate the actual response.
  setTimeout(() => {
    const thinkingContent = `<div class="bot-avatar"><img src="./aiimg2.png" alt="Bot thinking..."></div><div class="message-text"></div>`;
    const botMsgDiv = createMessageElement(thinkingContent, "bot-message", "thinking");
    chatBody.appendChild(botMsgDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
    generateBotResponse(botMsgDiv);
  }, 600);
}

function generateGardenPrompt(formValues) {
  let prompt = "I need expert gardening advice for my specific situation. Here are the details:\n\n";

  prompt += `- **Garden Type:** ${formValues.gardenType || 'Not specified'}\n`;
  prompt += `- **Daily Sunlight:** ${formValues.sunlight || 'Not specified'}\n`;
  prompt += `- **Local Weather:** ${formValues.weather || 'Not specified'}\n`;
  prompt += `- **Desired Plants:** ${formValues.plantList || 'Not specified'}\n`;
  prompt += `- **Soil Type:** ${formValues.soilType || 'Not specified'}\n`;

  // Handle the maintenance array
  if (formValues.maintenance && formValues.maintenance.length > 0) {
    prompt += `- **Maintenance Preference:** ${formValues.maintenance.join(', ')}\n`;
  } else {
    prompt += "- **Maintenance Preference:** Not specified\n";
  }

  prompt += `- **Fertilizer Preference:** ${formValues.fertilizer || 'Not specified'}\n`;

  // Add the user's custom query if it exists
  if (formValues.userQuery) {
    prompt += `\n**My specific question or problem is:**\n"${formValues.userQuery}"\n`;
  }

  prompt += "\nBased on all this information, please provide a detailed step-by-step plan. Include tips on watering schedules, soil preparation, potential challenges to watch out for, and a description of what a thriving garden under these conditions would look like.";
  return prompt;
}

const gardenForm = document.getElementById('gardenForm');

if (gardenForm) {
  gardenForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Collect all values from the form.
    const formValues = {
      gardenType: document.querySelector('input[name="gardenType"]').value,
      sunlight: document.querySelector('input[name="sunlight"]').value,
      weather: document.querySelector('input[name="weather"]').value,
      plantList: document.querySelector('input[name="plantList"]').value,
      soilType: document.querySelector('input[name="soilType"]').value,
      maintenance: Array.from(document.querySelectorAll('input[name="maintenance"]:checked')).map(cb => cb.value),
      fertilizer: document.querySelector('input[name="fertilizer"]:checked')?.value || 'Not selected',
      userQuery: document.querySelector('textarea[name="userQuery"]').value,
      imageFile: document.querySelector('input[name="image"]').files[0] || null
    };

    const prompt = generateGardenPrompt(formValues);

    // If an image was uploaded, read it as a Data URL before sending it to the chatbot.
    if (formValues.imageFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileInfo = { data: e.target.result.split(",")[1], mime_type: formValues.imageFile.type, raw_src: e.target.result };
        triggerChatbotWithPrompt(prompt, fileInfo);
      };
      reader.readAsDataURL(formValues.imageFile);
    } else {
      // If no image, send the prompt to the chatbot immediately.
      triggerChatbotWithPrompt(prompt, null);
    }
  });
}
