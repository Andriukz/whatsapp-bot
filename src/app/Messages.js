import utils from './Utils.js';
import TRIGGER_MESSAGES from '../configuration/messages.json' assert { type: 'json' };
import wp from 'whatsapp-web.js';
import fs from 'fs';

const { MessageMedia } = wp;

export const handleMessage = (message) => {
  if (typeof message.body !== 'string') return null;
  let reply = null;
  TRIGGER_MESSAGES.forEach((triggerMessage) => {
    let triggerCondition = false;
    switch (triggerMessage.options?.readingType) {
      case 0:
      default:
        triggerCondition = message.body === `!${triggerMessage.trigger}`;
        break;
      case 1:
        triggerCondition = message.body.startsWith(
          `!${triggerMessage.trigger}`
        );
        break;
      case 2:
        triggerCondition = message.body.includes(`!${triggerMessage.trigger}`);
        break;
    }
    if (triggerCondition) reply = handleTriggerMessage(triggerMessage, message);
  });
  if (reply != null) return reply;
  reply = handleRollDice(message);
  if (reply == null && message.body.startsWith('!')) {
    reply = '❌ Comando no válido ❌';
  }
  return reply;
};

const handleTriggerMessage = (triggerMessage, message) => {
  if (!triggerMessage.options) return `🤖: ${triggerMessage.message}`;
  if (triggerMessage.options.noRobot) return triggerMessage.message;
  if (triggerMessage.options.isRandom)
    return utils.getRandomElement(triggerMessage.message);
  if (triggerMessage.options.date) {
    return triggerMessage.message.replace(
      '$$',
      utils.daysFromDateToToday(new Date(triggerMessage.options.date))
    );
  }
  if (triggerMessage.options.audio) {
    return handleAudioAsVoice(message, triggerMessage);
  }
};

const handleRollDice = (message) => {
  // guard clause
  if (!message.body.startsWith('!d')) return null;
  // skips "!d" part of the message and casts it to Number
  const rollNumber = Number(message.body.slice(2));
  // only numbers greater than 0 are allowed
  if (isNaN(rollNumber) || rollNumber < 1) return null;
  return `🎲: ${utils.getRandom(1, rollNumber)}`;
};

const handleAudioAsVoice = (message, triggerMessage) => {
  try {
    let mimeType = 'audio/ogg; codecs=opus';
    let base64 = fs.readFileSync(triggerMessage.message).toString('base64');
    const media = new MessageMedia(mimeType, base64, 'sapo.ogg');
    message.reply(media);
  } catch (error) {
    console.log(error);
  }
  return false;
};
