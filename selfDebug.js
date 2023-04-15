const fs = require("fs");
const cp = require("child_process");
const colors = require("colors");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { Configuration, OpenAIApi } = require("openai");
const diff = require("diff");
const prettier = require("prettier");

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function runScript(scriptName) {
  return new Promise((resolve, reject) => {
    cp.execFile(process.execPath, [scriptName], (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout });
      } else {
        resolve(stdout);
      }
    });
  });
}

async function sendErrorToGpt(filePath, errorMessage, model) {
  const fileLines = fs.readFileSync(filePath, "utf-8").split("\n");

  const fileWithLines = fileLines
    .map((line, i) => `${i + 1}: ${line}`)
    .join("\n");

  const initialPromptText = fs.readFileSync("prompt.txt", "utf-8");

  const prompt =
    initialPromptText +
    "\n\n" +
    "Here is the script that needs fixing:\n\n" +
    `${fileWithLines}\n\n` +
    "Here is the error message:\n\n" +
    `${errorMessage}\n` +
    "Please provide your suggested changes, and remember to stick to the " +
    "exact format as described above.";

  const response = await openai.createChatCompletion({
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 1.0,
  });

  return response.data.choices[0].message.content.trim();
}

function applyChanges(filePath, changesJson) {
  const originalFileLines = fs.readFileSync(filePath, "utf-8").split("\n");
  const changes = JSON.parse(changesJson);

  const operationChanges = changes.filter((change) => "operation" in change);
  const explanations = changes
    .filter((change) => "explanation" in change)
    .map((change) => change.explanation);

  operationChanges.sort((a, b) => b.line - a.line);

  const fileLines = [...originalFileLines];
  for (const change of operationChanges) {
    const { operation, line, content } = change;

    if (operation === "Replace") {
      fileLines[line - 1] = content + "\n";
    } else if (operation === "Delete") {
      fileLines.splice(line - 1, 1);
    } else if (operation === "InsertAfter") {
      fileLines.splice(line, 0, content + "\n");
    }
  }

  const content = fileLines.join("\n");
  const formattedContent = prettier.format(content, { parser: "babel" });
  fs.writeFileSync(filePath, formattedContent);

  console.log(colors.brightCyan("Explanations:"));
  for (const explanation of explanations) {
    console.log(colors.cyan(`- ${explanation}`));
  }

  console.log(colors.brightCyan("\nChanges:"));
  const createTwoFilesPatch = diff.createTwoFilesPatch;
  const patchDiff = createTwoFilesPatch(
    "",
    "",
    originalFileLines.join("\n"),
    fileLines.join("\n")
  );

  for (const line of patchDiff.split("\n")) {
    if (line.startsWith("+")) {
      console.log(colors.green(line));
    } else if (line.startsWith("-")) {
      console.log(colors.red(line));
    } else {
      console.log(line);
    }
  }
}

async function main() {
  console.log(colors.brightGreen("Attempting to run script"));
  const argv = yargs(hideBin(process.argv))
    .option("scriptName", { type: "string", demandOption: true })
    .option("revert", { type: "boolean", default: false })
    .option("model", { type: "string", default: "gpt-4" }).argv;

  const { scriptName, revert, model } = argv;

  if (revert) {
    const backupFile = scriptName + ".bak";
    if (fs.existsSync(backupFile)) {
      fs.copyFileSync(backupFile, scriptName);
      console.log(`Reverted changes to ${scriptName}`);
      process.exit(0);
    } else {
      console.log(`No backup file found for ${scriptName}`);
      process.exit(1);
    }
  }

  fs.copyFileSync(scriptName, scriptName + ".bak");

  while (true) {
    try {
      const output = await runScript(scriptName);
      console.log("=========================================");
      console.log(colors.blue("Script ran successfully."));
      console.log(colors.brightCyan("Output:"));
      console.log(colors.blue(output || "None"));
      break;
    } catch ({ error, stdout }) {
      console.log("=========================================");
      console.log(colors.blue("Script crashed. Trying to fix..."));
      console.log(colors.brightCyan("Output:"));
      console.log(colors.cyan(stdout));
      const jsonResponse = await sendErrorToGpt(scriptName, stdout, model);
      applyChanges(scriptName, jsonResponse);
      console.log(colors.blue("Changes applied. Rerunning..."));
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
