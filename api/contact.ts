import nodemailer from "nodemailer";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, apellidos, email, telefono, mensaje } = req.body;

  const transporter = nodemailer.createTransport({
    host: "mail.agenciaprez.com",
    port: 465,
    secure: true, // SSL/TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${nombre} ${apellidos}" <${email}>`,
      to: "info@bioalimentar.com",
      subject: "Nuevo mensaje de contacto",
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><b>Nombre:</b> ${nombre} ${apellidos}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Teléfono:</b> ${telefono}</p>
        <p><b>Mensaje:</b><br>${mensaje}</p>
      `,
    });

    return res.status(200).json({ success: true, message: "Correo enviado correctamente" });
  } catch (err: any) {
    console.error("Error enviando el correo:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
