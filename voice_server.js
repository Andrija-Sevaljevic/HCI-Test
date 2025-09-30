// voice_server.js

// Function to send JSON to Chrome
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
        if (!chunk) return;

        const msgLength = chunk.readUInt32LE(0);
        const msgBuffer = process.stdin.read(msgLength);
        if (!msgBuffer) return;

        try {
            const message = JSON.parse(msgBuffer.toString());

            // Always respond to Chrome
            sendMessage({ reply: "Message received", original: message });

            if (message.startRecognition) {
                // Replace this with your Vosk/AudioRecorder logic
                sendMessage({ reply: "Starting recognition" });
            }
        } catch (err) {
            sendMessage({ error: "Failed to parse message" });
        }
    }
});

// Keep Node alive
setInterval(() => {}, 1000);
