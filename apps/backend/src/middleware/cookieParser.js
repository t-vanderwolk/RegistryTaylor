export default function cookieParser() {
  return (req, _res, next) => {
    const header = req.headers.cookie;
    const cookies = {};

    if (header) {
      header.split(";").forEach((part) => {
        const [rawKey, ...valueParts] = part.trim().split("=");
        if (!rawKey) return;
        const key = decodeURIComponent(rawKey);
        const value = decodeURIComponent(valueParts.join("=") || "");
        cookies[key] = value;
      });
    }

    req.cookies = cookies;
    next();
  };
}
