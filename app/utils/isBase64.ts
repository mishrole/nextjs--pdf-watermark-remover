export const isBase64 = (str: any) => {
  if (typeof str !== "string") {
    return false;
  }

  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  const validLength = str.length % 4 === 0;

  return base64Regex.test(str) && validLength;
};
