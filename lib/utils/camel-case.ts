
const wordSeparators = ['-', '_'];
const splitRegex = new RegExp(wordSeparators.join('|'));

export const camelCase = (text: string) => {
    return text
        .split(splitRegex)
        .filter(token => token != '')
        .map((token, i) => i == 0 ? token.toLowerCase() : token.charAt(0).toUpperCase() + token.slice(1) )
        .join('');

}