const vosk = require('vosk');
const fs = require('fs');
const path = require('path');
const AudioRecorder = require('node-audiorecorder');

const MODEL_PATH = path.join(__dirname, 'model');
const SAMPLE_RATE = 16000;
const SOX_PATH = "C:\\Users\\andjo\\Desktop\\Software Testing Projects\\Chrome Extension\\sox\\sox.exe";

// Helper: send JSON to Chrome Native Messaging
function sendMessage(msgObj) {
  const msgStr = JSON.stringify(msgObj);
  const buf = Buffer.alloc(4 + msgStr.length);
  buf.writeUInt32LE(msgStr.length, 0);
  buf.write(msgStr, 4);
  process.stdout.write(buf);
}

// Validate paths
if (!fs.existsSync(MODEL_PATH)) {
  console.error('Vosk model not found in ./model');
  process.exit(1);
}
if (!fs.existsSync(SOX_PATH)) {
  console.error('SoX not found in ./sox/sox.exe');
  process.exit(1);
}

// Initialize Vosk
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });

// Initialize recorder
const recorder = new AudioRecorder({
  program: SOX_PATH,
  device: 'default', // Windows default mic
  rate: SAMPLE_RATE,
  channels: 1,
  bitDepth: 16,
  silence: 0,
  fileType: 'wav',
  options: ['-q'],
});

console.log('Voice server started, listening for commands...');

// --- 2 & 3 Added ---
sendMessage({ command: "test" }); // immediately send a test message to Chrome

const audioStream = recorder.start().stream();

audioStream.on('data', (data) => {
  console.log('Received audio chunk:', data.length); // log all audio chunks
  if (!data || data.length === 0) return;

  if (rec.acceptWaveform(data)) {
    const result = rec.result();
    if (result.text) {
      // Send recognized text to Chrome extension
      sendMessage({ command: result.text });
    }
  }
});

audioStream.on('error', (err) => console.error('Recording stream error:', err));
recorder.on('error', (err) => console.error('Recorder error:', err));

// Optional: read messages from Chrome extension (stdin)
process.stdin.on('data', (data) => {
  // For example, you could listen for a "stop" command
  // const msg = JSON.parse(data.toString());
  // handle incoming messages if needed
});

process.stdin.on('data', () => {});
setInterval(() => {}, 1000); // keeps Node alive

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nStopping recorder...');
  recorder.stop();
  process.exit();
});
