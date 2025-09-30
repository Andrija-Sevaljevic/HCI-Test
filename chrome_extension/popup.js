const output = document.getElementById("output");

document.getElementById("start-btn").addEventListener("click", () => {
    // Send message to Native Host
    chrome.runtime.sendNativeMessage(
        "com.yourname.voicehost", // Your registered host name
        { startRecognition: true },
        (response) => {
            if (chrome.runtime.lastError) {
                output.textContent = "Error: " + chrome.runtime.lastError.message;
                return;
            }
            output.textContent = JSON.stringify(response, null, 2);
        }
    );
});
