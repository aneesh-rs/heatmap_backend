import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'maye48@ethereal.email',
    pass: 'Gq4KNX33kzjyaqKR8E',
  },
});

const getTemplate = (fileName: string): string => {
  const filePath = path.join(__dirname, 'templates', fileName);
  return fs.readFileSync(filePath, 'utf8');
};

export const sendEmail = async (
  to: string,
  subject: string,
  templateFile: string,
  variables: Record<string, string> = {}
) => {
  let html = getTemplate(templateFile);

  for (const [key, value] of Object.entries(variables)) {
    html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });

  console.log('Message sent: %s', info.messageId);

  // If using Ethereal → preview URL
  if (process.env.SMTP_HOST?.includes('ethereal')) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};
