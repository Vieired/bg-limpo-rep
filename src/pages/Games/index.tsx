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
// import type { Game } from "../../shared/models/Games.ts";
import Button from "../../components/Inputs/Button/index";
// import ModalAddOrEdit from "./ModalAddOrEdit/index";
// import ModalCleaning from "./ModalCleaning/index.tsx";
// import Card from "./Card/index.tsx";
import { firebaseAuthService } from "../../shared/services/firebaseAuthService.ts";
// import { setUser } from "../../store/usersSlice.ts";
// import { firebaseConfig } from "../../shared/firebase/config";
import { Container, Content, Loading, Toolbar } from "./styles";
import { getValue } from "../../shared/helpers/firestoreToJS.ts";
import type { FirestoreDocument } from "../../shared/models/domain/Firestore.ts";
import { gameService } from "../../shared/services/gameService.ts";

const Games: React.FC = () => {

    const [ games, setGames ] = useState<FirestoreDocument[]|null>(null);

    // const dispatch = useDispatch();
    const gamesStatus = /*useSelector(selectGames).status*/ "ok";
    // const {
    //     games,
    //     limitInMonths,
    //     showOnlyActiveGamesFilter,
    // } = /*useSelector(selectGames)*/ {
    //     games: Game[];
    //     status: string;
    //     limitInMonths: number | null;
    //     today: string;
    //     showOnlyActiveGamesFilter: boolean;
    // } as InitialStateGames;
    const navigate = useNavigate();

    const subtitle = /*`Frequência de limpezas: ${limitInMonths} meses`*/"Lorem ipsum dolor sit amet";

    // const [modalOpen, setModalOpen] = useState<boolean>(false);
    // const [modalCleaningOpen, setModalCleaningOpen] = useState<boolean>(false);
    // const [gameEditing, setGameEditing] = useState<Game|null>(null);
    const [activeEdition, setActiveEdition] = useState<boolean>(false);

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

    const refreshGames = useCallback(() => {
        // // eslint-disable-next-line @typescript-eslint/no-explicit-any
        // dispatch(fetchGames(showOnlyActiveGamesFilter) as any);
        gameService.fetchGames().then((resp) => {
            setGames(resp)
        });
    }, []);

    useEffect(() => refreshGames(), [refreshGames]);

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
                    {subtitle}
                    {/* {limitInMonths ? (
                        subtitle
                    ) : (
                        <Skeleton
                            height={8}
                            width={200}
                            baseColor="#00000017"
                            highlightColor="#00000047"
                        />
                    )} */}
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
                                // onChange={(e) => toggleShowOnlyActiveGamesFilter(e)}
                                onChange={() => {}}
                                checked={/*showOnlyActiveGamesFilter*/true}
                            />
                        </label>
                    </span>
                </Toolbar>
                {gamesStatus as string !== "pending" ? (
                    <ul>
                        {(games as FirestoreDocument[])?.map((game: FirestoreDocument) => (
                            <li key={game.name}>
                                {getValue(game.fields.name)}
                            </li>
                            // <Card
                            //     key={game.id}
                            //     game={game}
                            //     activeEdition={activeEdition}
                            //     setGameEditing={setGameEditing}
                            //     toggleModalCleaning={toggleModalCleaning}
                            //     toggleModal={toggleModal}
                            // />
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