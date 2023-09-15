import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import useUserInfo from "@src/hooks/queries/auth/useUserInfo";

import ProfileIcon from "../../../public/images/common/icon-profile.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    justify-content: space-between;
  `,
  DateWrap: styled.div`
  display: flex;
  align-items: center;
    p {
      color: ${({ theme }) => theme.basic.darkBlue};
      ${({ theme }) => theme.textStyle.h5Bold};
    }
  `,
  profileWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 17.5px;

    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.32px;
      color: #405f8d;
    }
  `,
  LogoutButton: styled.div`
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid ${({theme})=>theme.basic.recOutline};
  background-color: ${({theme})=>theme.blackWhite.white};
  cursor: pointer;

  p{
    font-size: 16px;
    ${({theme})=>theme.textStyle.h6Bold};
  }
  `,
};

function MainHeader() {
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {},
  });

  const [dateTime, setDateTime] = useState();

  useEffect(() => {
    // 웹 워커 생성
    const worker = new Worker("worker.js");

    // 웹 워커로부터 메시지를 수신하는 이벤트 핸들러
    worker.onmessage = (event) => {
      // setKoreanTime(event.data);
      const { date, time } = event.data;
      setDateTime(date + " " + time);
    };
    // 컴포넌트 언마운트 시 웹 워커 정리
    return () => {
      worker.terminate();
      worker.postMessage("getKoreanTime");
    };
  }, [dateTime]);

  const handleLogoutClick = useCallback(()=>{
    alert("로그아웃 클릭");

  },[]);

  return (
    <S.Wrap>
      <S.DateWrap>
        <p>{dateTime}</p>
      </S.DateWrap>
      <S.profileWrap>
        <ProfileIcon width={21} height={22} />
        <p>안녕하세요, {userInfo?.user?.name}님</p>
        <S.LogoutButton onClick={handleLogoutClick}>
          <p>로그아웃</p>
        </S.LogoutButton>
      </S.profileWrap>
    </S.Wrap>
  );
}

export default MainHeader;
