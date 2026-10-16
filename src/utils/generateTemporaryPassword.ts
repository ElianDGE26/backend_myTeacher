import { randomInt } from 'node:crypto';

export const generateTemporaryPassword = (length = 20): string => {
    if (!Number.isInteger(length) || length <= 16) {
        throw new Error("Invalid length, the length minimum is 16 characters and the maximum is 20");
    }

    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+";

    const allChars = uppercase + lowercase + numbers + symbols;

    // Garantizamos que al menos un carácter 
    const chars = [
        uppercase[randomInt(uppercase.length)],
        lowercase[randomInt(lowercase.length)],
        numbers[randomInt(numbers.length)],
        symbols[randomInt(symbols.length)]
    ];

    //Completamos la contraseña hasta alcanzar la longitud deseada
    while (chars.length< length){
        chars.push(allChars[randomInt(allChars.length)]);
    }

    //Mezclamos los caracteres aleatoriamente
    for (let i = chars.length - 1; i > 0; i--){
        const j = randomInt(i+1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join("");
}