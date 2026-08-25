import { MemoryRouter } from "react-router";
import "@testing-library/jest-dom/vitest";
import {
    fireEvent,
    render,
    screen,
    // waitFor,
} from "@testing-library/react";
import {
    describe,
    expect,
    test,
    vi,
    beforeEach,
} from "vitest";
import Games from ".";
import type { FirestoreDocument } from "@/shared/models/domain/Firestore";

const navigateMock = vi.fn();

vi.mock("react-router", async (importOriginal) => {
    const actual = await importOriginal<typeof import("react-router")>();
    return {
        ...actual,
        useNavigate: () => navigateMock,
    };
});

vi.mock("@/shared/services/gameService");
vi.mock("@/shared/services/settingsService");

import { gameService } from "@/shared/services/gameService";
import { settingsService } from "@/shared/services/settingsService";

const mockGamesActive: FirestoreDocument[] = [
    {
        name: "projects/test-project/databases/(default)/documents/jogos/game-1",
        fields: {
            name: { stringValue: "The Witcher 3" },
            isActive: { booleanValue: true },
            cleaning_date: { stringValue: "2024-08-20" },
            cleaning_method: { integerValue: "0" },
            photoUrl: { stringValue: "" },
        },
    },
    {
        name: "projects/test-project/databases/(default)/documents/jogos/game-2",
        fields: {
            name: { stringValue: "Elden Ring" },
            isActive: { booleanValue: true },
            cleaning_date: { stringValue: "2024-08-15" },
            cleaning_method: { integerValue: "1" },
            photoUrl: { stringValue: "" },
        },
    },
];

// const mockGamesAll: FirestoreDocument[] = [
//     ...mockGamesActive,
//     {
//         name: "projects/test-project/databases/(default)/documents/jogos/game-3",
//         fields: {
//             name: { stringValue: "Cyberpunk 2077" },
//             isActive: { booleanValue: false },
//             cleaning_date: { stringValue: "2024-07-10" },
//             cleaning_method: { integerValue: "2" },
//             photoUrl: { stringValue: "" },
//         },
//     },
// ];

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(gameService.fetchGames).mockResolvedValue(mockGamesActive);
    vi.mocked(settingsService.fetchSettings).mockResolvedValue(30);
});

describe("Testa a página Games", () => {
    test('Deve renderizar o título "BG Limpo 2.0"', async () => {
        render(<MemoryRouter><Games /></MemoryRouter>);

        expect(
            screen.getByText("BG Limpo 2.0")
        ).toBeInTheDocument();
    });

    test("Deve ir para a tela de Configurações ao pressionar o botão Configurações", async () => {
        render(<MemoryRouter><Games /></MemoryRouter>);
        expect(
            screen.getAllByText("BG Limpo 2.0")[0]
        ).toBeInTheDocument();
        const buttons = screen.getAllByTestId("tl-configButton");
        fireEvent.click(buttons[0]);
        expect(navigateMock).toHaveBeenCalledWith("/settings");
    });

    // test('Deve exibir os cards ativados/desativados de acordo com o estado do switch "Exibir Somente Ativos"', async () => {
    //     vi.mocked(gameService.fetchGames).mockImplementation((filter?: boolean) => {
    //         return Promise.resolve(filter ? mockGamesActive : mockGamesAll);
    //     });

    //     render(<MemoryRouter><Games /></MemoryRouter>);

    //     await waitFor(() => {
    //         expect(screen.getAllByTestId("The Witcher 3")[0]).toBeInTheDocument();
    //     });

    //     expect(screen.queryByText("Cyberpunk 2077")).not.toBeInTheDocument();

    //     const switches = screen.getAllByRole("switch");
    //     const switchElement = switches.find(sw => sw.getAttribute("aria-label") === "Exibir Somente Ativos");

    //     expect(switchElement).toBeDefined();
    //     expect(switchElement).toBeChecked();

    //     fireEvent.click(switchElement!);

    //     await waitFor(() => {
    //         expect(screen.getByText("Cyberpunk 2077")).toBeInTheDocument();
    //     }, { timeout: 5000 });

    //     expect(switchElement).not.toBeChecked();
    // });
});
