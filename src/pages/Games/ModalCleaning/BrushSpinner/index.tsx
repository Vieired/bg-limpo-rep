import styled from "styled-components";
import brush from '../../../../assets/brush.svg';

const Spinner = styled.i`
    position: absolute;
    top: 0;
    left: 0;
    width: -webkit-fill-available;
    height: 100%;
        background-image: url("${brush}");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    /* background-size: 16rem; */
    backdrop-filter: blur(1px);
    user-select: none;
    pointer-events: all;
    min-height: 150px;
`;

export const BrushSpinner: React.FC = () => <Spinner/>