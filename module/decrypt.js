import crypto from "crypto";
import readline from "readline";
import path from "path";
import fs from "fs";
import os from "os";

const algorithm = "aes-256-cbc";

export default async function decrypt() {
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

  //decrypt logic
  async function decrypt() {
    const file = await askQuestion("Enter the file path with the .scarab extension: ");
    const password = await askQuestion("Enter a password: ");

    const fileName = file.match(/\/([^/]+)$/)[1];
    const newName = fileName.substring(0, fileName.lastIndexOf("."));

    const hash = crypto.createHash("sha256").update(password).digest("hex");
    const iv = hash.slice(0, 16);
    const pass32 = hash.slice(0, 32);

    const decipher = crypto.createDecipheriv(algorithm, pass32, iv);
    let decrypted = decipher.update(fs.readFileSync(file));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    fs.writeFileSync(`decrypted/${newName}`, decrypted);
    console.log(`\nThe file "${fileName}" was successfully decrypted`);
    rl.close();
  }
  decrypt();
}
