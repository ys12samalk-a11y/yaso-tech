const bcrypt = require("bcryptjs");

// ⚠️ غيّر الباسورد ده للباسورد اللي عايزه
const password = "yassa11@malakkyt6#56";

const hash = bcrypt.hashSync(password, 10);

console.log("");
console.log("========================================");
console.log("الباسورد الأصلي:");
console.log(password);
console.log("");
console.log("الباسورد المشفّر (حطه في .env.local):");
console.log(hash);
console.log("========================================");
console.log("");