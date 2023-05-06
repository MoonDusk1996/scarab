import crypto from "crypto";
import readline from "readline";
import path from "path";
import fs from "fs";
import os from "os";

const algorithm = "aes-256-cbc";

export default async function encrypt() {
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
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: completions,
  });

  //current question
  async function askQuestion(question) {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer);
      });
      if (question === "Enter a password: ") {
        rl.stdoutMuted = true;
        rl._writeToOutput = function _writeToOutput() {
          rl.output.write("*");
        };
      }
    });
  }

  //encrypt logic
  async function encrypt() {
    const file = await askQuestion("Enter the path of the file to be encrypted: ");
    const password = await askQuestion("Enter a password: ");

    const fileName = file.match(/\/([^/]+)$/)[1];
    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const iv = hash.slice(0, 16);
    const pass32 = hash.slice(0, 32);

    const cipher = crypto.createCipheriv(algorithm, pass32, iv);
    let encrypted = cipher.update(fs.readFileSync(file));
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    fs.writeFileSync(`./crypted/${fileName}.scarab`, encrypted);
    console.log(`\nThe file "${fileName}" was successfully encrypted`);
    rl.close();
  }
  encrypt();
}
