
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({ region: process.env.AWS_REGION });

interface EmailRequestBody {
  to?: string;
  totalTasks?: number;
  completedTasks?: number;
  pendingTasks?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const senderEmail = process.env.SES_SENDER_EMAIL;
  if (!senderEmail) {
    console.error('Falta la variable SES_SENDER_EMAIL');
    return res.status(500).json({ error: 'El servidor no está configurado correctamente' });
  }

  const { to, totalTasks, completedTasks, pendingTasks } = req.body as EmailRequestBody;

  if (!to || typeof to !== 'string') {
    return res.status(400).json({ error: 'Falta el email destinatario' });
  }

  if (
    typeof totalTasks !== 'number' ||
    typeof completedTasks !== 'number' ||
    typeof pendingTasks !== 'number'
  ) {
    return res.status(400).json({ error: 'Los datos del resumen de tareas son inválidos' });
  }

  const subject = 'Resumen de tus tareas — Gestor estratégico de tareas';

  const bodyText = [
    'Hola,',
    '',
    'Este es el resumen actual de tu lista de tareas:',
    `- Total de tareas: ${totalTasks}`,
    `- Completadas: ${completedTasks}`,
    `- Pendientes: ${pendingTasks}`,
    '',
    'Saludos,',
    'Gestor estratégico de tareas',
  ].join('\n');

  const bodyHtml = `
    <div style="font-family: sans-serif;">
      <h2>Resumen de tus tareas</h2>
      <ul>
        <li><strong>Total de tareas:</strong> ${totalTasks}</li>
        <li><strong>Completadas:</strong> ${completedTasks}</li>
        <li><strong>Pendientes:</strong> ${pendingTasks}</li>
      </ul>
    </div>
  `;

  try {
    const command = new SendEmailCommand({
      Source: senderEmail,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: {
          Text: { Data: bodyText, Charset: 'UTF-8' },
          Html: { Data: bodyHtml, Charset: 'UTF-8' },
        },
      },
    });

    const result = await sesClient.send(command);
    console.log('Email enviado, MessageId:', result.MessageId);
    return res.status(200).json({ success: true, messageId: result.MessageId });
  } catch (error: unknown) {
    console.error('Error al enviar email con SES:', error);
    return res.status(500).json({
      error: 'No se pudo enviar el email. Intentá de nuevo.',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}