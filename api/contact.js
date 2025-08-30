import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { nombre, apellidos, email, telefono, mensaje } = req.body;

  const transporter = nodemailer.createTransport({
    host: "mail.agenciaprez.com",
    port: 465,
    secure: true,
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
      html: `<p><b>Nombre:</b> ${nombre} ${apellidos}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Teléfono:</b> ${telefono}</p>
             <p><b>Mensaje:</b> ${mensaje}</p>`,
    });
    return res.status(200).json({ success: true, message: "Correo enviado correctamente" });
  } catch (err) {
    console.error("Error enviando el correo:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
