import nodemailer from "nodemailer";

const requiredConfig = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT || 465);

  if (!host || !user || !pass) {
    throw new Error("Configuracion SMTP incompleta");
  }

  return { host, user, pass, port };
};

export const sendMail = async ({ to, subject, html, text }) => {
  const { host, user, pass, port } = requiredConfig();

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });

  return transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to,
    subject,
    text,
    html,
  });
};
