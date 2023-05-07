import crypto from "crypto";
import fs from "fs";
import askQuestion, { rl } from "./questions.js";

//decrypt logic
export default async function decrypt() {
  const algorithm = "aes-256-cbc";

  const file = await askQuestion("Enter the absolute file path with the .scarab extension: ");
  const password = await askQuestion("Enter a password: ");
  const fileName = file.match(/\/([^/]+)$/)[1];
  const newName = fileName.substring(0, fileName.lastIndexOf("."));

  const hash = crypto.createHash("sha256").update(password).digest("hex");
  const iv = hash.slice(0, 16);
  const pass32 = hash.slice(0, 32);

  const decipher = crypto.createDecipheriv(algorithm, pass32, iv);
  let decrypted = decipher.update(fs.readFileSync(file));
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  //write decrypted file
  fs.writeFileSync(`decrypted/${newName}`, decrypted);
  console.log(`\nThe file "${fileName}" was successfully decrypted`);
  rl.close();
}
