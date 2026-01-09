import { useMemo } from "react";
import ReactModal from "react-modal";
import { useFormik } from "formik";
import { RiCloseFill } from "react-icons/ri";
import { MdCleaningServices } from "react-icons/md";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import type { MultiValue } from "react-select";
import type { Game } from "../../../shared/models/Games";
import type { Dropdown } from "../../../shared/models/domain/Select";
import { gameService } from "../../../shared/services/gameService";
import Button from "../../../components/Inputs/Button";
import InputDate from "../../../components/Inputs/InputDate";
import schema from "./schema";
import InputSelectMulti from "../../../components/Inputs/InputSelectMulti";
import { getTypeDescription, getTypeList } from "../../../shared/enums/CleaningMethodEnum";
import Input from "../../../components/Inputs/Input";
import {
  Container,
  ModalContent,
  ModalHeader,
  ModalBody,
  Buttons,
  ModalFooter,
  CleaningMethods,
} from "./styles";

interface Props {
    gameEditing: Game | null;
    modalOpen: boolean;
    refreshList: () => void;
    toggleModal: () => void;
    clearGameEditing: () => void;
}

const ModalCleaning: React.FC<Props> = ({
  gameEditing,
  modalOpen,
  refreshList,
  toggleModal,
  clearGameEditing,
}) => {

  const element = document.createElement("div");
  // ReactModal.setAppElement('#root');
  // const dispatch = useDispatch();

  const today = new Date().toISOString().split("T")[0];

  const methodOptions = useMemo(() => {
    return getTypeList().map((x) => {
      return {
        id: String(x.id),
        name: x.name,
      } as Dropdown
    }) as Dropdown[]
  }, []);

  const done = () => {
    toggleModal();
    refreshList();
  };

  const handleSubmit = (data: Game/*GameCleaning*/) => {

    // if (data?.id) {
    //   dispatch(updateCleaningDate({
    //     id: data.id,
    //     methods: data.methods,
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //   }) as any)
    //   .then(() => {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     dispatch(fetchGames(showOnlyActiveGamesFilter) as any);
    //     toggleModal()
    //   });
    // }
    
    if (!data?.id) return;

    gameService.updateGame(data).then(() => {
      toast.success("Limpeza do jogo atualizada com sucesso.", {
          toastId: "notification-message",
      });
      done();
    })
    // gameService.updateCleaningDate({
    //   ...data,
    //   cleaning_methods: data.cleaning_methods,
    // } as Game).then(() => {
    //   toast.success("Jogo atualizado com sucesso.", {
    //       toastId: "notification-message",
    //   });
    //   done();
    // })
  };

  const formik = useFormik({
    onSubmit: handleSubmit,
    validationSchema: schema,
    enableReinitialize: true,
    initialValues: {
      ...gameEditing,
      cleaning_date: today,
      cleaning_methods: null,
    } as Game,
  });

  const getErrorMessage = (fieldName: string) => {
    if (formik.isSubmitting && !formik.isValid) {
      toast.error("Check required fields.", {
        toastId: "invalid-form-field",
      });
    }

    return formik?.getFieldMeta(fieldName)?.touched &&
      formik?.getFieldMeta(fieldName)?.error
      ? formik.getFieldMeta(fieldName).error
      : "";
  };

  const handleAfterClose = () => {
    formik.resetForm();
    clearGameEditing();
  };

  return (
    <Container>
      <ReactModal
        isOpen={modalOpen}
        contentLabel="Limpar Jogo"
        appElement={element}
        onRequestClose={toggleModal}
        onAfterClose={handleAfterClose}
        style={{
          content: {
            top: "50%",
            left: "50%",
            padding: "0",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            height: "80%",
          },
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h1>Limpar Jogo</h1>
            <button type="button" onClick={toggleModal}>
              <RiCloseFill />
            </button>
          </ModalHeader>
          <ModalBody>
            <form
              id="hookform"
              onSubmit={formik.handleSubmit}
              // className={getLoadingState() ? "loading" : ""}
            >
              <Input
                name="name"
                label="Nome"
                placeholder="Nome do jogo"
                value={formik?.values?.name}
                disabled
              />
              {/* <Input
                name="cleaning_method"
                label="Método de Limpeza *"
                placeholder="1.Sílica, 2.Sanol, 3.Banho de sol"
                value={formik?.values?.cleaning_method}
                onChange={formik?.handleChange}
                errorText={getErrorMessage("cleaning_method")}
                autoFocus
              /> */}
              <InputSelectMulti
                name="cleaning_methods"
                id="cleaning_methods"
                label="Métodos de Limpeza *"
                placeholder="Ex. Aplicação de Sílica, Sanol, Banho de Sol"
                onChange={(e: MultiValue<Dropdown>) => {
                  console.log(e.map(x => Number(x.id)));
                  formik.setFieldValue('cleaning_methods', e.map(x => Number(x.id)));
                }}
                selecteds={
                  formik?.values?.cleaning_methods?.map(x => {
                    return {
                      id: String(x),
                      name: getTypeDescription(x),
                    } as Dropdown
                  }) as Dropdown[]
                }
                options={methodOptions}
                errorText={getErrorMessage("cleaning_methods")}
              />
              <InputDate
                name="cleaning_date"
                label="Data da Limpeza *"
                value={formik?.values?.cleaning_date}
                onChange={formik?.handleChange}
                errorText={getErrorMessage("cleaning_date")}
              />
              {gameEditing?.cleaning_methods == null ? (
                <>
                  <Skeleton
                    height={16}
                    width={400}
                    baseColor="#00000017"
                    highlightColor="#00000047"
                  />
                  <Skeleton
                    height={8}
                    width={250}
                    baseColor="#00000017"
                    highlightColor="#00000047"
                  />
                  <Skeleton
                    height={8}
                    width={250}
                    baseColor="#00000017"
                    highlightColor="#00000047"
                  />
                  <Skeleton
                    height={8}
                    width={250}
                    baseColor="#00000017"
                    highlightColor="#00000047"
                  />
                </>
              ) : (
                <>
                  {gameEditing?.cleaning_methods?.length > 0 ? (
                    <CleaningMethods>
                      <h3>Últimos Métodos de Limpeza Usados:</h3>
                      <ul>
                        {gameEditing?.cleaning_methods?.map((cleaning_method) => {
                        return <li key={cleaning_method}>{getTypeDescription(cleaning_method)}</li>
                        })}
                      </ul>
                    </CleaningMethods>
                  ) : (
                    <CleaningMethods>
                      <h4>Nenhum método de limpeza foi usado anteriormente.</h4>
                    </CleaningMethods>
                  )}
                </>
              )}
            </form>
          </ModalBody>
          <ModalFooter>
            <Buttons>
              <Button onClick={toggleModal} btntheme="secondary">
                Cancelar
              </Button>
              <Button
                type="submit"
                btntheme="primary"
                form="hookform"
                // disabled={getLoadingState()}
              >
                <span>Limpar</span><MdCleaningServices />
              </Button>
            </Buttons>
          </ModalFooter>
        </ModalContent>
      </ReactModal>
    </Container>
  );
};

export default ModalCleaning;
