export function capitalizeTxt(name) {
  name = String(name);

  let word = name.toLowerCase().split(' ');
  let result = [];
  for (let i = 0; i < word.length; i++) {
    result.push(word[i].charAt(0).toUpperCase() + word[i].slice(1));
  }
  return result.join(' ');
}