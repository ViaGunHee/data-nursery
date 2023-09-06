import React from "react";
import styled from "styled-components";

const S = {
  BackGroundWrap: styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    position: absolute;
    z-index: 99;
    top: 0%;
    left: 0%;
  `,
  Wrap: styled.div`
    max-height: 90vh;
    /* overflow-y: auto; */
    position: absolute;
    z-index: 99;
    top: 50%;
    left: calc(50% - 100px);
    background-color: #ffffff;

    width: 200px;
    border-radius: 8px;
    padding: 16px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    transform: translate3d(0%, -50%, 0);
  `,
  SelectWrap: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    overflow-y: auto;

    p {
      white-space: pre-line;
      text-align: center;
    }

    .select-category-text {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      /* p { */

      ${({ theme }) => theme.textStyle.h5Bold}
      color: ${({ theme }) => theme.basic.grey40};
      text-align: center;
      /* } */
    }

    .value-list-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: block !important;
        width: 6px;
        border-radius: 4px;
        background-color: ${({ theme }) => theme.basic.whiteGrey};
        margin-left: 5px !important;
      }

      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: ${({ theme }) => theme.mobile.scrollBar};
      }
    }

    .row-layout {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px;
      gap: 8px;
      cursor: pointer;
      border-radius: 4px;
    }

    .value-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey60};
    }

    .selected-value {
      background-color: ${({ theme }) => theme.basic.grey20};
    }
  `,
};

function DefaultSelectList({ children }) {
  return (
    <S.BackGroundWrap>
      <S.Wrap>
        <S.SelectWrap>{children}</S.SelectWrap>
      </S.Wrap>
    </S.BackGroundWrap>
  );
}

export default DefaultSelectList;
