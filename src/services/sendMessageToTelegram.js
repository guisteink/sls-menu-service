import fetch from 'node-fetch';
import createError from 'http-errors';

const TOKEN_BOT = '5147515221:AAF55YP8oKk2v6bOWAIDOb2nUJEKMOmQeys';
const BASE_URL = `https://api.telegram.org/bot${TOKEN_BOT}`;
const GROUP = -4171092603;

export async function sendMessageToTelegram(message) {
    const url = `${BASE_URL}/sendMessage`;
    console.log(`Sending message to Telegram -> ${url}, message: ${message}`);

    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({ chat_id: GROUP, text: message }),
            headers: { "Content-Type": "application/json" }
        });

        return response;
    } catch (error) {
        console.error(`Error while sending message: ${error}`);

        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        return new createError.InternalServerError({ status: 500, data: error });
    }
}
