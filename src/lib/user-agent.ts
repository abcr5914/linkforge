export function getOS(userAgent: string | null) {
  if (!userAgent) return "Desktop";

  const ua = userAgent.toLowerCase();

  if (ua.includes("android")) {
    return "Android";
  }

  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod") || ua.includes("mac os") || ua.includes("macintosh")) {
    return "iOS";
  }

  return "Desktop";
}