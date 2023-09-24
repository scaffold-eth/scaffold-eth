import styled from "styled-components";

const Button = styled.button`
  margin-top: 0.5em;
  border: 1px solid white;
  border-radius: 6px;
  padding: 0.6em 2em;
  font-family: "Fira Mono";
  font-weight: 500;
  color: ${p => p.theme.textLight};
  background: none;
  letter-spacing: 0.02em;
  transition: all 100ms;
  :hover {
    background: ${p => p.theme.primaryHover};
    cursor: pointer;
  }
  :focus {
    box-shadow: 0px 2px 2px -1px rgba(0, 0, 0, 0.12), 0px 0px 0px 3px #333;
    outline: none;
  }
  :disabled {
    opacity: 35%;
    cursor: inherit;
  }
  :disabled:hover {
    background: ${p => p.theme.primary};
  }
`;

export const RoundedButton = styled(Button)`
  border-radius: 5em;
  padding: 0.6em 2em;
  color: black;
  background: ${p => p.theme.textLight};
  letter-spacing: 0.02em;
  transition: all 100ms;
  :hover {
    background: #ffe8e8;
  }
  :focus {
    box-shadow: 0px 2px 2px -1px rgba(0, 0, 0, 0.72), 0px 0px 0px 2px #eee;
    outline: none;
  }
`;

export default Button;
