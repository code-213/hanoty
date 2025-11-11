export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IEmailService {
  sendEmail(options: EmailOptions): Promise<void>;
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendOrderConfirmation(email: string, orderNumber: string): Promise<void>;
}

export class EmailService implements IEmailService {
  async sendEmail(options: EmailOptions): Promise<void> {
    // Implementation would use SendGrid, AWS SES, etc.
    console.log(`Sending email to ${options.to}: ${options.subject}`);
    // TODO: Implement actual email sending
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <h1>Welcome!</h1>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
    });
  }

  async sendOrderConfirmation(
    email: string,
    orderNumber: string
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: "Order Confirmation",
      html: `
        <h1>Order Confirmed!</h1>
        <p>Your order ${orderNumber} has been confirmed.</p>
        <p>Thank you for your purchase!</p>
      `,
    });
  }
}
