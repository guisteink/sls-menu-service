import fetch from 'node-fetch';
import createError from 'http-errors';

//TODO: set environment variables
const TOKEN_BOT = '5147515221:AAF55YP8oKk2v6bOWAIDOb2nUJEKMOmQeys';
const BASE_URL = `https://api.telegram.org/bot${TOKEN_BOT}`;
const GROUP_TEST = -633524025;

export async function sendMessageToTelegram(message) {
    console.log(`FETCHING TELEGRAM -> ${BASE_URL + "/sendMessage"}`);
    try {
        return await fetch(BASE_URL + "/sendMessage", {
            method: "POST",
            body: JSON.stringify({ chat_id: GROUP_TEST, text: message }),
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error('Error:', error.message);
        return new createError.InternalServerError({ status: 500, data: error });
    }
}
