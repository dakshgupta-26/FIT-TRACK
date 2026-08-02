/**
 * Utility to parse User-Agent string into device, OS, browser, and platform metadata.
 */
export const parseUserAgent = (userAgentString = "") => {
  const ua = userAgentString || "";

  let browser = "Unknown Browser";
  let os = "Unknown OS";
  let platform = "Desktop";
  let isMobile = false;
  let isTablet = false;
  let isDesktop = true;

  // Detect Mobile / Tablet / Desktop
  if (/mobile/i.test(ua)) {
    isMobile = true;
    isDesktop = false;
    platform = "Mobile";
  }
  if (/tablet|ipad/i.test(ua)) {
    isTablet = true;
    isMobile = false;
    isDesktop = false;
    platform = "Tablet";
  }

  // Detect Operating System
  if (/windows/i.test(ua)) {
    os = "Windows";
    if (/nt 10/i.test(ua)) os = "Windows 10/11";
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS";
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS";
  } else if (/android/i.test(ua)) {
    os = "Android";
  } else if (/linux/i.test(ua)) {
    os = "Linux";
  }

  // Detect Browser
  if (/edg/i.test(ua)) {
    browser = "Edge";
  } else if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) {
    browser = "Google Chrome";
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Mozilla Firefox";
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "Apple Safari";
  } else if (/opera|opr/i.test(ua)) {
    browser = "Opera";
  }

  const deviceString = `${browser} on ${os} (${platform})`;

  return {
    browser,
    os,
    platform,
    isMobile,
    isTablet,
    isDesktop,
    deviceString,
    rawUserAgent: ua,
  };
};
