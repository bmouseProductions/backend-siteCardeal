// src/index.ts

import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors'; 

const app = express();
dotenv.config();
const port = 8000;

// Middleware para parsear JSON
app.use(express.json());
app.use(cors());  

interface PropsEmail {
  assunto: string;
  nome: string;
  telefone: string;
  email: string;
  estado: string;
  cidade: string;
  descricao:string;
}

app.get('/', (req: Request, res: Response) => {
  res.send('API de envio de emails está rodando.');
});

// Função para enviar email
async function sendEmail({assunto, nome,email,telefone,estado,cidade,descricao}:PropsEmail) {
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
      to: "financeiro@empreendimentoscardeal.com.br",
      subject: assunto,
      html: `
      <p><strong>Nome:</strong> ${nome}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefone:</strong> ${telefone}</p>
      <p><strong>Estado:</strong> ${estado}</p>
      <p><strong>Cidade:</strong> ${cidade}</p>
      <p><strong>Descrição:</strong> ${descricao}</p>`,
    });

    console.log('Email enviado: %s', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

// Rota POST para receber os dados do email
app.post('/send-email', async (req: Request, res: Response) => {
  const { assunto, nome, email, telefone, estado, cidade, descricao } = req.body;

  try {
    await sendEmail({
      assunto,
      nome, 
      email,
      telefone,
      estado,
      cidade,
      descricao
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json({ msg: 'Email enviad com successo' });
  } catch (error) {
    console.error('Error sending the email', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Error sending the email' });
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
