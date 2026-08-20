import '@testing-library/jest-dom/vitest';
import { screen, render } from '@testing-library/react';
import { expect, test } from 'vitest' ;
import Button from './components/Inputs/Button';

/*// um teste para ver se funfou
describe('something truthy and falsy', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });
  it('false to be false', () => {
    expect(false).toBe(false);
  });
});*/

test('Deveria renderizar um botão com rótulo "Entrar"', () => {

    render(<Button>Entrar</Button>);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent("Entrar");

    // const { getByText } = render(<button>Entrar</button>);
    // expect(getByText("Entrar")).toBeInTheDocument();
});