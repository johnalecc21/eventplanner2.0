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
    subject: 'Nueva Reserva de Servicio',
    text: `
      Hola,
      
      Tienes una nueva reserva para el servicio "${bookingDetails.serviceName}".
      
      Detalles de la reserva:
      - Cliente: ${bookingDetails.userName}
      - Fecha: ${bookingDetails.date}
      - Hora: ${bookingDetails.time}
      - Número de Invitados: ${bookingDetails.guests}
      - Mensaje: ${bookingDetails.message}
      
      Por favor, revisa el panel de administración para más detalles.
      
      Gracias,
      EventPlanner
    `,
  };

  await transporter.sendMail(mailOptions);
};
