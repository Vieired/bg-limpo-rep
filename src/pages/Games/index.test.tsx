import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom/vitest";
import {
    fireEvent,
    render,
    screen,
} from "@testing-library/react";
import {
    describe,
    expect,
    test,
    vi,
} from "vitest";
import Games from ".";

const navigateMock = vi.fn();

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();

    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

describe("Testa a página Games", () => {

    test('Deve renderizar o título "BG Limpo"', () => {

        render(
            <MemoryRouter>
                <Games />
            </MemoryRouter>
        );

        expect(
            screen.getByText("BG Limpo 2.0")
        ).toBeInTheDocument();
    });

    test("Deve ir para a tela de Configurações ao pressionar o botão Configurações", () => {

        render(
            <MemoryRouter>
                <Games />
            </MemoryRouter>
        );

        const buttons = screen.getAllByTestId("tl-configButton");

        fireEvent.click(buttons[0]);

        expect(navigateMock).toHaveBeenCalledWith("/settings");
    });
});