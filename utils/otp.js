export function generateOtp() {
  const stamp = Date.now().toString();
  const token = stamp.substring(stamp.length - 6);
  return token;
}
