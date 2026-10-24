/**
 * Prints an ADMIN_PASSWORD_HASH for DECHY Admin. The password is read from the terminal (or from
 * ADMIN_PASSWORD for automation) and is never written anywhere; only the scrypt hash is printed.
 * Put the hash in the host's environment settings, never in the repository.
 * Run: npm run admin:hash
 */
import readline from "node:readline";
import { hashPassword } from "../src/lib/server/auth";

async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  const password =
    process.env.ADMIN_PASSWORD ?? (await ask("Admin password (at least 6 characters): "));
  if (password.length < 6) {
    console.error("Use at least 6 characters.");
    process.exit(1);
  }
  console.log(`\nADMIN_PASSWORD_HASH=${hashPassword(password)}`);
}

main();
