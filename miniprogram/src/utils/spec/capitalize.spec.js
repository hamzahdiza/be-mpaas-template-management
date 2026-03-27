import { capitalizeTxt } from "../capitalize";

describe('capitalizeTxt', () => {
  it('should capitalize the first letter of each word', () => {
    expect(capitalizeTxt('hello world')).toBe('Hello World');
    expect(capitalizeTxt('javaScript is awesome')).toBe('Javascript Is Awesome');
    expect(capitalizeTxt('UNIT TESTING')).toBe('Unit Testing');
    expect(capitalizeTxt('a b c')).toBe('A B C');
  });

  it('should handle empty strings', () => {
    expect(capitalizeTxt('')).toBe('');
  });

  it('should handle single words', () => {
    expect(capitalizeTxt('hello')).toBe('Hello');
    expect(capitalizeTxt('WORLD')).toBe('World');
  });

  it('should handle multiple spaces between words', () => {
    expect(capitalizeTxt('hello    world')).toBe('Hello    World');
  });

  it('should not alter non-alphabetic characters', () => {
    expect(capitalizeTxt('123 hello world!')).toBe('123 Hello World!');
    expect(capitalizeTxt('hello-world')).toBe('Hello-world');
  });
});