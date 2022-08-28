import { Scrapper } from '../services/webScrapping';
import commomMiddleware from '../helpers/commomMiddleware';
import createError from 'http-errors';

async function getMenuOfTheDay(event, context) {
  let menuOfTheDay;
  const scrappingService = new Scrapper();

  const { campus, refeicao } = event.queryStringParameters ?? '';

  if(!campus) throw new createError
    .BadRequest({ status: 400 ,data: 'Campus is a required parameter' });

  if(!refeicao) throw new createError
    .BadRequest({ status: 400, data: 'Refeicao is a required parameter' });

  try {
    menuOfTheDay = await scrappingService.fetchUfes(campus, refeicao);
  } catch (error) {
    throw new createError
      .InternalServerError({ status: 500, data: error });
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ status: 200, data: menuOfTheDay }),
  };
}

export const handler = commomMiddleware(getMenuOfTheDay);
