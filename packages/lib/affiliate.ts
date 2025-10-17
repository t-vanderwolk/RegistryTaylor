const AFFILIATE_PARAM = "?affid=taylorvanderwolk";

export const withAff = (url: string): string =>
  url.includes("?") ? `${url}&affid=taylorvanderwolk` : `${url}${AFFILIATE_PARAM}`;
