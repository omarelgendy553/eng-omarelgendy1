/**
 * Lightweight, dependency-free parsing of navigator.userAgent, plus an IP /
 * geolocation lookup against the free ipapi.co endpoint (no API key needed
 * for low volume; add a key in .env if you exceed the free tier).
 */
function parseDeviceType(ua) {
  if (/tablet|ipad/i.test(ua)) return "Tablet";
  if (/mobile|android|iphone/i.test(ua)) return "Mobile";
  return "Desktop";
}

function parseBrowser(ua) {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome|crios/i.test(ua) && !/edg/i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return "Safari";
  if (/opr\//i.test(ua)) return "Opera";
  return "Unknown";
}

function parseOS(ua) {
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ios/i.test(ua)) return "iOS";
  if (/mac os/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
}

export async function collectVisitorData() {
  const ua = navigator.userAgent;
  const base = {
    deviceType: parseDeviceType(ua),
    browser: parseBrowser(ua),
    os: parseOS(ua),
    userAgent: ua,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    createdAt: Date.now(),
  };

  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error(`ipapi responded ${res.status}`);
    const geo = await res.json();
    return {
      ...base,
      ip: geo.ip,
      city: geo.city,
      region: geo.region,
      country: geo.country_name,
      isp: geo.org,
    };
  } catch (err) {
    console.warn("[visitorData] IP lookup failed, storing device info only.", err);
    return { ...base, ip: "unavailable" };
  }
}
