import { CleaningMethodEnum } from "../enums/CleaningMethodEnum";

export interface Game { // TODO: refatorar para deixar todas as props nullable, menos id
    id?: string;
    name?: string;
    cleaning_date: string;
    cleaning_method?: number;
    cleaning_methods?: CleaningMethodEnum[] | null;
    isActive: boolean;
    photoUrl?: string;
}

export interface InitialStateGames {
    games: Game[];
    status: string;
    limitInDays: number | null;
    today: string;
    showOnlyActiveGamesFilter: boolean;
}

export interface ISettings {
    cleaning_frequency?: number;
}