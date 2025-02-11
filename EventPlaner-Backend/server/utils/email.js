// utils/email.js
import nodemailer from 'nodemailer';

export const sendBookingNotification = async (providerEmail, bookingDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: providerEmail,
    subject: '📅 Nueva Reserva de Servicio - EventPlanner',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background: #ffffff; border: 1px solid #ddd;">
        <h1 style="text-align: center; color: #a770ff;">EventPlanner</h1>
        <h2 style="text-align: center; color: #333;">✨ Nueva Reserva Recibida ✨</h2>
        <p style="text-align: center; color: #777; font-size: 16px;">Has recibido una nueva solicitud de reserva en <strong>EventPlanner</strong>.</p>

        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 15px;">
          <h3 style="color: #555;">📌 Detalles de la Reserva</h3>
          <p><strong>Servicio:</strong> ${bookingDetails.serviceName}</p>
          <p><strong>Cliente:</strong> ${bookingDetails.userName}</p>
          <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
          <p><strong>Hora:</strong> ${bookingDetails.time}</p>
          <p><strong>Número de Invitados:</strong> ${bookingDetails.guests}</p>
          <p><strong>Mensaje:</strong> ${bookingDetails.message}</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <a href="http://localhost:5173/" style="background: #a770ff; padding: 12px 18px; text-decoration: none; color: #fff; font-weight: bold; border-radius: 5px; display: inline-block;">📋 Ver Reserva</a>
        </div>

        <p style="text-align: center; color: #777; margin-top: 20px; font-size: 14px;">Gracias por ser parte de <strong>EventPlanner</strong>. ¡Esperamos que tengas una excelente experiencia! 🎉</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
