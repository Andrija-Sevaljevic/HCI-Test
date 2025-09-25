let port;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "connectNative") {
    port = chrome.runtime.connectNative('com.voice_tab_controller');

    port.onMessage.addListener((msg) => {
      const command = msg.command.toLowerCase();
      console.log("Command from Node.js:", command);

      if (command.includes("open new tab")) {
        chrome.tabs.create({});
      } else if (command.includes("close tab")) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) chrome.tabs.remove(tabs[0].id);
        });
      } else if (command.includes("duplicate tab")) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) chrome.tabs.duplicate(tabs[0].id);
        });
      } else if (command.startsWith("search for")) {
        const query = command.replace("search for", "").trim();
        chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
      }
    });

    port.onDisconnect.addListener(() => {
      console.log("Disconnected from native app");
    });

    console.log("Connected to native app");
  }
});
