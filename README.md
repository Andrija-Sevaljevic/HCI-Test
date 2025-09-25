# Voice Tab Controller – Setup Guide

## Overview
This project lets you control Chrome tabs using your voice: open, close, duplicate tabs, and search Google. It uses a **Node.js voice server** with **Vosk offline recognition** and communicates with a **Chrome extension** via Native Messaging.  

## Requirements
- **Node.js** (v16+ recommended)  
- **NPM** (comes with Node.js)  
- **Google Chrome**  
- **Microphone**  

## Step 1: Clone or Copy the Project
Place all files in a single folder on your computer, e.g.,:  
C:\Users\<YourUsername>\Desktop\VoiceTabController

## Step 2: Install Node.js Packages
Open a terminal in your project folder and run:  
npm install vosk mic

## Step 3: Download Vosk Model
1. Download the small English model: [vosk-model-small-en-us-0.15](https://alphacephei.com/vosk/models)  
2. Extract it and move **its contents** (not the folder) into a folder named `model` inside your project:  
C:\Users\<YourUsername>\Desktop\VoiceTabController\model\

## Step 4: Set Up Native Messaging in Chrome (Windows)
1. Go to:  
C:\Users\<YourUsername>\AppData\Local\Google\Chrome\User Data\
2. Create a new folder called:  
NativeMessagingHosts
3. Inside that folder, create a JSON file named:  
com.voice_tab_controller.json
4. Paste this into the JSON file, replacing `<full_path_to_voice_server.js>` with your Node.js script path and `<YOUR_EXTENSION_ID>` with your Chrome extension ID:  
{
  "name": "com.voice_tab_controller",
  "description": "Voice Tab Controller",
  "path": "<full_path_to_voice_server.js>",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://<YOUR_EXTENSION_ID>/"
  ]
}

## Step 5: Load Chrome Extension
1. Open Chrome → chrome://extensions/  
2. Enable **Developer mode**  
3. Click **Load unpacked** and select your extension folder.  

## Step 6: Run the Voice Server
In a terminal, navigate to your project folder and run:  
node voice_server.js
You should see `Listening for voice commands...` in the terminal.  

## Step 7: Connect Chrome to the Voice Server
Open the extension popup and click Connect to Voice Server. This triggers Chrome to connect to the Node.js voice server via Native Messaging. Once connected, the extension will receive voice commands automatically.

## Step 8: Test Commands
Speak clearly into your microphone:  
- "Open new tab" → opens a new tab  
- "Close tab" → closes the current tab  
- "Duplicate tab" → duplicates the current tab  
- "Search for cats" → performs a Google search  

## Notes
- The system runs **offline** after model download.  
- Ensure microphone access is granted.  
- The Node.js server must be running for voice commands to work.
