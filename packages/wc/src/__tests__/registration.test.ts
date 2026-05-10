import { describe, it, expect, beforeAll } from 'vitest';
import manifest from '../manifest.json';

// Importing the bundle has the side effect of calling customElements.define
// for every uni-* tag in the manifest. We import the freshly built bundle
// (dist/index.js) so the test mirrors what real consumers run.
beforeAll(async () => {
  await import('../../dist/index.js');
});

describe('@dash-ui/wc registration', () => {
  it('registers every tag in the manifest', () => {
    for (const { tag } of manifest as { name: string; tag: string }[]) {
      expect(customElements.get(tag), `${tag} should be registered`).toBeDefined();
    }
  });

  it('every registered element can be instantiated and connected', () => {
    for (const { tag } of manifest as { name: string; tag: string }[]) {
      const el = document.createElement(tag);
      document.body.appendChild(el);
      expect(el.tagName.toLowerCase()).toBe(tag);
      el.remove();
    }
  });
});
