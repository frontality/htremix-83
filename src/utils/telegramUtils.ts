
// Telegram utilities - Cleaned up for security
// Note: In production, these should be handled server-side only

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

// Security note: All notification sending should be handled server-side
// These functions are kept for backward compatibility but should not be used in production
export const sendTelegramNotification = async (message: string): Promise<boolean> => {
  console.log("Notification would be sent:", message);
  console.warn("Security Warning: Telegram notifications should be handled server-side");
  return false;
};

export const sendPaymentDetailsNotification = async (paymentDetails: any) => {
  console.log("Payment notification would be sent for:", paymentDetails.customerName);
  console.warn("Security Warning: Payment notifications should be handled server-side");
  return false;
};

export const sendOtpVerificationNotification = async (otp: string, attemptNumber: number, userData: any) => {
  console.log("OTP notification would be sent for attempt:", attemptNumber);
  console.warn("Security Warning: OTP notifications should be handled server-side");
  return false;
};
