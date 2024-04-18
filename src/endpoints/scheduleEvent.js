import createError from 'http-errors';

import { sendMessageToTelegram } from '../services/sendMessageToTelegram';
import { Scrapper } from '../services/webScrapping';
import commomMiddleware from '../helpers/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

async function scheduleEvent(event, context) {
    const flag = event?.path ?? event?.resource ?? event?.dish;

    if (flag.match('almoco')) {
        const [almocoVix, almocoSM, almocoALGR] = await Promise.all([
            SCRAPPING_SERVICE.fetchUfes('vitoria', 'almoco'),
            SCRAPPING_SERVICE.fetchUfes('sao-mateus', 'almoco'),
            SCRAPPING_SERVICE.fetchUfes('alegre', 'almoco')
        ]);

        return await Promise.all([
            sendMessageToTelegram(almocoVix),
            sendMessageToTelegram(almocoSM),
            sendMessageToTelegram(almocoALGR)
        ]);
    }

    if (flag.match('jantar')) {
        const [jantarVix, jantarSM, jantarALGR] = await Promise.all([
            SCRAPPING_SERVICE.fetchUfes('vitoria', 'jantar'),
            SCRAPPING_SERVICE.fetchUfes('sao-mateus', 'jantar'),
            SCRAPPING_SERVICE.fetchUfes('alegre', 'jantar')
        ]);

        return await Promise.all([
            sendMessageToTelegram(jantarVix),
            sendMessageToTelegram(jantarSM),
            sendMessageToTelegram(jantarALGR)
        ]);
    }

    throw new createError.BadRequest({ status: 400, data: 'Wrong parameter, expected "/almoco" or "/jantar' });
}

export const handler = commomMiddleware(scheduleEvent);
