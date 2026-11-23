import { describe, expect, it } from 'vitest';
import { CHARACTERS, buildSystemPrompt, getCharacter } from '../../src/lib/characters.js';

describe('characters', () => {
  it('have unique ids and complete profiles', () => {
    expect(new Set(CHARACTERS.map((c) => c.id)).size).toBe(CHARACTERS.length);
    for (const c of CHARACTERS) {
      for (const key of ['name', 'short', 'codename', 'avatar', 'bio', 'style', 'spoilers']) {
        expect(c[key], `${c.id}.${key}`).toBeTruthy();
      }
    }
  });

  it('builds a role play prompt with the guardrails', () => {
    const prompt = buildSystemPrompt(getCharacter('ryuji'), 'Kai');
    expect(prompt).toContain('Ryuji Sakamoto');
    expect(prompt).toContain('Skull');
    expect(prompt).toContain('texting with Kai');
    expect(prompt).toMatch(/non-romantic/);
    expect(prompt).toMatch(/AI, say yes/);
    expect(prompt).toMatch(/only discuss if the user brings them up/);
  });
});
