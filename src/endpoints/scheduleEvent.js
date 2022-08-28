import createError from 'http-errors';

import { sendMessageToTelegram } from '../services/sendMessageToTelegram';
import { Scrapper } from '../services/webScrapping';
import commomMiddleware from '../helpers/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

async function scheduleEvent(event, context) {
    let flag = event?.path ?? event?.resource ?? event?.dish;

    if(flag.match('almoco')){
        let almocoVix, almocoSM, almocoALGR;

        Promise.all[
            almocoVix = await SCRAPPING_SERVICE.fetchUfes(`vitoria`, `almoco`),
            almocoSM = await SCRAPPING_SERVICE.fetchUfes(`sao-mateus`, `almoco`),
            almocoALGR = await SCRAPPING_SERVICE.fetchUfes(`alegre`, `almoco`)
        ]

        return Promise.all[
            await sendMessageToTelegram(almocoVix),
            await sendMessageToTelegram(almocoSM),
            await sendMessageToTelegram(almocoALGR)
        ]
    }

    if(flag.match('jantar')){
        let jantarVix, jantarSM, jantarALGR;

        Promise.all[
            almocoVix = await SCRAPPING_SERVICE.fetchUfes(`vitoria`, `almoco`),
            almocoSM = await SCRAPPING_SERVICE.fetchUfes(`sao-mateus`, `almoco`),
            almocoALGR = await SCRAPPING_SERVICE.fetchUfes(`alegre`, `almoco`)
        ]

        return Promise.all[
            await sendMessageToTelegram(jantarVix),
            await sendMessageToTelegram(jantarSM),
            await sendMessageToTelegram(jantarALGR)
        ]
    }

    return new createError
        .BadRequest({ status: 400, data: 'Wrong parameter, expected "/almoco" or "/jantar' });
}

export const handler = commomMiddleware(scheduleEvent);
