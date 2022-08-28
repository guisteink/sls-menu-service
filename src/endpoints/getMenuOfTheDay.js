import createError from 'http-errors';

import { Scrapper } from '../services/webScrapping';
import commomMiddleware from '../helpers/commomMiddleware';

const SCRAPPING_SERVICE = new Scrapper();

async function getMenuOfTheDay(event, context) {
  let menuOfTheDay;

  const { campus, refeicao } = event.queryStringParameters ?? '';

  if(!campus) throw new createError
    .BadRequest({ status: 400 ,data: 'Campus is a required parameter' });

  if(!refeicao) throw new createError
    .BadRequest({ status: 400, data: 'Refeicao is a required parameter' });

  try {
    menuOfTheDay = await SCRAPPING_SERVICE.fetchUfes(campus, refeicao);
  } catch (error) {
    // throw new createError
    return new createError
      .InternalServerError({ status: 500, data: error });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 200, data: menuOfTheDay }),
  };
}

export const handler = commomMiddleware(getMenuOfTheDay);
