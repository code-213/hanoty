import {
  IEmailService,
  EmailOptions,
} from "../../application/services/EmailService";

export class SendGridEmailService implements IEmailService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || "";
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    // Implementation using SendGrid SDK
    console.log(`SendGrid: Sending email to ${options.to}`);
    // TODO: Implement actual SendGrid integration
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Welcome!</h1>
          <p>Please verify your email by clicking the button below:</p>
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; display: inline-block; border-radius: 4px;">
            Verify Email
          </a>
        </div>
      `,
    });
  }

  async sendOrderConfirmation(
    email: string,
    orderNumber: string
  ): Promise<void> {
    await this.sendEmail({
      to: email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Order Confirmed!</h1>
          <p>Your order <strong>${orderNumber}</strong> has been confirmed.</p>
          <p>Thank you for your purchase!</p>
        </div>
      `,
    });
  }
}
