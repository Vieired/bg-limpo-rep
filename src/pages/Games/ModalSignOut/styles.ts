import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  gap: 40px;
  flex-direction: column;
`;

export const Content = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 16px;
  gap: 32px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;

  h1 {
    display: flex;
    width: 100%;
    justify-content: center;    
    padding: 16px 0 16px 16px;
    font-size: 24px;
    font-weight: bold;
  }

  button {
    width: 71.89px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:focus-visible {
      outline: dashed #000 1px;
      outline-offset: -16px;
    }

    svg {
      width: 25px;
      height: 25px;
    }
  }
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 32px;
  overflow: auto;
  color: #000;
  gap: 16px;
  height: inherit;
  position: relative;
`;

export const ModalFooter = styled.div`
  display: flex;
  padding: 16px 32px 32px;
  justify-content: end;

  > div {
    gap: 32px;

    button {
      width: 100px;
    }
  }
`;

export const Buttons = styled.div`
  display: flex;
`;