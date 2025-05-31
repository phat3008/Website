import styled from "styled-components";

export const WrapperHeaderUser = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

export const WrapperInfoUser = styled.div`
  width: 32%;
  background-color: #fff;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

export const WrapperLabel = styled.div`
  font-weight: 600;
  margin-bottom: 8px;
`;

export const WrapperContentInFo = styled.div`
  font-size: 14px;
  color: #38383d;

  .name-info {
    font-weight: bold;
    margin-bottom: 4px;
  }

  .address-info,
  .phone-info,
  .delivery-info,
  .delivery-fee,
  .payment-info,
  .status-payment {
    margin-bottom: 4px;
  }

  .name-delivery {
    color: orange;
    font-weight: 600;
    margin-right: 4px;
  }

  .status-payment {
    color: orange;
    font-weight: 600;
  }
`;

export const WrapperStyleContent = styled.div`
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
`;

export const WrapperItemLabel = styled.div`
  width: 200px;
  &:last-child{
    font-weight: bold;
  }
`;

export const WrapperProduct = styled.div`
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  justify-content: space-between;
`;

export const WrapperNameProduct = styled.div`
  display: flex;
  align-items: center;
  width: 610px;
`;

export const WrapperItem = styled.div`
  width: 200px;
  font-weight: bold;
  &: last-child {
  color: red
  }
`;

export const WrapperAllPrice = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end
`
