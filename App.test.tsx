import '@testing-library/jest-dom/vitest';
// import { screen, render } from '@testing-library/react';
// import { describe, expect, test, it } from 'vitest' ;

// um teste para ver se funfou
describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });
  it('false to be false', () => {
    expect(false).toBe(false);
  });
});