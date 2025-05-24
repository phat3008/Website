import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent"

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 30px;
    justify-content: flex-start;
    height: 45px;
`

export const WrapperButtonMore = styled(ButtonComponent)`
  border: 1px solid rgb(11, 116, 229);
  color: rgb(11, 115, 229);
  width: 240px;
  height: 38px;
  border-radius: 4px;

  &:hover {
    color: #fff;
    background: rgb(13, 92, 182);
    span {
        color: #fff
    }
  }
    weight: 100%;
    text-align: center;
    cursor: ${(props) => props.disable ? 'not-allowed' : 'pointer'}
`

export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    margin-top: 20px;
    flex-wrap: wrap;
`