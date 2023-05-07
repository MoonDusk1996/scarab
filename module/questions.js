import readline from "readline";
import path from "path";
import fs from "fs";
import os from "os";

//tabulation
const completions = (line, callback) => {
  let hits = [];
  const dir = os.homedir();
  fs.readdirSync(dir).forEach((file) => {
    if (file.startsWith(line)) {
      hits.push(path.join(dir, file));
    }
  });
  callback(null, [hits.length ? hits : null, line]);
};

//cl inputs and outputs
export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  completer: completions,
});

//current question
export default async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
    if (question.includes("password")) {
      rl.stdoutMuted = true;
      rl._writeToOutput = function _writeToOutput() {
        rl.output.write("*");
      };
    }
  });
}
