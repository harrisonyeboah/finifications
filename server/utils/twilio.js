// smsTest.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // adjust path if needed
const twilio = require('twilio');

// Check environment variables
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
  console.error("One or more Twilio environment variables are missing!");
  console.error({ TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER });
  process.exit(1); // stop execution
}

// Initialize Twilio client
const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Send SMS function
async function sendSMS(to, message) {
  try {
    const res = await client.messages.create({
      body: message,
      from: TWILIO_PHONE_NUMBER,
      to: to,
    });
    console.log("✅ SMS Sent! SID:", res.sid);
    return res;
  } catch (err) {
    console.error("❌ Twilio error code:", err.code, "message:", err.message);
    console.error("Full error object:", err);
  }
}

// List verified outgoing numbers (useful for trial accounts)
async function listVerifiedNumbers() {
  try {
    const numbers = await client.outgoingCallerIds.list();
    if (numbers.length === 0) {
      console.log("No verified outgoing numbers found.");
    } else {
      console.log("Verified outgoing numbers:");
      numbers.forEach((num) => console.log("📞", num.phoneNumber));
    }
  } catch (err) {
    console.error("Error fetching verified numbers:", err);
  }
}

// Example usage
(async () => {
  console.log("Listing verified numbers first...");
  await listVerifiedNumbers();

  console.log("\nSending test SMS...");
  // Replace with a verified number if on a trial account
  await sendSMS("+17738176657", "Hello from Twilio test!");
})();
