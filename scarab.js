import encrypt from "./module/encrypt.js";
import decrypt from "./module/decrypt.js";

if (process.argv[2] === "encrypt") {
  encrypt();
}
if (process.argv[2] === "decrypt") {
  decrypt();
}
