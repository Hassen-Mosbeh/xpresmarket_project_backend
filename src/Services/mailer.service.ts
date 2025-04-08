import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class MailerService {
  private readonly transporter: Transporter;

  constructor() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials are not configured');
    }

    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendResetCode(recipientEmail: string, resetCode: string): Promise<void> {
    if (!process.env.EMAIL_USER) {
      throw new Error('Sender email is not configured');
    }

    const mailOptions: SendMailOptions = {
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: 'Your Password Reset Code',
      text: `Hello,\n\nYour password reset code is: ${resetCode}\n\nRegards,\nSupport Team`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Error sending email');
    }
  }
}