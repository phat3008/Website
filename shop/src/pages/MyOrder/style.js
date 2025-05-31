import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: #fff;
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;

  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  }
`;

export const WrapperStyleHeaderDelivery = styled.div`
  background: #fff;
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;

  span {
    color: rgb(36, 36, 36);
    font-weight: 400;
    font-size: 13px;
  };
  margin-bottom: 4px;
`

export const WrapperLeft = styled.div`
  width: 910px;
`;

export const WrapperListOrder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
`;

export const WrapperFooterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
`;


export const WrapperItemOrder = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  padding: 16px;
  margin-top: 12px;
`;

export const WrapperPriceDiscount = styled.span``;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 84px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const WrapperRight = styled.div`
  width: 320px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

export const WrapperInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
  width: 100%;
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 17px 20px;
  background: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
`;

export const WrapperContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f9f9f9;
  display: flex;
  justify-content: center;
  padding: 40px 0;
`;

export const WrapperStatus = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;

  span {
    font-weight: 600;
    font-size: 14px;
  }

  div {
    font-size: 13px;
    color: #38383d;

    span {
      color: rgb(255, 66, 78);
      font-weight: 600;
      margin-right: 6px;
    }
  }
`;


export const WrapperHeaderItem = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;

  img {
    border: 1px solid rgb(238, 238, 238);
    padding: 2px;
    width: 70px;
    height: 70px;
    object-fit: cover;
  }

  div {
    width: 260px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span {
    font-size: 13px;
    color: #242424;
    margin-left: auto;
  }
`;
