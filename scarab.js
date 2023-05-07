import encrypt from "./module/encrypt.js";
import decrypt from "./module/decrypt.js";
import { rl } from "./module/questions.js";

switch (process.argv[2]) {
  case "encrypt":
    showMessage("Welcome to Scarab encrypt module!");
    encrypt();
    break;
  case "decrypt":
    showMessage("Welcome to Scarab decrypt module!");
    decrypt();
    break;
  default:
    showMessage('Enter with "encrypt" or "decrypt" module. \nExemple: node scarab encrypt');
    rl.close();
    break;
}
function showMessage(message) {
  console.log(message);
}
