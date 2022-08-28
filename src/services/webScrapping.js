const axios = require("axios");
const { isValidMessage } = require('../helpers/isValidMessage');
const cheerio = require("cheerio");
const pretty = require("pretty");
const moment = require("moment");

export class Scrapper
{
    constructor()
    {
        this.axios = axios;
        this.cheerio = cheerio;
        this.pretty = pretty;
        this.vixUrl = "https://ru.ufes.br/cardapio";
        this.smUrl = "https://restaurante.saomateus.ufes.br/cardapio";
        this.alegreUrl = "https://restaurante.alegre.ufes.br/cardapio";
        this.weekdays = ["Sunday", "Monday", "Tuesday", "Weednesday", "Thursday", "Friday", "Saturday"];
    }

    async fetchUfes(restaurant, opt)
    {
        const today = new Date();
        let baseUrl;

        if (restaurant === "vitoria") baseUrl = this.vixUrl;
        if (restaurant === "sao-mateus") baseUrl = this.smUrl;
        if (restaurant === "alegre") baseUrl = this.alegreUrl;

        if (this.weekdays[today.getDay()] !== ("Sunday" || "Saturday")) {
        // if (true) {
            console.log("fetching -> " + baseUrl + `/${moment(today).format("YYYY-MM-DD")}` + "...");

            // const result = await axios(baseUrl + `/${moment(today).format("YYYY-MM-DD")}`, { method: 'GET' });
            const result = await axios(baseUrl + `/2022-08-26`, { method: 'GET' }); //! att to dynamic above
            const $ = cheerio.load(result.data, null, false);
            const data = $('.view-content').children("div");
            // const data = $('.field-content').text() ! this works too

            // const dinner = $(data[1]).text();
            // const lunch = $(data[0]).text();

            const lunch = isValidMessage('almoco', $(data[0]).text()) ? $(data[0]).text() : null;
            // const lunch = isValidMessage('almoco', $(data[0]).text()) ? $(data[0]).text() : `Error with scrapping`;
            const dinner = isValidMessage('jantar', $(data[1]).text()) ? $(data[1]).text() : null;
            // const dinner = isValidMessage('jantar', $(data[1]).text()) ? $(data[1]).text() : `Error with scrapping`;

            // console.log(`lunch: ${$(data[0]).text()}`);
            // console.log(`dinner: ${$(data[1]).text()}`);

            if(opt === "todas") return [{almoco: lunch}, {jantar: dinner}];
            else return opt === "almoco" ? lunch : dinner;
        }

        return "Weekend man, relax!";
    }
}
