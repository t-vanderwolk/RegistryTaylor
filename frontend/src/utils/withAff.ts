export function withAff(url: string): string {
  if (!url) {
    return "?affid=taylorvanderwolk";
  }

  return url.includes("?")
    ? `${url}&affid=taylorvanderwolk`
    : `${url}?affid=taylorvanderwolk`;
}

export default withAff;
