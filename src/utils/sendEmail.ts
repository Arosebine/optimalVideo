import nodemailer from 'nodemailer';


export class GmailMessagingService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'zoho',
      host: process.env.GMAIL_ADDRESS,
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.PASSWORD, 
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text
      };

      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

}
