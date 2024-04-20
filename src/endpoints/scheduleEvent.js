import createError from 'http-errors';
import { sendMessageToTelegram } from '../services/sendMessageToTelegram';
import { Scrapper } from '../services/webScrapping';
import commomMiddleware from '../middleware/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

async function scheduleEvent(event, context) {
    const requestPath = event?.path ?? event?.resource ?? event?.dish;

    try {
        if (requestPath.includes('almoco')) {
            const [almocoVix, almocoSM, almocoALGR] = await Promise.all([
                SCRAPPING_SERVICE.fetchUfes('vitoria', 'almoco'),
                SCRAPPING_SERVICE.fetchUfes('sao-mateus', 'almoco'),
                SCRAPPING_SERVICE.fetchUfes('alegre', 'almoco')
            ].filter(Boolean));

            await Promise.all([
                sendMessageToTelegram(almocoVix),
                sendMessageToTelegram(almocoSM),
                sendMessageToTelegram(almocoALGR)
            ]);

            return { message: 'Mensagens de almoço enviadas com sucesso' };
        }

        if (requestPath.includes('jantar')) {
            const [jantarVix, jantarSM, jantarALGR] = await Promise.all([
                SCRAPPING_SERVICE.fetchUfes('vitoria', 'jantar'),
                SCRAPPING_SERVICE.fetchUfes('sao-mateus', 'jantar'),
                SCRAPPING_SERVICE.fetchUfes('alegre', 'jantar')
            ].filter(Boolean));

            await Promise.all([
                sendMessageToTelegram(jantarVix),
                sendMessageToTelegram(jantarSM),
                sendMessageToTelegram(jantarALGR)
            ]);

            return { message: 'Mensagens de jantar enviadas com sucesso' };
        }

        throw new createError.BadRequest({ status: 400, data: 'Parâmetro incorreto, esperado "/almoco" ou "/jantar"' });

    } catch (error) {
        throw new createError.InternalServerError({ status: 500, data: error.message });
    }
}

export const handler = commomMiddleware(scheduleEvent);
