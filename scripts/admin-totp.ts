/**
 * Prints a new ADMIN_TOTP_SECRET for two-step sign-in to DECHY Admin, and the link an authenticator
 * app (Google Authenticator, Microsoft Authenticator, 1Password, and others) reads. Run it on your
 * own computer, add the secret to the app ("Enter a setup key"), then put ADMIN_TOTP_SECRET in the
 * host's environment settings. Never commit it.
 * Run: npm run admin:totp
 */
import { newTotpSecret } from "../src/lib/server/totp";

const account = process.env.ADMIN_EMAIL?.trim() || "admin";
const { secret, uri } = newTotpSecret(account);
console.log("\nSetup key (enter it in your authenticator app, time based):\n");
console.log(`  ${secret.match(/.{1,4}/g)!.join(" ")}\n`);
console.log("Or open this link on the phone that has the app:\n");
console.log(`  ${uri}\n`);
console.log("Then set this in the host's environment settings:\n");
console.log(`  ADMIN_TOTP_SECRET=${secret}\n`);
