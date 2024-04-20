import axios from 'axios';
import cheerio from 'cheerio';
import https from 'https';
import moment from 'moment';

export class Scrapper {
    constructor() {
        this.axios = axios;
        this.cheerio = cheerio;
        this.https = https;
        this.moment = moment;
        this.urls = {
            vitoria: "https://ru.ufes.br/cardapio",
            'sao-mateus': "https://restaurante.saomateus.ufes.br/cardapio",
            alegre: "https://restaurante.alegre.ufes.br/cardapio"
        };
    }

    async fetchUfes(restaurant, opt) {
        const today = this.moment().subtract(3, 'days').toDate();
        const baseUrl = this.urls[restaurant];
        const url = `${baseUrl}/${this.moment(today).format("YYYY-MM-DD")}`;
        console.log(`Fetching URL: ${url}`);

        const result = await this.axios(url, {
            method: 'GET',
            httpsAgent: new this.https.Agent({
                rejectUnauthorized: false
            })
        });

        const $ = cheerio.load(result.data, null, false);
        const cardapio = [];

        $('.view-content').children('div').slice(0, 1).each((index, element) => {
            const item = $(element).text().trim();
            cardapio.push(item);
        });

        const lunch = this.isValidMessage('almoco', cardapio[0]);
        const dinner = this.isValidMessage('jantar', cardapio[1]);

        return opt === "almoco" ? lunch : dinner;
    }


    isValidMessage(opt, dish) {
        console.log(`Validating message for ${opt} [${dish}]`);

        const lunchRegex = /Almo[çc]o|ALMO[ÇC]O|ALMOCO/;
        const dinnerRegex = /Jantar|JANTAR/;

        const regex = opt === "almoco" ? lunchRegex : dinnerRegex;
        const isValid = regex.test(dish);

        console.log(`Message validation result for ${opt}: ${isValid ? 'valid' : 'invalid'}`);
        return isValid ? dish : false;
    }
}
