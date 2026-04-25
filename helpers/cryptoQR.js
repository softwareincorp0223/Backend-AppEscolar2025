import crypto from "crypto";

const SECRET = "+#k6,},vX-O]XYql";
const IV = "Dd2tt9v6Cbxl3Tsr";

const getKey = () => Buffer.from(SECRET.padEnd(32, "\0"));
const getIV = () => Buffer.from(IV);

export const encryptQR = (text) => {
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), getIV());

  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");

  return encrypted;
};