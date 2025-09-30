// voice_server.js
function sendMessage(msg) {
    const json = JSON.stringify(msg);
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(Buffer.byteLength(json), 0);
    process.stdout.write(buffer);
    process.stdout.write(json);
}

// Listen for messages from Chrome
process.stdin.on("readable", () => {
    let chunk;
    while ((chunk = process.stdin.read(4))) {
        const msgLength = chunk.readUInt32LE(0);
        const msgBuffer = process.stdin.read(msgLength);
        if (!msgBuffer) return;

        const message = JSON.parse(msgBuffer.toString());
        console.log("Got from Chrome:", message);

        if (message.startRecognition) {
            sendMessage({ reply: "Starting recognition" });
            // You can call your Vosk/audio logic here
        } else {
            sendMessage({ reply: "Message received" });
        }
    }
});

console.log("Voice server started, waiting for Chrome messages...");

// Keep Node alive
setInterval(() => {}, 1000);

process.on('SIGINT', () => {
    console.log('Exiting voice server...');
    process.exit();
});
