import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const S = {
  ButtonWrap: styled(Button)`
    width: 100%;
    height: 52px;
    padding: 16px 24px !important;

    display: flex;
    align-items: center;
    justify-content: center;

    ${({ theme }) => theme.textStyle.h6Bold}
    border-radius: 8px !important;

    color: ${(props) => props.fontColor} !important;
    background-color: ${(props) => props.backgroundColor} !important;
    border: 2px solid ${(props) => props.borderColor} !important;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    cursor: ${(props) => (props.fontColor === `#C2D6E1` ? "auto" : "pointer")} !important;

    &:hover {
      background-color: ${(props) => props.hoverBackgroundColor} !important;
      border-color: ${(props) => props.hoverBorderColor} !important;
    }

    &:focus {
      background-color: ${(props) => props.focusBackgroundColor} !important;
      border-color: ${(props) => props.focusBorderColor} !important;
    }
  `,
};

function ModalButton({ text, onClick, customStyle }) {
  return (
    <S.ButtonWrap
      backgroundColor={customStyle.backgroundColor}
      borderColor={customStyle.borderColor}
      hoverBackgroundColor={customStyle.hoverBackgroundColor}
      hoverBorderColor={customStyle.hoverBorderColor}
      focusBackgroundColor={customStyle.focusBackgroundColor}
      focusBorderColor={customStyle.focusBorderColor}
      fontColor={customStyle.fontColor}
      onClick={customStyle.fontColor === "#DEDEDE" ? () => {} : onClick}>
      {text}
    </S.ButtonWrap>
  );
}

export default ModalButton;