import styled from "styled-components";

export const Container = styled.div`
    display: flex;  
    flex-direction: column;
    gap: 5rem;

    > div {

        &:first-of-type {

            > h1 {
                font-size: 3rem;
                color: var(--Catan-4-hex);
            }
        }

        &:last-of-type {
            display: flex;
            flex-direction: row;
            gap: 2rem;
            padding: 2rem;
            background: #fffae8;

            @media (max-width: 768px) {
                flex-direction: column;
            }

            > h2 {
                color: var(--Catan-4-hex);
                color: #bfb48b;
            }
        }
    }
`;