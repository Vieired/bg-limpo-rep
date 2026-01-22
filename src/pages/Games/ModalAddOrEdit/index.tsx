import { useMemo } from "react";
import { RiCloseFill } from "react-icons/ri";
import ReactModal from "react-modal";
import Switch from "react-switch";
import type { MultiValue } from "react-select";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import type { Game } from "../../../shared/models/Games";
// import {
//   createGame,
//   updateGame,
//   fetchGames,
//   selectGames,
// } from "../../../store/gamesSlice";
import { gameService } from "../../../shared/services/gameService";
import { BigSpinner } from "../../../components/BigSpinner";
import Button from "../../../components/Inputs/Button";
import Input from "../../../components/Inputs/Input";
import InputDate from "../../../components/Inputs/InputDate";
import InputSelectMulti from "../../../components/Inputs/InputSelectMulti";
import { getTypeDescription, getTypeList } from "../../../shared/enums/CleaningMethodEnum";
import type { Dropdown } from "../../../shared/models/domain/Select";
import schema from "./schema";
import {
  Container,
  ModalContent,
  ModalHeader,
  ModalBody,
  Buttons,
  ModalFooter,
} from "./styles";

interface Props {
    gameEditing: Game | null;
    refreshList: () => void;
    modalOpen: boolean;
    toggleModal: () => void;
    clearGameEditing: () => void;
}

const ModalAddOrEdit: React.FC<Props> = ({
  gameEditing,
  refreshList,
  modalOpen,
  toggleModal,
  clearGameEditing,
}) => {

  const element = document.createElement("div");
  const today = new Date().toISOString().split("T")[0];

  const done = () => {
    toggleModal();
    refreshList();
  };

  const handleSubmit = (data: Game) => {

    const completeSubmissionWithDelay = (): void => {
      setTimeout(() => formik.setSubmitting(false), 4000)
    }

    // gameEditing ? edit(data, done) : save(data, done);
    if(gameEditing?.id) {
      gameService.updateGame({
        ...data,
        cleaning_method: Number(data.cleaning_method),
      } as Game)
      .then(() => {
        toast.success("Jogo atualizado com sucesso.", {
            toastId: "notification-message",
        });
        done();
      })
      .finally(() => completeSubmissionWithDelay);
    }
    else {
      gameService.createGame({
        ...data,
        cleaning_method: Number(data.cleaning_method),
      })
      .then(() => done())
      .finally(() => completeSubmissionWithDelay)
    }
  };

  const formik = useFormik({
    onSubmit: handleSubmit,
    validationSchema: schema,
    enableReinitialize: true,
    initialValues: gameEditing?.id
      ? (gameEditing as Game)
      : {
        // id: 'idle',
        cleaning_date: today,
        cleaning_method: 1,
        cleaning_methods: [],
        isActive: true,
        name: ""
      } as Game,
  });

  const methodOptions = useMemo(() => {
    return getTypeList().map((x) => {
      return {
        id: String(x.id),
        name: x.name,
      } as Dropdown
    }) as Dropdown[]
  }, []);

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

//   useEffect(() => {
//     if (formik?.values?.province) setCityOptions(formik?.values?.province.id);
//   }, [formik?.values?.province]);

  // useEffect(() => {
  //   console.log("formik.values: ", formik.values)
  // }, [formik.values]);

  return (
    <Container>
      <ReactModal
        isOpen={modalOpen}
        contentLabel={gameEditing ? "Editar Jogo" : "Criar Jogo"}
        appElement={element}
        onRequestClose={toggleModal}
        onAfterClose={handleAfterClose}
        // overlayClassName="modal-overlay"
        // ariaHideApp={false} // se não usar ReactModal.setAppElement("#root")
        // parentSelector={() => document.body}
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
            <h1>{gameEditing ? "Editar Jogo" : "Criar Jogo"}</h1>
            <button type="button" onClick={toggleModal}>
              <RiCloseFill />
            </button>
          </ModalHeader>
          <ModalBody>
            <form
              id="hookform"
              onSubmit={formik.handleSubmit}
            //   className={getLoadingState() ? "loading" : ""}
            >
              {/* {`Editando: ${gameEditing?.name || "N/A"}`} */}
              <div>
                  <label htmlFor="isActive">
                      <span>Ativado?</span>
                    <Switch
                        id="isActive"
                        onChange={(e) => formik?.setFieldValue("isActive", e)}
                        checked={formik?.values?.isActive}
                    />
                  </label>
              </div>
              <Input
                name="name"
                label="Nome *"
                placeholder="Nome do jogo"
                value={formik?.values?.name}
                onChange={formik.handleChange}
                errorText={getErrorMessage("name")}
                autoFocus
              />
              <InputDate
                name="cleaning_date"
                label="Data da Limpeza *"
                value={formik?.values?.cleaning_date}
                onChange={formik?.handleChange}
                errorText={getErrorMessage("cleaning_date")}
              />
              {/* <Input
                  name="cleaning_method"
                  label="Método de Limpeza *"
                  placeholder="1.Sílica, 2.Sanol, 3.Banho de sol"
                  value={formik?.values?.cleaning_method}
                  onChange={formik?.handleChange}
                  errorText={getErrorMessage("cleaning_method")}
              /> */}
              <InputSelectMulti
                name="cleaning_methods"
                label="Métodos de Limpeza"
                placeholder="Ex. Aplicação de Sílica, Sanol, Banho de Sol"
                onChange={(e: MultiValue<Dropdown>) => {
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
              <Input
                name="photoUrl"
                label="URL da foto"
                placeholder="Ex. https://google/storage/imagem.jpg"
                value={formik?.values?.photoUrl}
                onChange={formik.handleChange}
                errorText={getErrorMessage("photoUrl")}
              />
            </form>
            { formik.isSubmitting && <BigSpinner/> }
          </ModalBody>
          <ModalFooter>
            <Buttons>
              <Button
                onClick={toggleModal}
                btntheme="secondary"
                disabled={formik.isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                btntheme="primary"
                form="hookform"
                disabled={formik.isSubmitting}
              >
                Salvar
              </Button>
            </Buttons>
          </ModalFooter>
        </ModalContent>
      </ReactModal>
    </Container>
  );
};

export default ModalAddOrEdit;
