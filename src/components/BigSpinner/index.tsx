import styled from "styled-components";
import loader from '../../assets/loader3.gif';

const Spinner = styled.i`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    width: -webkit-fill-available;
    height: 100vh;
    height: 100%;
    background: url(${loader}) #ffffff59 center no-repeat;
    background-size: 16rem;
    backdrop-filter: blur(1px); // pode gerar efeito de duplicação
    user-select: none;
    pointer-events: all;
    min-height: 250px;
`;

export const BigSpinner: React.FC = () => <Spinner/>