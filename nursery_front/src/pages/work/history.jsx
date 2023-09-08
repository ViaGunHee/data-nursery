import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useWorkHistoryList from "@hooks/queries/planter/useWorkHistoryList";

import MainLayout from "@components/layout/MainLayout";
import DefaultYearMonthSelect from "@components/common/calendar/DefaultYearMonthSelect";
import DefaultYearMonthList from "@components/common/calendar/DefaultYearMonthList";
import DefaultHorizontalCalendar from "@components/common/calendar/DefaultHorizontalCalendar";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import theme from "@src/styles/theme";
import { DateDotFormatting, DateKoreanFormatting, ImagePathCheck, NumberFormatting } from "@utils/Formatting";
import NoneIcon from "@images/dashboard/none-icon.svg";
import BoxIcon from "@images/dashboard/icon-box.svg";
import { workHistoryKey } from "@utils/query-keys/PlanterQueryKeys";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }
  `,
  DateSelectWrap: styled.div`
    padding: 24px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 166px;
    background-color: ${({ theme }) => theme.basic.deepBlue};
    position: sticky;

    .select-wrap-padding {
      padding: 16px 0px;
    }
  `,
  ContentWrap: styled.div`
    padding: 38px 24px 36px 24px;
    height: calc(100% - 166px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${({ theme }) => theme.basic.whiteGrey};

    .total-seed-quantity-text {
      margin: 20px 0px 10px 0px;
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.deepBlue};
    }

    .no-work-history {
      font-size: 16px;
      line-height: 20px; /* 125% */
      letter-spacing: -0.32px;
      color: ${({ theme }) => theme.basic.grey50};
      margin-top: 27px;
    }
  `,
  SelectedDateWrap: styled.div`
    width: fit-content;
    height: 34px;
    background-color: ${({ theme }) => theme.basic.grey20};
    padding: 8px;
    border-radius: 8px;

    p {
      ${({ theme }) => theme.textStyle.h7Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
  TotalSeedQuantityValueWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .row-layout {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .seed-quantity-value {
      ${({ theme }) => theme.textStyle.h1BoldThin}
      color: ${({ theme }) => theme.mobile.secondary2};
      line-height: 36px;
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.deepBlue};
    }

    .border-bottom {
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background-color: ${({ theme }) => theme.mobile.secondary2};
    }
  `,
  WorkHistoryTextWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    width: 100%;

    .work-history-text {
      ${({ theme }) => theme.textStyle.h5Bold}
      color: ${({ theme }) => theme.basic.grey60};
    }

    .work-history-suffix-text {
      ${({ theme }) => theme.textStyle.h6Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }

    .work-history-count-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `,
  WorkHistoryListWrap: styled.div`
    width: 100%;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  WorkHistoryContent: styled.div`
    width: 100%;
    height: 238px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    .divider {
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.basic.recOutline};
      margin: 16px 0px;
    }
  `,
  WorkInfo: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 24px;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.basic.grey60};
      width: 100%;
      text-align: left;
    }

    .text-wrap {
      width: calc(100% - 82px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    .crop-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      text-align: left;
    }

    .count-text-wrap {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      max-width: 100%;
    }

    .count-text {
      ${({ theme }) => theme.textStyle.h2BoldThin}
      flex:1;
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey40};
      width: fit-content;
    }

    .seed-quantity-wrap {
      gap: 7px;
      margin-top: 10px;
      align-items: center;
    }

    .seed-quantity-text {
      color: ${({ theme }) => theme.basic.grey50};
      flex: 1;
    }
  `,
  CropImage: styled.div`
    width: 58px;
    height: 58px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
      props.isCropImage
        ? css`
            background-color: none;
          `
        : css`
            background-color: #ebebf5;
          `}
  `,
  DateWrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .date-row-layout {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category-box {
      width: 58px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.recOutline};

      p {
        ${({ theme }) => theme.textStyle.h7Regular}
        color: ${({ theme }) => theme.basic.deepBlue};
      }
    }

    .date-text {
      ${({ theme }) => theme.textStyle.h6Regular}
      color: ${({ theme }) => theme.basic.grey60};
    }
  `,
};

function WorkHistoryPage() {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

  // inView : 요소가 뷰포트에 진입했는지 여부
  const { ref, inView, entry } = useInView({
    threshold: 0, // 요소가 얼마나 노출되었을때 inView를 true로 변경할지 (0~1 사이의 값)
  });

  const [workHistoryListPage, setWorkHistoryListPage] = useState(1);
  const [workHistoryList, setWorkHistoryList] = useState([]);

  // 선택한 년도, 월
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  // 년도, 월 Select open 여부
  const [yearMonthOpen, setYearMontOpen] = useState({
    year: false,
    month: false,
  });

  // 날짜 변경
  const handleDateChange = useCallback(
    (name, value) => {
      setDate((prev) => ({
        ...prev,
        [name]: value,
      }));
      setWorkHistoryList([]);
      invalidateQueries([workHistoryKey]);
      setWorkHistoryListPage(1);
    },
    [date],
  );

  // 년도, 월 오픈 변경
  const handleYearMonthOpen = useCallback(
    (name, value) => {
      setYearMontOpen((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [yearMonthOpen],
  );

  // 페이지 변경
  const pageChange = useCallback(() => {
    if (workHistoryListData?.total > workHistoryList.length) {
      setWorkHistoryListPage(workHistoryListPage + 1);
    }
  }, [workHistoryListPage, workHistoryList]);

  useEffect(() => {
    if (inView) {
      pageChange();
    }
  }, [inView]);

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      // userLogout(router, clearQueries);
    },
  });

  // 작업이력 목록 API
  const { data: workHistoryListData } = useWorkHistoryList({
    serialNumber: userInfo?.planter.serial_number,
    year: date.year,
    month: date.month,
    date: date.day,
    page: workHistoryListPage,
    successFn: (res) => {
      setWorkHistoryList((prev) => [...prev, ...res.planter_works]);
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  return (
    <MainLayout
      pageName={"작업이력"}
      backIconClickFn={() => {
        router.push("/");
      }}
      backgroundColor={theme.basic.deepBlue}
      buttonSetting={null}>
      <S.Wrap>
        <S.DateSelectWrap>
          <div className="select-wrap-padding">
            <DefaultYearMonthSelect
              date={date}
              yearMonthOpen={yearMonthOpen}
              handleYearMonthOpen={handleYearMonthOpen}
            />
          </div>
          <DefaultHorizontalCalendar date={date} handleDateChange={handleDateChange} />
        </S.DateSelectWrap>
        <S.ContentWrap>
          <S.SelectedDateWrap>
            <p>{DateKoreanFormatting(new Date(date.year, date.month - 1, date.day))}</p>
          </S.SelectedDateWrap>
          <p className="total-seed-quantity-text">총파종량</p>
          <S.TotalSeedQuantityValueWrap>
            <div className="row-layout">
              <p className="seed-quantity-value">{NumberFormatting(workHistoryListData?.total_seed_quantity)}</p>
              <p className="suffix-text">개</p>
            </div>
            {!!workHistoryListData && workHistoryListData?.total !== 0 && <div className="border-bottom" />}
          </S.TotalSeedQuantityValueWrap>
          {!!workHistoryListData && workHistoryListData?.total !== 0 ? (
            <>
              <S.WorkHistoryTextWrap>
                <p className="work-history-text">작업내역</p>
                <div className="work-history-count-wrap">
                  <p className="work-history-suffix-text">작업수 : 총</p>
                  <p className="work-history-text">{NumberFormatting(workHistoryListData?.total)}</p>
                  <p className="work-history-suffix-text">건</p>
                </div>
              </S.WorkHistoryTextWrap>
              <S.WorkHistoryListWrap>
                {workHistoryList.map((work) => {
                  return (
                    <S.WorkHistoryContent key={`work${work.id}`}>
                      <S.WorkInfo>
                        <S.CropImage isCropImage={!!work.crop_image}>
                          {!!work.crop_image ? (
                            <Image src={ImagePathCheck(work.crop_image)} layout="fill" alt="crop image" />
                          ) : (
                            <NoneIcon width={25} height={25} fill={"#BCBCD9"} />
                          )}
                        </S.CropImage>
                        <div className="text-wrap">
                          <p className="crop-text">
                            {work.crop_name} #{work.crop_kind}
                          </p>
                          <div className="count-text-wrap">
                            <p className="count-text">{NumberFormatting(work.seed_quantity)}</p>
                            <p className="suffix-text">개</p>
                          </div>
                          <div className="count-text-wrap seed-quantity-wrap">
                            <BoxIcon />
                            <p className="suffix-text seed-quantity-text">{NumberFormatting(work.tray_total)} 공</p>
                          </div>
                        </div>
                      </S.WorkInfo>
                      <div className="divider" />
                      <S.DateWrap>
                        <div className="date-row-layout">
                          <div className="category-box">
                            <p>파종일</p>
                          </div>
                          <p className="date-text">{DateDotFormatting(work.sowing_date)}</p>
                        </div>
                        <div className="date-row-layout">
                          <div className="category-box">
                            <p>출하일</p>
                          </div>
                          <p className="date-text">{DateDotFormatting(work.deadline)}</p>
                        </div>
                      </S.DateWrap>
                    </S.WorkHistoryContent>
                  );
                })}
                <div ref={ref} />
              </S.WorkHistoryListWrap>
            </>
          ) : (
            <p className="no-work-history">완료된 작업이 없습니다</p>
          )}
        </S.ContentWrap>
        <DefaultYearMonthList
          date={date}
          yearMonthOpen={yearMonthOpen}
          handleDateChange={handleDateChange}
          handleYearMonthOpen={handleYearMonthOpen}
        />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default WorkHistoryPage;
