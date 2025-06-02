import { Col } from "antd";
import styled from "styled-components";

export const WrapperProducts = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    flex: 1;
`
export const WrapperNavbar =styled(Col)`
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    width: 200px;
    flex-shrink: 0;
`
export const WrapperLayout = styled.div`
    display: flex;
    gap: 16px;
    align-items: flex-start;
    margin-top: 20px;
`
export const CardWrapper = styled.div`
    width: calc(25% - 12px);
    min-width: 200px;
    flex-grow: 1;
`