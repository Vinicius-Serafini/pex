export const isObjectEmpty = (obj: Object): boolean => {
  return Object.keys(obj).length == 0;
}

export const changeGoogleAvatarSize = (src: string, size?: number): string => {
  if (!size) {
    return src.replace(/(=?s[0-9]+-c\b)/, "");
  }

  return src.replace(/=?s[0-9]+-c\b/, `s${size}-c`);
} 