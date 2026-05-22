import nodemailer from "nodemailer";

let testAccountTransporter = null;

/**
 * Initialize nodemailer transporter.
 * If live SMTP credentials are not present in .env, falls back to a dynamically
 * created Ethereal Mail test transporter, returning a direct preview URL in the console.
 */
const getTransporter = async () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    // Return live SMTP transporter
    return nodemailer.createTransport({
      host,
      port: parseInt(port),
      secure: parseInt(port) === 465,
      auth: { user, pass },
    });
  }

  // Fallback: Dynamically generate an Ethereal SMTP test account for development
  if (testAccountTransporter) {
    return testAccountTransporter;
  }

  try {
    console.log("SMTP credentials missing in .env. Creating a dynamic Ethereal Mail test account...");
    const testAccount = await nodemailer.createTestAccount();
    testAccountTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(`Ethereal Test account generated! User: ${testAccount.user}`);
    return testAccountTransporter;
  } catch (error) {
    console.error("Failed to generate Ethereal Mail test account:", error.message);
    return null;
  }
};

/**
 * Send a high-fidelity, Amazon-styled HTML Order Confirmation Email.
 * @param {Object} params - { order, user }
 */
export const sendOrderConfirmationEmail = async ({ order, user }) => {
  try {
    const transporter = await getTransporter();
    if (!transporter) {
      console.warn("Unable to initialize mail transporter. Skipping order confirmation email...");
      return;
    }

    const emailTo = user.email || "happy.lakhotia@example.in";
    const fromAddress = process.env.EMAIL_FROM || '"Amazon Clone Support" <no-reply@amazon-clone.demo>';

    // Build items list HTML
    const itemsHtml = order.items.map((item) => {
      const priceFormatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(item.price);

      const totalFormatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(item.price * item.quantity);

      const imgUrl = (item.images && item.images[0]) || "https://via.placeholder.com/100?text=Product";

      return `
        <tr style="border-bottom: 1px solid #eaeded;">
          <td style="padding: 12px 8px; vertical-align: middle;">
            <img src="${imgUrl}" alt="${item.name}" width="60" height="60" style="object-fit: contain; border-radius: 4px; border: 1px solid #eaeded;" />
          </td>
          <td style="padding: 12px 8px; font-family: Arial, sans-serif; font-size: 14px; color: #111111;">
            <div style="font-weight: bold; margin-bottom: 4px;">${item.name}</div>
            <div style="font-size: 12px; color: #565959;">Quantity: ${item.quantity}</div>
          </td>
          <td style="padding: 12px 8px; text-align: right; font-family: Arial, sans-serif; font-size: 14px; color: #111111; font-weight: bold; white-space: nowrap;">
            ${priceFormatted}
          </td>
        </tr>
      `;
    }).join("");

    const subtotalFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(order.subtotal);
    const shippingFormatted = order.shipping === 0 ? "FREE" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(order.shipping);
    const taxFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(order.tax);
    const totalFormatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(order.total);
    const deliveryFormatted = new Date(order.estimatedDelivery).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation - Amazon Clone</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #eaeded; font-family: Arial, sans-serif; -webkit-text-size-adjust: none;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #eaeded; padding: 20px 10px;">
          <tr>
            <td align="center">
              <!-- Main Email Card -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #d5d9d9;">
                
                <!-- Navy Header Banner -->
                <tr>
                  <td style="background-color: #131921; padding: 16px 24px; text-align: left; border-bottom: 4px solid #ff9900;">
                    <span style="color: #ffffff; font-size: 24px; font-weight: bold; letter-spacing: -0.5px; font-family: 'Arial Black', sans-serif;">amazon<span style="color: #ff9900;">.clone</span></span>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 24px 24px 12px 24px;">
                    <h1 style="margin: 0 0 8px 0; font-size: 20px; font-weight: bold; color: #111111;">Order Confirmation</h1>
                    <p style="margin: 0 0 20px 0; font-size: 14px; color: #333333; line-height: 1.5;">
                      Hello <strong>${order.firstName} ${order.lastName}</strong>,<br/>
                      Thank you for shopping with us! We have received your order and are preparing it for shipment. Here are the details of your transaction below.
                    </p>

                    <!-- Order Metadata Card -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f8f8; border: 1px solid #e9ecef; border-radius: 6px; padding: 16px; margin-bottom: 24px;">
                      <tr>
                        <td style="font-size: 13px; color: #565959; font-family: Arial, sans-serif;">
                          <div style="margin-bottom: 6px;"><strong>Order ID:</strong> <span style="font-family: monospace; color: #111111; font-size: 14px;">${order.id}</span></div>
                          <div style="margin-bottom: 6px;"><strong>Estimated Delivery:</strong> <span style="color: #007600; font-weight: bold;">${deliveryFormatted}</span></div>
                          <div><strong>Payment Method:</strong> Secure Digital Card</div>
                        </td>
                      </tr>
                    </table>

                    <h2 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #111111; border-bottom: 1px solid #eaeded; padding-bottom: 6px;">Delivery Address</h2>
                    <p style="margin: 0 0 24px 0; font-size: 13.5px; color: #333333; line-height: 1.5; background-color: #fcfcfc; border-left: 3px solid #ff9900; padding: 10px 14px;">
                      ${order.firstName} ${order.lastName}<br/>
                      ${order.address}${order.apartment ? `, ${order.apartment}` : ""}<br/>
                      ${order.city}, ${order.state} - ${order.zipCode}<br/>
                      Phone: ${order.phone}
                    </p>

                    <h2 style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold; color: #111111;">Items Ordered</h2>
                    
                    <!-- Items Table -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 24px;">
                      ${itemsHtml}
                    </table>

                    <!-- Totals Calculation -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 2px solid #eaeded; padding-top: 12px; margin-bottom: 20px;">
                      <tr>
                        <td width="70%" style="padding: 6px 0; text-align: right; font-size: 13.5px; color: #565959; font-family: Arial, sans-serif;">Subtotal:</td>
                        <td width="30%" style="padding: 6px 0; text-align: right; font-size: 13.5px; color: #111111; font-family: Arial, sans-serif; font-weight: 500;">${subtotalFormatted}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; text-align: right; font-size: 13.5px; color: #565959;">Shipping & Handling:</td>
                        <td style="padding: 6px 0; text-align: right; font-size: 13.5px; color: #007600; font-weight: bold;">${shippingFormatted}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; text-align: right; font-size: 13.5px; color: #565959;">Estimated Tax (GST 18%):</td>
                        <td style="padding: 6px 0; text-align: right; font-size: 13.5px; color: #111111; font-weight: 500;">${taxFormatted}</td>
                      </tr>
                      <tr style="border-top: 1px solid #eaeded;">
                        <td style="padding: 12px 0 6px 0; text-align: right; font-size: 16px; font-weight: bold; color: #111111;">Order Total:</td>
                        <td style="padding: 12px 0 6px 0; text-align: right; font-size: 18px; font-weight: bold; color: #b12704;">${totalFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Yellow/Gray Footer Block -->
                <tr>
                  <td style="background-color: #f7f8f8; padding: 20px 24px; text-align: center; border-top: 1px solid #eaeded; font-size: 12px; color: #565959; font-family: Arial, sans-serif;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #111111;">Thank you for your business!</p>
                    <p style="margin: 0 0 4px 0;">This is a demonstration email receipt generated by your secure Amazon Clone local setup.</p>
                    <p style="margin: 0;">For inquiries or developer configuration, please adjust your backend environment credentials.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: fromAddress,
      to: emailTo,
      subject: `Order Placed! Confirmation for Order #${order.id}`,
      html: emailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent successfully to ${emailTo}! Message ID: ${info.messageId}`);

    // If using ethereal test credentials, log the direct link where the developer can inspect the receipt
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n=============================================================`);
      console.log(`✉️  [MAIL PREVIEW] Order receipt email ready to view!`);
      console.log(`🔗  Click here to inspect the HTML receipt: ${previewUrl}`);
      console.log(`=============================================================\n`);
    }

  } catch (error) {
    console.error("Failed to send order confirmation email:", error.message);
  }
};

export default { sendOrderConfirmationEmail };
