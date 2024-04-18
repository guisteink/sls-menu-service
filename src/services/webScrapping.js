const axios = require("axios");
const { isValidMessage } = require('../helpers/isValidMessage');
const cheerio = require("cheerio");
const moment = require("moment");

export class Scrapper {
    constructor() {
        this.vixUrl = "https://ru.ufes.br/cardapio";
        this.smUrl = "https://restaurante.saomateus.ufes.br/cardapio";
        this.alegreUrl = "https://restaurante.alegre.ufes.br/cardapio";
        this.weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    }

    async fetchUfes(restaurant, opt) {
        const today = new Date();
        let baseUrl;

        switch (restaurant) {
            case "vitoria":
                baseUrl = this.vixUrl;
                break;
            case "sao-mateus":
                baseUrl = this.smUrl;
                break;
            case "alegre":
                baseUrl = this.alegreUrl;
                break;
            default:
                throw new Error("Invalid restaurant");
        }

        if (!["Sunday", "Saturday"].includes(this.weekdays[today.getDay()])) {
            const url = `${baseUrl}/${moment(today).format("YYYY-MM-DD")}`;
            console.log("fetching -> " + url + "...");

            try {
                const result = await axios.get(url);
                const $ = cheerio.load(result.data);
                const data = $('.view-content').children("div");

                const lunch = isValidMessage('almoco', $(data[0]).text()) ? $(data[0]).text() : null;
                const dinner = isValidMessage('jantar', $(data[1]).text()) ? $(data[1]).text() : null;

                return opt === "todas" ? [{ almoco: lunch }, { jantar: dinner }] : opt === "almoco" ? lunch : dinner;
            } catch (error) {
                console.error("Error fetching data:", error);
                throw new Error("Error fetching data");
            }
        }

        return "Weekend man, relax!";
    }
}
