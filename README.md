Self-Debugger is an experimental project that allows for automatic
debugging of javascript code with GPT. It will continually
rerun the script until all the errors are fixed by editing the code file.

## 🎉 Roadmap

This project is currently in alpha, possible features include:

- Web UI version 🌐
- Bundle compatibality with things like Vite, NextJs, Create React App, etc 📄
- More functionality and variables to play with 👨‍👩‍👦
- Ability to grab browser errors and make changes based on those errors 🔐
- Ability to handle multiple files 💾

Other Features Coming soon...

## 👨‍🚀 Getting Started

> 🚧 You will need [Nodejs](https://nodejs.org/en/) installed.

1. Clone the repository:

```bash
git clone https://github.com/ed-roh/Self-Debugger.git
```

3. Install dependencies:

```bash
cd self-debugger
npm install
```

4. Create Env and Add your OpenAI Key

```bash
cp .env.example .env
```

and then go to OpenAI, get an OpenAI API Key and paste that into "# Your OpenAI API Key"

```bash
OPENAI_API_KEY= # Your OpenAI API key
```

5. Ready 🥳, now run command in terminal:

```bash
node selfDebug.js --scriptName buggyScript.js
```

(of course you can run it on any script file, just replace buggyScript.js with any other file)

6. Watch the Magic:

Check as it fixes the bug in the 'buggyScript.js' file! 🥳
