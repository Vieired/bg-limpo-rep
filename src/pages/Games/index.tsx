import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaPlus, FaPen, FaPowerOff, FaCog } from "react-icons/fa";
// import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import Switch from "react-switch";
// import {
//     fetchGames,
//     selectGames,
//     toggleShowOnlyActiveGamesFilter,
// } from "../../store/gamesSlice.js";
import type { Game } from "../../shared/models/Games.ts";
import Button from "../../components/Inputs/Button/index";
// import ModalAddOrEdit from "./ModalAddOrEdit/index";
// import ModalCleaning from "./ModalCleaning/index.tsx";
import Card from "./Card/index.tsx";
import { firebaseAuthService } from "../../shared/services/firebaseAuthService.ts";
import type { FirestoreDocument } from "../../shared/models/domain/Firestore.ts";
// import { setUser } from "../../store/usersSlice.ts";
// import { firebaseConfig } from "../../shared/firebase/config";
import { firestoreDocToJson } from "../../shared/helpers/firestoreToJS.ts";
import { gameService } from "../../shared/services/gameService.ts";
import { settingsService } from "../../shared/services/settingsService.ts";
import { Container, Content, Loading, Toolbar } from "./styles";

const Games: React.FC = () => {

    const navigate = useNavigate();
    
    // const [modalOpen, setModalOpen] = useState<boolean>(false);
    // const [modalCleaningOpen, setModalCleaningOpen] = useState<boolean>(false);
    const [, setGameEditing] = useState<Game|null>(null);
    const [activeEdition, setActiveEdition] = useState<boolean>(false);
    const [ games, setGames ] = useState<FirestoreDocument[]|null>(null);
    const [ cleaningFrequency, setCleaningFrequency ] = useState<number>(0);
    const [ showOnlyActiveGamesFilterToggle, setShowOnlyActiveGamesFilterToggle ] = useState<boolean>(true);
    const [ cleaningFrequencyLoading, setCleaningFrequencyLoading ] = useState<boolean>(true);
    const [ gamesLoading, setGamesLoading ] = useState<boolean>(true);

    const subtitle = `Frequência de limpezas: ${cleaningFrequency} meses`;

    // const toggleModal = useCallback(() => {
    //     setModalOpen(prevState => !prevState);
    //     // setModalOpen(!modalOpen);
    // }, []);

    // const toggleModalCleaning = useCallback(() => {
    //     setModalCleaningOpen(prevState => !prevState);
    // }, []);

    const toggleActiveEdition = () => {
        setActiveEdition(prevState => !prevState);
    };

    const handleSignOut = () => {
        firebaseAuthService.signOut().then(() => {
                // Sign-out successful.
                // dispatch(setUser(null));
                localStorage.clear();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }).catch((error: any) => {
                // An error happened.
                console.log(error);
            });
    }

    const handleAddClick = () => {
        // toggleModal();
    }

    const handleEnableEditingClick = () => {
        toggleActiveEdition();
    }

    // const clearGameEditing = () => {
    //     setGameEditing(null);
    // }

    const mappingArrayFirestoreDocumentToArrayGame = (games: FirestoreDocument[]): Game[] => {
        const ret: Game[] = games.map((game) => firestoreDocToJson(game) as Game); // casting do tipo Record<string, any> para Game
        return ret;
    }

    const getSettings = useCallback(() => {
        settingsService.fetchSettings().then((resp: number) => {
            setCleaningFrequency(resp);
            setCleaningFrequencyLoading(false)
        })
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
                <h2>BG Limpo</h2>
                <small>
                    {!cleaningFrequencyLoading ? (
                        subtitle
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
                {!gamesLoading && games ? (
                    <ul>
                        {/* {(games as FirestoreDocument[])?.map((game: FirestoreDocument) => (
                            <li key={game.name}>
                                {getValue(game.fields.name)}
                            </li>
                        ))} */}
                        {(mappingArrayFirestoreDocumentToArrayGame(games) as Game[])?.map((game: Game) => (
                            <Card
                                key={game.name}
                                game={game}
                                activeEdition={activeEdition}
                                setGameEditing={setGameEditing}
                                toggleModalCleaning={/*toggleModalCleaning*/() => {}}
                                toggleModal={/*toggleModal*/() => {}}
                                limitInMonths={cleaningFrequency}
                            />
                        ))}
                    </ul>
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

                {/* <ModalAddOrEdit
                    gameEditing={gameEditing}
                    modalOpen={modalOpen}
                    toggleModal={toggleModal}
                    clearGameEditing={clearGameEditing}
                    // data-testid="tl-addOrEditModal"
                />

                <ModalCleaning
                    gameEditing={gameEditing}
                    modalOpen={modalCleaningOpen}
                    toggleModal={toggleModalCleaning}
                    clearGameEditing={clearGameEditing}
                /> */}
            </Content>
        </Container>
    );
};

export default Games;