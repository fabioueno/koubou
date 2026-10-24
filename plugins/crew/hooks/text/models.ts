function capitalized(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * `claude-opus-5-5` reads `Opus 5.5`; an alias such as `haiku` reads `Haiku`.
 */
export function modelName(id: string): string {
  const match = /(opus|sonnet|haiku|fable)-(\d+)-(\d+)/i.exec(id);
  if (!match) {
    return id.charAt(0).toUpperCase() + id.slice(1);
  }

  return `${capitalized(match[1] ?? "")} ${match[2]}.${match[3]}`;
}
