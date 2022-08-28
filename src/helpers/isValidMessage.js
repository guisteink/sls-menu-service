export function isValidMessage(opt, dish){
    if(opt != ("almoco" || "jantar")) return false;
    let isValidMessage;

    if(opt == "almoco") isValidMessage = dish.match("Almoço" || "ALMOÇO" || "ALMOCO" || "Almoco");
    if(opt == "jantar") isValidMessage= dish.match("Jantar" || "JANTAR");

    return isValidMessage != null ? true : false;
}
