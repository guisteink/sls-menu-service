import createError from 'http-errors';
import { Scrapper } from '../services/webScrapping';
import commomMiddleware from '../middleware/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

const HTTP_STATUS_BAD_REQUEST = 400;
const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

async function getMenuOfTheDay(event, context) {
  const { campus, refeicao } = event.queryStringParameters || {};
  console.log('Received request:', event);

  if (!campus || !refeicao) {
    const missingParameter = !campus ? 'campus' : 'refeicao';
    const errorMessage = `${missingParameter} is a required parameter`;
    console.error(`Missing required parameter: ${missingParameter}`);
    throw new createError.BadRequest({ status: HTTP_STATUS_BAD_REQUEST, data: errorMessage });
  }

  try {
    console.log('Fetching menu for campus:', campus, 'and meal:', refeicao);
    const menuOfTheDay = await SCRAPPING_SERVICE.fetchUfes(campus, refeicao);
    console.log('Menu fetched successfully:', menuOfTheDay);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 200, data: menuOfTheDay }),
    };
  } catch (error) {
    console.error('Error occurred while fetching menu:', error);
    throw new createError.InternalServerError({ status: HTTP_STATUS_INTERNAL_SERVER_ERROR, data: error.message });
  }
}

export const handler = commomMiddleware(getMenuOfTheDay);
