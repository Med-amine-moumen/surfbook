import nodemailer from "nodemailer";

// Using a simple SMTP setup. For production, you should use environment variables.
// Fallback to Ethereal Email for development/testing if no actual SMTP provided
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  auth: {
    user: process.env.SMTP_USER || "ethereal.user@ethereal.email",
    pass: process.env.SMTP_PASS || "ethereal.pass",
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"SurfBook" <no-reply@surfbook.com>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log("Message sent: %s", info.messageId);
    // If using ethereal email, this will log a URL to view the test email
    if (info.messageId && info.envelope && info.envelope.to && info.response.includes("ethereal")) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    // Suppressing the error so the app flow isn't interrupted if email fails
  }
};

// Email Templates
export const emailTemplates = {
  bookingCreated: (customerName: string, companyName: string, bookingDetails: any) => ({
    customerHtml: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Booking Confirmation</h2>
        <p>Hi ${customerName},</p>
        <p>Your booking at <strong>${companyName}</strong> has been successfully created!</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Check-in: ${new Date(bookingDetails.checkIn).toLocaleDateString()}</li>
          <li>Check-out: ${new Date(bookingDetails.checkOut).toLocaleDateString()}</li>
          <li>Guests: ${bookingDetails.guests}</li>
        </ul>
        <p>Thank you for choosing SurfBook.</p>
      </div>
    `,
    adminHtml: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Booking Alert</h2>
        <p>You have a new booking from <strong>${customerName}</strong>.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li>Check-in: ${new Date(bookingDetails.checkIn).toLocaleDateString()}</li>
          <li>Check-out: ${new Date(bookingDetails.checkOut).toLocaleDateString()}</li>
          <li>Guests: ${bookingDetails.guests}</li>
        </ul>
        <p>Log in to your dashboard to manage this booking.</p>
      </div>
    `,
  }),

  paymentConfirmed: (customerName: string, companyName: string, amount: number) => ({
    customerHtml: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Payment Confirmed</h2>
        <p>Hi ${customerName},</p>
        <p>Your payment of <strong>$${amount}</strong> for your booking at <strong>${companyName}</strong> has been successfully processed.</p>
        <p>Thank you!</p>
      </div>
    `,
    adminHtml: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Payment Received</h2>
        <p>A payment of <strong>$${amount}</strong> has been received from <strong>${customerName}</strong>.</p>
      </div>
    `,
  }),

  bookingStatusChanged: (customerName: string, companyName: string, status: string) => ({
    customerHtml: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Booking Status Update</h2>
        <p>Hi ${customerName},</p>
        <p>The status of your booking at <strong>${companyName}</strong> has been updated to: <strong style="text-transform: capitalize;">${status}</strong>.</p>
        <p>If you have any questions, please contact the camp directly.</p>
      </div>
    `,
  }),
};
