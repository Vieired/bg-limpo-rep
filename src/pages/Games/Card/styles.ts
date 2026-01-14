import styled, { css } from "styled-components";

interface Prop {
    percentage?: number; // 0–100
    $active?: boolean;
}

export const Container = styled.li<Prop>`
    display: grid;
    grid-template-columns: min-content auto min-content;
    box-shadow: 3px 3px 4px 1px #0000009c;
    border-radius: 16px;
    padding: 1rem;
    background: #023F56;
    color: #F5F5F5;
    gap: 1rem;

    ${props => {
        if (props?.$active === false) {
            return css`
                opacity: 0.7;
            `
        }
    }}

    ${props => {
        if (props?.percentage == null) {
            return css`
                &.pending-maintenance {
                    background: #C30414;
                }
            `
        }
    }}

    background: ${({ percentage = 0 }) => {
        const p = Math.min(100, Math.max(0, percentage));

        // Extremos sólidos
        if (p === 100) return "#C30414";
        if (p === 0) return "#023F56";

        /*
        A "zona de blend" define o quão suave é o degradê.
        Quanto maior, mais suave.
        */
        const blend = 10;

        const start = Math.max(0, p - blend);
        const end = Math.min(100, p + blend);

        return `
        linear-gradient(
            90deg,
            #C30414 ${start}%,
            #023F56 ${end}%
        )
        `;
    }};
    transition: background 0.4s ease;

    > span { // para todas as três colunas do card
        display: grid;
        justify-content: space-between;
        justify-content: normal;
        gap: 1rem;

        @media (min-width: 768px) {
            grid-template-columns: 5fr 3fr 1fr;
        }

        @media (min-width: 1200px) {
            grid-template-columns: 4fr 2fr 1fr;
        }
        
        > h3 {
            padding: 0;
            margin: 0;
            text-align: left;
        }

        > div:first-of-type, div:nth-child(3) {
            justify-self: flex-start;
        }

        > div:nth-child(2) {
            justify-self: flex-start;
            align-content: end;
            color: #ffffff75;
            text-align: start;
        }

        > div:nth-child(3) {
            /* align-content: end; */
            font-size: .8rem;
            color: #ffffff75;
            text-align: end;
            display: flex;
            flex-direction: column;
            justify-self: flex-end;
            justify-content: flex-end;
            row-gap: 2px;

            @media (min-width: 768px) {
                row-gap: 8px;
            }

            @media (min-width: 1200px) {
                row-gap: 8px;
            }
        }

        &:first-of-type {
            align-self: center;
            width: 100px;
            background: radial-gradient(transparent, #00000038);

            > img {
                width: 100px;
                max-width: inherit;
                max-height: 100px;
                min-height: 100px;
                object-fit: contain;
                object-position: center;
            }
        }
    }

    > span:last-of-type { // terceira coluna do card | botões CRUD
        grid-template-columns: 1fr;
        
        @media (min-width: 768px) {
            display: flex;
        }
        
        > button {
            background-color: #ffffff4a;
            padding: 0.6em 0.3em;
            font-size: 2rem;

            &:focus {
                outline: none;
                outline-offset: none;
            }
            &:focus-visible {
                outline: 4px auto #fff;
            }
        }
    }
`;