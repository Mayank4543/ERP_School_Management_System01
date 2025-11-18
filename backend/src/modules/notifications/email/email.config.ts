import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.MAIL_PORT, 10) || 587,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  from: {
    name: process.env.MAIL_FROM_NAME || 'GegoK12 ERP',
    address: process.env.MAIL_FROM_ADDRESS || 'noreply@gegok12.com',
  },
}));
