import createError from 'http-errors';

import { Scrapper } from '../services/webScrapping';
import commomMiddleware from '../helpers/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

async function getMenuOfTheDay(event, context) {
  let menuOfTheDay;
  const { campus, refeicao } = event.queryStringParameters ?? '';
  console.log('Received request:', event);

  if(!campus) {
    console.error('Missing required parameter: campus');
    throw new createError
      .BadRequest({ status: 400 ,data: 'Campus is a required parameter' });
  }

  if(!refeicao) {
    console.error('Missing required parameter: refeicao');
    throw new createError
      .BadRequest({ status: 400, data: 'Refeicao is a required parameter' });
  }

  try {
    console.log('Fetching menu for campus:', campus, 'and meal:', refeicao);
    menuOfTheDay = await SCRAPPING_SERVICE.fetchUfes(campus, refeicao);
    console.log('Menu fetched successfully:', menuOfTheDay);
  } catch (error) {
    console.error('Error occurred while fetching menu:', error);
    throw new createError
      .InternalServerError({ status: 500, data: error });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 200, data: menuOfTheDay }),
  };
}

export const handler = commomMiddleware(getMenuOfTheDay);
