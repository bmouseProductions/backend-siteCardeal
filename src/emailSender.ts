// src/emailSender.ts
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface PropsEmail {
  nome: string;
  telefone: string;
  email: string;
  estado: string;
  cidade: string;
  descricao:string;
}

// Função para enviar email
async function sendEmail({nome,email,telefone,estado,cidade,descricao}:PropsEmail) {
  try {
    // Configuração do transportador de email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
      },
    });


    const info = await transporter.sendMail({
      from: process.env.AUTH_EMAIL,
      to: "matheustxr.profissional@gmail.com",
      subject: "Hello ✔",
      text: "Hello world?", 
      html: "<b>Hello world?</b>",
    });

    console.log('Email enviado: %s', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}
