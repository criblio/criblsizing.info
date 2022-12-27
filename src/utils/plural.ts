// Source: https://github.com/30-seconds/30-seconds-of-code/blob/master/snippets/pluralize.md
export const pluralize = (val: number, word: string, plural: string = word + 's') => {
  const _pluralize = (num: number, word: string, plural: string = word + 's') =>
    [1, -1].includes(Number(num)) ? word : plural;
  if (typeof val === 'object')
    return (num: number, word: string) => _pluralize(num, word, val[word]);
  return _pluralize(val, word, plural);
};
