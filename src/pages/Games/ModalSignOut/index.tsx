import ReactModal from "react-modal";
import { RiCloseFill } from "react-icons/ri";
import Button from "@/components/Inputs/Button";
import { useAuth } from "@/contexts/authContext";
import {
  Container,
  ModalContent,
  ModalHeader,
  ModalBody,
  Buttons,
  ModalFooter,
} from "./styles";

interface Props {
  modalOpen: boolean;
  toggleModal: () => void;
}

const ModalSignOut: React.FC<Props> = ({ modalOpen, toggleModal }) => {

  const element = document.createElement("div");

  const { logout } = useAuth();

  const handleSignOutConfirmClick = () => logout();

  return (
    <Container>
      <ReactModal
        isOpen={modalOpen}
        contentLabel="Sair"
        appElement={element}
        onRequestClose={toggleModal}
        style={{
          content: {
            top: "50%",
            left: "50%",
            padding: "0",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h1>Logout</h1>
            <button type="button" onClick={toggleModal}>
              <RiCloseFill />
            </button>
          </ModalHeader>
          <ModalBody>
            Tem certeza que deseja sair?
          </ModalBody>
          <ModalFooter>
            <Buttons>
              <Button
                onClick={toggleModal}
                btntheme="secondary"
                autoFocus
              >
                Não
              </Button>
              <Button
                onClick={handleSignOutConfirmClick}
                btntheme="primary"
              >
                Sim
              </Button>
            </Buttons>
          </ModalFooter>
        </ModalContent>
      </ReactModal>
    </Container>
  );
};

export default ModalSignOut;
