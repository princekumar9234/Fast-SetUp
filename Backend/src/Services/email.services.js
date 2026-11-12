import config from "../config/config.js";

export const sendEmail = async (to, subject, text, html) => {
  try {
    if (!config.BREVO_API_KEY) {
      console.warn("⚠️ Warning: BREVO_API_KEY is not set in environment variables. Email will not be sent.");
      return null;
    }

    const senderEmail = config.BREVO_SENDER_EMAIL || "sadipur92@gmail.com";

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": config.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "PrinceChauhan",
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html || `<p>${text}</p>`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Brevo Email Error:", data);
      return null;
    }

    console.log("✅ Email sent successfully via Brevo. Message ID:", data.messageId);
    return data;
  } catch (error) {
    console.error("❌ Error sending email via Brevo:", error);
    return null;
  }
};
