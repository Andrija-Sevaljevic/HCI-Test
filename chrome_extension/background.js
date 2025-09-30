let port;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "connectNative") {
        try {
            port = chrome.runtime.connectNative('com.voice_tab_controller');

            port.onMessage.addListener((msg) => {
                console.log("Got message from Node:", msg);
            });

            port.onDisconnect.addListener(() => {
                console.error("Disconnected:", chrome.runtime.lastError);
                port = null;
            });

            sendResponse({ status: "connected" });
        } catch (err) {
            sendResponse({ status: "error", message: err.message });
        }
        return true;
    }

    if (msg.startRecognition && port) {
        port.postMessage({ startRecognition: true });
        sendResponse({ status: "started recognition" });
        return true;
    }

    sendResponse({ status: "ok" });
});
