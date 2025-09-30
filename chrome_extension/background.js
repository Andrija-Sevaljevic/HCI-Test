// background.js

// Optional: handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.startRecognition) {
        chrome.runtime.sendNativeMessage(
            "com.yourname.voicehost",
            { startRecognition: true },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.error("Native host error:", chrome.runtime.lastError);
                    sendResponse({ error: chrome.runtime.lastError.message });
                    return;
                }
                sendResponse(response);
            }
        );
        // Indicate async response
        return true;
    }
});
