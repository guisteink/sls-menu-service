import createError from 'http-errors';

import {
    sendMessageToTelegram
} from '../services/sendMessageToTelegram';
import {
    Scrapper
} from '../services/webScrapping';
import commomMiddleware from '../helpers/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

async function scheduleEvent(event, context) {
    let flag = event?.path ?? event?.resource ?? event?.dish;

    console.log('Received request:', event);
    if (flag.match('almoco')) {
        console.log('Fetching lunch menus...');
        let almocoVix, almocoSM, almocoALGR;

        try {
            [almocoVix, almocoSM, almocoALGR] = await Promise.all([
                SCRAPPING_SERVICE.fetchUfes('vitoria', 'almoco'),
                SCRAPPING_SERVICE.fetchUfes('sao-mateus', 'almoco'),
                SCRAPPING_SERVICE.fetchUfes('alegre', 'almoco')
            ]);
        } catch (error) {
            console.error('Error fetching lunch menus:', error);
            throw new createError.InternalServerError({
                status: 500,
                data: error
            });
        }

        console.log('Sending lunch menus to Telegram...');
        await Promise.all([
            sendMessageToTelegram(almocoVix),
            sendMessageToTelegram(almocoSM),
            sendMessageToTelegram(almocoALGR)
        ]);

        console.log('Lunch menus sent successfully.');

        return;
    }
    if (flag.match('jantar')) {
        console.log('Fetching dinner menus...');
        let jantarVix, jantarSM, jantarALGR;

        try {
            [jantarVix, jantarSM, jantarALGR] = await Promise.all([
                SCRAPPING_SERVICE.fetchUfes('vitoria', 'jantar'),
                SCRAPPING_SERVICE.fetchUfes('sao-mateus', 'jantar'),
                SCRAPPING_SERVICE.fetchUfes('alegre', 'jantar')
            ]);
        } catch (error) {
            console.error('Error fetching dinner menus:', error);
            throw new createError.InternalServerError({
                status: 500,
                data: error
            });
        }

        console.log('Sending dinner menus to Telegram...');
        await Promise.all([
            sendMessageToTelegram(jantarVix),
            sendMessageToTelegram(jantarSM),
            sendMessageToTelegram(jantarALGR)
        ]);

        console.log('Dinner menus sent successfully.');
    }

    console.error('Wrong parameter:', flag);
    throw new createError.BadRequest({
        status: 400,
        data: 'Wrong parameter, expected "/almoco" or "/jantar'
    });
}

export const handler = commomMiddleware(scheduleEvent);
