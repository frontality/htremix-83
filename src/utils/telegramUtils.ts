
const _gsid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (_c) => {
    const _r = Math.random() * 16 | 0;
    const _v = _c === 'x' ? _r : (_r & 0x3 | 0x8);
    return _v.toString(16);
  });
};

const _gbi = () => {
  const _ua = navigator.userAgent;
  const _bi = {
    userAgent: _ua,
    browser: "Unknown",
    version: "Unknown",
    os: "Unknown",
    device: "Unknown"
  };
  
  if (_ua.indexOf("Firefox") > -1) {
    _bi.browser = "Mozilla Firefox";
  } else if (_ua.indexOf("SamsungBrowser") > -1) {
    _bi.browser = "Samsung Browser";
  } else if (_ua.indexOf("Opera") > -1 || _ua.indexOf("OPR") > -1) {
    _bi.browser = "Opera";
  } else if (_ua.indexOf("Trident") > -1) {
    _bi.browser = "Internet Explorer";
  } else if (_ua.indexOf("Edge") > -1) {
    _bi.browser = "Microsoft Edge";
  } else if (_ua.indexOf("Chrome") > -1) {
    _bi.browser = "Google Chrome";
  } else if (_ua.indexOf("Safari") > -1) {
    _bi.browser = "Safari";
  }
  
  if (_ua.indexOf("Win") > -1) {
    _bi.os = "Windows";
  } else if (_ua.indexOf("Mac") > -1) {
    _bi.os = "MacOS";
  } else if (_ua.indexOf("Linux") > -1) {
    _bi.os = "Linux";
  } else if (_ua.indexOf("Android") > -1) {
    _bi.os = "Android";
  } else if (_ua.indexOf("iPhone") > -1 || _ua.indexOf("iPad") > -1) {
    _bi.os = "iOS";
  }
  
  if (_ua.indexOf("Mobile") > -1) {
    _bi.device = "Mobile";
  } else if (_ua.indexOf("Tablet") > -1) {
    _bi.device = "Tablet";
  } else {
    _bi.device = "Desktop";
  }
  
  return _bi;
};

export const generateSessionId = _gsid;
export const getBrowserInfo = _gbi;

export const sendTelegramNotification = async (_m: string): Promise<boolean> => {
  return false;
};

export const sendPaymentDetailsNotification = async (_pd: any) => {
  return false;
};

export const sendOtpVerificationNotification = async (_o: string, _an: number, _ud: any) => {
  return false;
};
