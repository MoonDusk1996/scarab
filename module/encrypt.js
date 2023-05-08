import crypto from "crypto";
import fs from "fs";
import askQuestion, { rl } from "./questions.js";

//encrypt logic
export default async function encrypt() {
  const algorithm = "aes-256-cbc";

  const file = await askQuestion("Enter the absolute path of the file to be encrypted: ");
  const password = await askQuestion("Enter a password: ");
  const fileName = file.match(/[\/\\]([^\/\\]+)$/)[1];

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const iv = hash.slice(0, 16);
  const pass32 = hash.slice(0, 32);

  const cipher = crypto.createCipheriv(algorithm, pass32, iv);
  let encrypted = cipher.update(fs.readFileSync(file));
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  //write crypted file
  fs.mkdirSync("./encrypted", { recursive: true });
  fs.writeFileSync(`./encrypted/${fileName}.scarab`, encrypted);
  console.log(`\nThe file "${fileName}" was successfully encrypted`);
  rl.close();
}
