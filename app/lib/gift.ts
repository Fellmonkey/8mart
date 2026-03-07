export interface GiftData {
  n: string; // name
  m: string; // message
  c: string; // certificate / gift
}

export function encodeGift(data: GiftData): string {
  const json = JSON.stringify(data);
  // TextEncoder for proper UTF-8 support (cyrillic, etc.)
  const bytes = new TextEncoder().encode(json);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeGift(encoded: string): GiftData | null {
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const binary = atob(b64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    const parsed = JSON.parse(json);
    if (typeof parsed.n === "string" && typeof parsed.m === "string" && typeof parsed.c === "string") {
      return parsed as GiftData;
    }
    return null;
  } catch {
    return null;
  }
}
