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
        this.divsByUrl = { // how divs to scrapp in each website section
            vitoria: 2,
            'sao-mateus': 3,
            alegre: 3
        };
    }

    async fetchUfes(restaurant, opt) {
        const today = this.moment().subtract(1, 'days').toDate();
        const baseUrl = this.urls[restaurant];
        const url = `${baseUrl}/${this.moment(today).format("YYYY-MM-DD")}`;

        const res = await this.axios(url, {
            method: 'GET',
            httpsAgent: new this.https.Agent({
                rejectUnauthorized: false
            })
        });

        const $ = cheerio.load(res.data);
        const menuItems = $('.view-content').children('div')
            .slice(0, this.divsByUrl[restaurant])
            .map((index, element) => $(element).text().trim())
            .get()
            .filter(dish => this.isValidMessage(opt, dish));

        return menuItems.join('\n ');
    }

    isValidMessage(opt, dish) {
        const lunchRegex = /Almo[çc]o|ALMO[ÇC]O|ALMOCO/;
        const dinnerRegex = /Jantar|JANTAR/;
        const regex = opt === "almoco" ? lunchRegex : dinnerRegex;
        return regex.test(dish);
    }
}
