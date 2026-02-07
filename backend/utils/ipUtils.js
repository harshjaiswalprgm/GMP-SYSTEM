export const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress;
};

export const isOfficeIp = (ip) => {
  if (!process.env.OFFICE_IPS) return false;

  const allowedIps = process.env.OFFICE_IPS
    .split(",")
    .map((i) => i.trim());

  return allowedIps.includes(ip);
};
