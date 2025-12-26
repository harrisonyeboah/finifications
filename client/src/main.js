// main.js (CommonJS)
const { messaging, getToken, onMessage } = require("./firebase");
// This is it 

async function requestPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: "<YOUR_WEB_PUSH_CERTIFICATE_KEY_PAIR>", // from Firebase Console → Project Settings → Cloud Messaging
    });

    console.log("FCM Token:", token);

    // You can now send this token to your backend to trigger notifications
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
  }
}

// Listen for messages while the page is open
onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
  });
});

requestPermission();
