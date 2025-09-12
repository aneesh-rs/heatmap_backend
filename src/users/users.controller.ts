import { Request, Response } from 'express';
import { sendEmail } from '../emails/emailService';

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    await sendEmail(email, message, 'welcome.html', {
      username: email,
    });

    return res.json({ message: 'User registered & welcome email sent!' });
  } catch (err) {
    console.log('process.env.SMTP_HOST', process.env.SMTP_HOST);
    console.log('process.env.SMTP_USER', process.env.SMTP_USER);
    console.log('process.env.SMTP_PASS', process.env.SMTP_PASS);

    console.log(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
