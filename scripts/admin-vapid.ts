/**
 * Prints a new VAPID key pair for DECHY Admin phone notifications (web push). Put both values in
 * the host's environment settings (the private key marked secret), never in the repository.
 * Run: npm run admin:vapid
 */
import webpush from "web-push";

const { publicKey, privateKey } = webpush.generateVAPIDKeys();
console.log("\nSet these in the host's environment settings:\n");
console.log(`  VAPID_PUBLIC_KEY=${publicKey}`);
console.log(`  VAPID_PRIVATE_KEY=${privateKey}\n`);
