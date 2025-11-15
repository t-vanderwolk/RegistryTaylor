export function pinterestLogin() {
  const clientId = process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!clientId || !baseUrl) {
    throw new Error("Pinterest environment variables are not configured.");
  }

  const redirectUri = `${baseUrl}/api/pinterest/callback`;
  const url = new URL("https://www.pinterest.com/oauth/");
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("scope", "boards:read,pins:read,pins:write");

  window.location.href = url.toString();
}

export async function savePin(imageUrl: string, title: string, link: string) {
  await fetch("/api/pinterest/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imageUrl, title, link }),
  });
}
