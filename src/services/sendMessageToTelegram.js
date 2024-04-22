import fetch from 'node-fetch';

const BASE_URL = `https://api.telegram.org/bot${process.env.TOKEN_BOT}`;

export async function sendMessageToTelegram(message) {
    if (!message || message.trim() === '') {
        console.error('Empty message');
        return;
    }

    const url = `${BASE_URL}/sendMessage`;

    try {
        console.info(`Sending message to telegram: ${message, process.env.GROUP}`);

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: process.env.GROUP,
                text: message
            })
        });

    } catch (error) {
        console.error(`Error while sending message: ${error}`);

        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        }

        if (error.request) {
            console.log(error.request);
        }

        console.log('Error', error.message);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'failed to send message to telegram group',
                ok: false
            })
        }
    }
}
