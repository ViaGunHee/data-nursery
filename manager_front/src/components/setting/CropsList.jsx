import React, { useCallback, useState } from "react";
import styled from "styled-components";

import useCropList from "@src/hooks/queries/crop/useCropList";
import useDeleteMultipleCrop from "@src/hooks/queries/crop/useDeleteMultipleCrop";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import AddCropsModal from "./AddCropsModal";
import CropsOptionModal from "./CropsOptionModal";
import CropsDeleteModal from "./CropsDeleteModal";
import EditCropsModal from "./EditCropsModal";

import AddIcon from "@images/management/add-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import OptionDot from "@images/common/option-dot-icon.svg";
import PlantIcon from "@images/setting/plant-no-data.svg";
import DeleteIcon from "@images/setting/icon-delete.svg";
import { cropListKey } from "@src/utils/query-keys/CropQueryKeys";

const S = {
  Wrap: styled.div`
    width: 30%;

    .modal-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000040;
      z-index: 1;
    }
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 36px 0px;
    border-bottom: 1px solid ${({ theme }) => theme.basic.recOutline};
  `,
  Title: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    .title {
      color: ${({ theme }) => theme.basic.deepBlue};
      ${({ theme }) => theme.textStyle.h4Bold}
    }
    .sub-title {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h6Reguler};
    }
  `,
  AddButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border-radius: 8px;
    background-color: #5899fb;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    width: 172px;
    border: 1px solid ${({ theme }) => theme.primery.primery};

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.btnAction};
    }
  `,
  ContentList: styled.div`
    .table-header {
      padding: 6px 32px 6px 24px;
      margin-top: 16px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler}
      }

      svg {
        cursor: pointer;
      }

      .btn-wrap {
        width: 100%;
      }
    }
  `,
  ListBlockWrap: styled.div`
    height: 368px;
    overflow-y: auto;
    padding-right: 24px;

    .selected {
      border: 1px solid ${({ theme }) => theme.primery.primery};
    }

    .list-inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .option-modal-wrap {
      position: relative;
    }
  `,
  ListBlock: styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 16px 32px 16px 24px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    border-radius: 8px;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h7Bold}
    }

    svg {
      cursor: pointer;
    }

    .option-dot {
      cursor: pointer;
    }

    .crops_color {
      width: 32px;
      height: 32px;
      border-radius: 30px;
    }
  `,
  EmptyData: styled.div`
    height: 420px;
    margin-top: 168px;
    gap: 14px;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h5Reguler}
    }
  `,
  SelectDeleteBtn: styled.div`
    border-radius: 8px;
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.primery.primery};
    display: flex;
    gap: 6px;
    height: 32px;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    margin-left: 16px;

    p {
      color: ${({ theme }) => theme.blackWhite.white} !important;
      ${({ theme }) => theme.textStyle.h7Bold};
    }
  `,
};

function CropsList() {
  const invalidateQueries = useInvalidateQueries();

  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });

  //작물 추가 모달 오픈
  const [addCropsModalOpen, setAddCropsModalOpen] = useState(false);

  //작물 삭제 모달 오픈
  const [deleteCropsModalOpen, setDeleteCropsModalOpen] = useState({
    open: false,
    deleteId: undefined,
  });

  //작물 수정 모달 오픈
  const [editCropsModalOpen, setEditCropsModalOpen] = useState({
    open: false,
    data: undefined,
  });

  // 체크박스 선택 목록
  const [checkArray, setCheckArray] = useState([]);

  // 작물 목록 API
  const { data: cropList } = useCropList({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 작물 다중 삭제 API
  const { mutate: deleteMultipleCropMutate } = useDeleteMultipleCrop(
    () => {
      // 작물목록 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([cropListKey]);
      setCheckArray([]);
    },
    (error) => {
      alert(error);
    },
  );

  // 작물목록 : 눌렀을때 나오는 모달
  const handleCropsOptionModalClick = useCallback(
    (index, data) => {
      if (optionModalOpen.open === true) {
        setOptionModalOpen({ open: false, index: undefined, data: undefined });
      } else if (optionModalOpen.open === false) {
        setOptionModalOpen({ open: true, index: index, data: data });
      }
    },
    [optionModalOpen],
  );

  // 체크박스 전제 선택 및 전체 해제
  const toggleAll = useCallback(
    (isAllCheck) => {
      if (isAllCheck) {
        // 전부 체크되어 있는 경우
        setCheckArray([]);
      } else {
        // 전부 체크 안되어 있는 경우
        const allCheckArray = [];

        cropList?.crops.map((crop) => {
          allCheckArray.push(crop.id);
        });

        setCheckArray(allCheckArray);
      }
    },
    [cropList],
  );

  const toggleItem = useCallback(
    (isCheck, id) => {
      if (isCheck) {
        // 체크된 항목 클릭 시
        setCheckArray(checkArray.filter((checkId) => checkId !== id));
      } else {
        // 미체크된 항목 클릭 시
        setCheckArray((prev) => [...prev, id]);
      }
    },
    [checkArray],
  );

  return (
    <S.Wrap>
      <S.TitleWrap>
        <S.Title>
          <p className="title">작물목록</p>
          <p className="sub-title">작물목록 추가, 변경</p>
        </S.Title>
        <S.AddButton
          onClick={() => {
            setAddCropsModalOpen(true);
          }}>
          <AddIcon width={24} height={24} />
          <p>작물 추가</p>
        </S.AddButton>
      </S.TitleWrap>
      <S.ContentList>
        {cropList?.crops.length === 0 ? (
          <S.EmptyData>
            <PlantIcon width={56} height={56} />
            <p>등록된 작물이 없습니다.</p>
          </S.EmptyData>
        ) : (
          <>
            <div className="table-header">
              <div>
                {checkArray.length !== 0 && checkArray.length === cropList?.crops.length ? (
                  <CheckBoxOn
                    width={24}
                    height={24}
                    onClick={() => {
                      toggleAll(true);
                    }}
                  />
                ) : (
                  <CheckBoxOff
                    width={24}
                    height={24}
                    onClick={() => {
                      toggleAll(false);
                    }}
                  />
                )}
              </div>
              {checkArray.length === 0 ? (
                <>
                  <p>NO</p>
                  <p>작물명</p>
                  <p></p>
                  <p></p>
                </>
              ) : (
                <>
                  <div className="btn-wrap">
                    <S.SelectDeleteBtn
                      onClick={() => {
                        deleteMultipleCropMutate({
                          data: {
                            deleteCrop: checkArray.join("||"),
                          },
                        });
                      }}>
                      <DeleteIcon width={12} height={12} />
                      <p>선택삭제</p>
                    </S.SelectDeleteBtn>
                  </div>
                </>
              )}
            </div>
            <S.ListBlockWrap>
              <div className="list-inner">
                {cropList?.crops.map((crop, index) => {
                  return (
                    <S.ListBlock
                      key={`crop${crop.id}`}
                      className={`table-row ${checkArray.includes(crop.id) ? "selected" : ""}`}>
                      {checkArray.includes(crop.id) ? (
                        <CheckBoxOn width={24} height={24} onClick={() => toggleItem(true, crop.id)} />
                      ) : (
                        <CheckBoxOff width={24} height={24} onClick={() => toggleItem(false, crop.id)} />
                      )}
                      <p>{index + 1}</p>
                      <div className="crops_color" style={{ backgroundColor: crop.color }} />
                      <p>{crop.name}</p>

                      <div className="option-modal-wrap">
                        <div
                          className="option-dot"
                          onClick={() => {
                            handleCropsOptionModalClick(index, crop);
                          }}>
                          <OptionDot width={32} height={32} />
                        </div>
                        {index === optionModalOpen.index && (
                          <CropsOptionModal
                            optionModalOpen={optionModalOpen}
                            setOptionModalOpen={setOptionModalOpen}
                            setDeleteCropsModalOpen={setDeleteCropsModalOpen}
                            setEditCropsModalOpen={setEditCropsModalOpen}
                          />
                        )}
                      </div>
                    </S.ListBlock>
                  );
                })}
              </div>
            </S.ListBlockWrap>
          </>
        )}
      </S.ContentList>

      {/* 작물추가 모달 */}
      {addCropsModalOpen && (
        <div className="modal-wrap">
          <AddCropsModal addCropsModalOpen={addCropsModalOpen} setAddCropsModalOpen={setAddCropsModalOpen} />
        </div>
      )}

      {/* 작물삭제 모달 */}
      {deleteCropsModalOpen.open && (
        <div className="modal-wrap">
          <CropsDeleteModal
            deleteId={deleteCropsModalOpen.deleteId}
            setDeleteCropsModalOpen={setDeleteCropsModalOpen}
          />
        </div>
      )}

      {/* 작물수정 모달 */}
      {editCropsModalOpen.open && (
        <div className="modal-wrap">
          <EditCropsModal editCropsModalOpen={editCropsModalOpen} setEditCropsModalOpen={setEditCropsModalOpen} />
        </div>
      )}
    </S.Wrap>
  );
}

export default CropsList;
