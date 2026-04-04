export type OSType = "iOS" | "Android" | "Desktop";

/**
 * OS detection using the user-agent string.
 * This handles both server-side and client-side checks natively, 
 * bypassing the need for third-party parsing libraries.
 */
export function detectClientOS(userAgent: string | null | undefined): OSType {
  if (!userAgent) return "Desktop";
  
  const ua = userAgent.toLowerCase();
  
  if (ua.includes("android")) {
    return "Android";
  }
  
  if (
    ua.includes("iphone") || 
    ua.includes("ipad") || 
    ua.includes("ipod") || 
    ua.includes("mac os") || 
    ua.includes("macintosh")
  ) {
    return "iOS";
  }
  
  return "Desktop";
}
