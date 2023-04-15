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

4. Create Env file

```bash
cp .env.example .env
```

5. Add your OpenAI API Key and paste into your env file under "# Your OpenAI API Key"

```bash
OPENAI_API_KEY= # Your OpenAI API key
```

6. Ready 🥳, now run command in terminal:

```bash
node selfDebug.js --scriptName buggyScript.js
```

7. Watch the Magic:

Check as it fixes the bug in the 'buggyScript.js' file! 🥳
