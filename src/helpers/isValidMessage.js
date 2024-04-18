export function isValidMessage(opt, dish) {
    if (opt !== ('almoco' || 'jantar')) return false;

    if (opt === 'almoco') {
        return dish.match(/Almoço|ALMOÇO|ALMOCO|Almoco|almoço|almoco/) !== null;
    } else if (opt === 'jantar') {
        return dish.match(/Jantar|JANTAR|jantar/) !== null;
    }

    return false;
}
