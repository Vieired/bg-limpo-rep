import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
// import { toast } from "react-toastify";
import { FaPlus, FaPen, FaPowerOff, FaCog } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import Switch from "react-switch";
import type { Game } from "../../shared/models/Games.ts";
import Button from "../../components/Inputs/Button/index";
import ModalAddOrEdit from "./ModalAddOrEdit/index";
import ModalCleaning from "./ModalCleaning/index.tsx";
import Card from "./Card/index.tsx";
import type { FirestoreDocument } from "../../shared/models/domain/Firestore.ts";
// import { setUser } from "../../store/usersSlice.ts";
// import { firebaseConfig } from "../../shared/firebase/config";
import { firestoreDocToJson } from "../../shared/helpers/firestoreToJS.ts";
import { gameService } from "../../shared/services/gameService.ts";
import { settingsService } from "../../shared/services/settingsService.ts";
import { Container, Content, Loading, Toolbar } from "./styles";
import { useAuth } from "../../contexts/authContext.tsx";
import { firebaseConfig } from "../../shared/firebase/config.ts";

const Games: React.FC = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();
    
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [modalCleaningOpen, setModalCleaningOpen] = useState<boolean>(false);
    const [ gameEditing, setGameEditing ] = useState<Game|null>(null);
    const [ activeEdition, setActiveEdition ] = useState<boolean>(false);
    const [ games, setGames ] = useState<FirestoreDocument[]|null>(null);
    const [ cleaningFrequency, setCleaningFrequency ] = useState<number|null>(null);
    const [ isCleaningFrequencyLoading, setIsCleaningFrequencyLoading ] = useState<boolean>(true);
    const [ showOnlyActiveGamesFilterToggle, setShowOnlyActiveGamesFilterToggle ] = useState<boolean>(true);
    const [ gamesLoading, setGamesLoading ] = useState<boolean>(true);

    const daysInApproximatelyMonths = useMemo((): string => {
        if (!cleaningFrequency) return "...";

        if (cleaningFrequency <= 44) return "";

        const daysInApproximatelyMonths = Math.max(cleaningFrequency/30).toFixed(1).toString();

        return ` (aprox. ${daysInApproximatelyMonths} meses)`;
    }, [cleaningFrequency]);

    const toggleModalAddOrEdit = useCallback(() => {
        setModalOpen(prevState => !prevState);
        // setModalOpen(!modalOpen);
    }, []);

    const toggleModalCleaning = useCallback(() => {
        setModalCleaningOpen(prevState => !prevState);
    }, []);

    const toggleActiveEdition = () => {
        setActiveEdition(prevState => !prevState);
    };

    const handleSignOut = () => {

        logout();

        // authService.signOut()
        //     .then(() => {
        //         // Sign-out successful.
        //         checkIfAuthenticationIsRequired();
        //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //     }).catch((error: any) => {
        //         // An error happened.
        //         console.log(error);
        //     });
    }

    const handleAddClick = () => {
        toggleModalAddOrEdit();
    }

    const handleEnableEditingClick = () => {
        toggleActiveEdition();
    }

    const clearGameEditing = () => {
        setGameEditing(null);
    }

    const mappingArrayFirestoreDocumentToArrayGame = (games: FirestoreDocument[]): Game[] => {
        // return games.map((game: FirestoreDocument) => firestoreDocToJson(game) as Game) as Game[];
        return games.map((game: FirestoreDocument) => {
            return {
                ...firestoreDocToJson(game) as Game,
                id: game.name?.split(`projects/${firebaseConfig.projectId}/databases/(default)/documents/jogos/`)[1],
            } as Game; // casting do tipo Record<string, any> para Game
        }) as Game[];
    }

    const getSettings = useCallback(() => {
        setIsCleaningFrequencyLoading(true);
        settingsService.fetchSettings()
            .then((resp: number) => {
                setCleaningFrequency(resp)
            })
            .finally(() => setIsCleaningFrequencyLoading(false));
    }, []);

    const refreshGames = useCallback(() => {
        gameService.fetchGames(showOnlyActiveGamesFilterToggle).then((resp) => {
            setGames(resp);
            setGamesLoading(false);
        });
    }, [showOnlyActiveGamesFilterToggle]);

    useEffect(() => refreshGames(), [refreshGames]);

    useEffect(() => getSettings(), [getSettings]);

    return (
        <Container>
            <Content>
                <nav>
                    <Button
                        btntheme="quaternary"
                        onClick={() => navigate('/settings')}
                        title="Configurações"
                        data-testid="tl-configButton"
                    >
                        <FaCog/>
                    </Button>
                    <Button
                        btntheme="quaternary"
                        onClick={handleSignOut}
                        title="Sair"
                    >
                        <FaPowerOff/>
                    </Button>
                </nav>
                <h2>BG Limpo 2.0</h2>
                <small>
                    {!isCleaningFrequencyLoading ? (
                        `Frequência de limpezas: ${cleaningFrequency} dias${daysInApproximatelyMonths}`
                    ) : (
                        <Skeleton
                            height={8}
                            width={200}
                            baseColor="#00000017"
                            highlightColor="#00000047"
                        />
                    )}
                </small>
                <Toolbar>
                    <Button
                        btntheme="primary"
                        onClick={handleAddClick}
                        title="Adicionar jogo"
                        // disabled={gamesStatus === "pending" || games?.length === 0}
                        data-testid="tl-addGameButton"
                    >
                        <FaPlus />
                    </Button>
                    <Button
                        btntheme="primary"
                        className={activeEdition ? "active" : ""}
                        onClick={handleEnableEditingClick}
                        title="Editar um jogo"
                        // disabled={gamesStatus === "pending" || games?.length === 0}
                    >
                        <FaPen />
                    </Button>
                    <span>
                        <label htmlFor="onlyActives">
                            <span>Exibir Somente Ativos</span>
                            <Switch
                                id="onlyActives"
                                onChange={(e) => setShowOnlyActiveGamesFilterToggle(e)}
                                checked={showOnlyActiveGamesFilterToggle}
                            />
                        </label>
                    </span>
                </Toolbar>
                <section>
                    {cleaningFrequency != null && !gamesLoading && games ? (
                        <>
                            <p><small>{`Exibindo ${(mappingArrayFirestoreDocumentToArrayGame(games) as Game[]).length} jogos`}</small></p>
                            <ul>
                                {(mappingArrayFirestoreDocumentToArrayGame(games) as Game[])?.map((game: Game) => (
                                    <Card
                                        key={game.name}
                                        game={game}
                                        activeEdition={activeEdition}
                                        setGameEditing={setGameEditing}
                                        toggleModalCleaning={toggleModalCleaning}
                                        toggleModal={toggleModalAddOrEdit}
                                        limitInDays={cleaningFrequency}
                                    />
                                ))}
                            </ul>
                        </>
                    ) : (
                        <Loading>
                            <Skeleton
                                count={6}
                                height={132}
                                baseColor="#00000017"
                                highlightColor="#00000047"
                            />
                        </Loading>
                    )}
                </section>

                <ModalAddOrEdit
                    gameEditing={gameEditing}
                    modalOpen={modalOpen}
                    toggleModal={toggleModalAddOrEdit}
                    clearGameEditing={clearGameEditing}
                    refreshList={refreshGames}
                    // data-testid="tl-addOrEditModal"
                />

                <ModalCleaning
                    gameEditing={gameEditing}
                    modalOpen={modalCleaningOpen}
                    toggleModal={toggleModalCleaning}
                    clearGameEditing={clearGameEditing}
                    refreshList={refreshGames}
                />
            </Content>
        </Container>
    );
};

export default Games;