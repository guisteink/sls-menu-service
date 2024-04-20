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
            .map((index, element) => {
                const message = $(element).text().trim()
                return this.formatMessage(message)
            })
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

    formatMessage(message) {
        const replacements = {
            'Salada(s)?': '\n[Salada]',
            'Entrada': '\n[Entrada]',
            'Prato Principal': '\n[Prato principal]',
            'Prato Proteico': '\n[Prato Proteico]',
            'Opção': '\n[Opção]',
            'Acompanhamento(s)?': '\n[Acompanhamento]',
            'Guarnição': '\n[Guarnição]',
            'Sobremesa': '\n[Sobremesa]',
            'Cardápio sujeito a alterações|O cardápio poderá sofrer alterações sem comunicação prévia,? ?de acordo com as necessidades do Setor de Nutrição|O cardápio poderá sofrer alterações sem comunicação prévia': '\n\nCardápio sujeito a alterações'
        };

        let formattedMessage = message;
        for (const pattern in replacements) {
            const regex = new RegExp(pattern, 'gi');
            formattedMessage = formattedMessage.replace(regex, replacements[pattern]);
        }

        return formattedMessage;
    }

}
