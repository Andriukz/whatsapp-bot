import wp from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import initialize from './Init.js';
import { handleMessage } from './Messages.js';
// import mongoose from 'mongoose';
// import config from '../configuration/config.js';

const { Client, LocalAuth } = wp;

// const DB_URI = config.mongodb_uri;

// mongoose
//   .connect(DB_URI)
//   .then(() => {
//     console.log('Conectado a base de datos');
//   })
//   .catch((error) => {
//     console.log(error);
//   });

initialize();

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: './user-data' }),
});

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready');
});

client.on('message', (message) => {
  const response = handleMessage(message);
  if (response) {
    message.reply(`*${response}*`);
  }
});

client.initialize();
