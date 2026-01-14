import { useMemo } from "react";
import { MdCleaningServices } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import {
    getDateByMonthsIncrement,
    getDiffMonths,
    getTimeSinceLastCleaning
} from "../../../shared/helpers/dates";
import type { Game } from "../../../shared/models/Games";
import { Container } from "./styles";

interface ICard {
    game: Game;
    activeEdition: boolean;
    limitInMonths: number;
    setGameEditing: (game: Game) => void;
    toggleModalCleaning: () => void;
    toggleModal: () => void;
}

const Card: React.FC<ICard> = ({
    game,
    activeEdition,
    limitInMonths,
    setGameEditing,
    toggleModalCleaning,
    toggleModal,
}) => {
    
    const today: string = new Date().toISOString().split("T")[0];

    const isLimitExpired = (startDate: string): boolean => {
        const diff = getDiffMonths(startDate, today);
        return diff >= limitInMonths;
    }

    const getCleaningExpirationPercentage = (startDate: string): number => {
        const diff = getDiffMonths(startDate, today);
        if (diff >= limitInMonths) return 100;
        if (diff <= 0) return 0;
        return (100 * diff) / limitInMonths;
    }

    const randomImage = useMemo(() => {
        // const seed = new Date().getMilliseconds();
        return `https://picsum.photos/100`;
        // return `https://picsum.photos/seed/{${seed}}/picsum/100`;
    }, []);

    const handleCleaningClick = (game: Game) => {
        setGameEditing(game);
        toggleModalCleaning();
    }

    const handleEditClick = (game: Game) => {
        setGameEditing(game);
        toggleModal();
    }

    return (
        <Container
            // className={isLimitExpired(game.cleaning_date) ? "pending-maintenance" : ""}
            percentage={getCleaningExpirationPercentage(game.cleaning_date)}
            $active={game?.isActive}
        >
            <span>
                <img
                    src={game?.photoUrl || randomImage}
                    alt={game?.name || "Imagem do jogo"}
                />
            </span>
            <span>
                <h3>
                    {`${game?.name || "N/A"}${!game?.isActive ? " (Desativado)" : ""}`}
                </h3>
                <div>
                    <p>{ getTimeSinceLastCleaning(game.cleaning_date, today) }</p>
                </div>
                <div>
                    <small>
                        {`Última limpeza: ${game?.cleaning_date
                            ? new Date(game.cleaning_date).toLocaleDateString(
                                'pt-BR',
                                {timeZone:"UTC",dateStyle:'short'}
                            )
                            : "N/A"
                        }`}
                    </small>
                    {!isLimitExpired(game.cleaning_date) && (
                        <small>{`Próxima limpeza: ${
                                new Date(getDateByMonthsIncrement(game.cleaning_date, limitInMonths)).toLocaleDateString(
                                    'pt-BR',
                                    {timeZone:"UTC",dateStyle:'short'}
                                )}`
                            }
                        </small>
                    )}
                </div>
            </span>
            <span>
                {isLimitExpired(game.cleaning_date) && (
                    <button
                        type="button"
                        onClick={() => handleCleaningClick(game)}
                        title="Atualizar Limpeza"
                    >
                        <MdCleaningServices />
                    </button>
                )}
                {activeEdition && (
                    <button
                        type="button"
                        onClick={() => handleEditClick(game)}
                        title="Atualizar Limpeza"
                    >
                        <FaPen />
                    </button>
                )}
            </span>
        </Container>
    )
}

export default Card;