import {
    sendMessageToTelegram
} from '../services/sendMessageToTelegram';
import {
    Scrapper
} from '../services/webScrapping';
import commomMiddleware from '../middleware/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

async function getMenuMessage(mealType) {
    const [vixMenu, smMenu, algMenu] = await Promise.all([
        SCRAPPING_SERVICE.fetchUfes('vitoria', mealType),
        SCRAPPING_SERVICE.fetchUfes('sao-mateus', mealType),
        SCRAPPING_SERVICE.fetchUfes('alegre', mealType)
    ]);

    const messages = [vixMenu, smMenu, algMenu].filter(Boolean);

    await Promise.all(messages.map(message => sendMessageToTelegram(message)));
}

async function scheduleEvent(event, context) {
    const requestPath = event?.path ?? event?.resource ?? event?.dish;

    try {
        if (requestPath.includes('almoco')) {
            await getMenuMessage('almoco');
            return {
                statusCode: 200,
                body: JSON.stringify({
                    ok: true
                })
            }
        }

        if (requestPath.includes('jantar')) {
            await getMenuMessage('jantar');
            return {
                statusCode: 200,
                body: JSON.stringify({
                    ok: true
                })
            }
        }

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Parâmetro incorreto, esperado "/almoco" ou "/jantar"',
                ok: false
            })
        }
    } catch (error) {
        console.log(`Error on scheduleEvent [${error?.message}: ${error?.stack}]`);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'error on scheduleEvent',
                ok: false
            })
        }
    }
}

export const handler = commomMiddleware(scheduleEvent);
