// voice_server.js

// Function to send JSON to Chrome
function sendMessage(msg) {
    const json = JSON.stringify(msg);
    const buffer = Buffer.alloc(4);
    buffer.writeUInt32LE(Buffer.byteLength(json), 0);
    process.stdout.write(buffer);
    process.stdout.write(json);
}

// Immediately set up stdin listener
process.stdin.on("readable", () => {
    let chunk;
    while ((chunk = process.stdin.read(4))) {
        const msgLength = chunk.readUInt32LE(0);
        const msgBuffer = process.stdin.read(msgLength);
        if (!msgBuffer) return;

        try {
            const message = JSON.parse(msgBuffer.toString());

            // Always respond to Chrome
            sendMessage({ reply: "Message received" });

            if (message.startRecognition) {
                // Heavy logic goes here (Vosk/AudioRecorder)
                sendMessage({ reply: "Starting recognition" });
            }
        } catch (err) {
            sendMessage({ error: "Failed to parse message" });
        }
    }
});

// Keep Node alive indefinitely
setInterval(() => {}, 1000);

// Do NOT log anything to stdout except through sendMessage()
// console.log() will break Chrome Native Messaging
