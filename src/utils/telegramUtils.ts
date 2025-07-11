
const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (_c) => {
    const _r = Math.random() * 16 | 0;
    const _v = _c === 'x' ? _r : (_r & 0x3 | 0x8);
    return _v.toString(16);
  });
};

const getClientInfo = () => {
  const ua = navigator.userAgent;
  const info = {
    userAgent: ua,
    browser: "Unknown",
    version: "Unknown", 
    os: "Unknown",
    device: "Unknown"
  };
  
  if (ua.indexOf("Firefox") > -1) {
    info.browser = "Mozilla Firefox";
  } else if (ua.indexOf("SamsungBrowser") > -1) {
    info.browser = "Samsung Browser";
  } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
    info.browser = "Opera";
  } else if (ua.indexOf("Trident") > -1) {
    info.browser = "Internet Explorer";
  } else if (ua.indexOf("Edge") > -1) {
    info.browser = "Microsoft Edge";
  } else if (ua.indexOf("Chrome") > -1) {
    info.browser = "Google Chrome";
  } else if (ua.indexOf("Safari") > -1) {
    info.browser = "Safari";
  }
  
  if (ua.indexOf("Win") > -1) {
    info.os = "Windows";
  } else if (ua.indexOf("Mac") > -1) {
    info.os = "MacOS";
  } else if (ua.indexOf("Linux") > -1) {
    info.os = "Linux";
  } else if (ua.indexOf("Android") > -1) {
    info.os = "Android";
  } else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) {
    info.os = "iOS";
  }
  
  if (ua.indexOf("Mobile") > -1) {
    info.device = "Mobile";
  } else if (ua.indexOf("Tablet") > -1) {
    info.device = "Tablet";
  } else {
    info.device = "Desktop";
  }
  
  return info;
};

export const generateSessionId = generateId;
export const getBrowserInfo = getClientInfo;

export const sendNotification = async (message: string): Promise<boolean> => {
  if (!message || typeof message !== 'string' || message.length > 1000) {
    return false;
  }
  return false;
};

export const sendPaymentNotification = async (details: any) => {
  if (!details || typeof details !== 'object') {
    return false;
  }
  return false;
};

export const sendVerificationNotification = async (code: string, amount: number, data: any) => {
  if (!code || typeof code !== 'string' || !amount || typeof amount !== 'number' || amount <= 0) {
    return false;
  }
  return false;
};
