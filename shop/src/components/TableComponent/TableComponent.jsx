import { Table } from 'antd';
import React from 'react'
import Loading from '../../components/LoadingComponent/Loading'

const TableComponent = (props) => {
    const {selectionType = 'checkbox', data = [], isPending = false, columns = [] } = props

    // rowSelection object indicates the need for row selection
    const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
    }),
    };
    console.log('data', data)
    return (
        <Loading isPending={isPending}>
        <Table
            rowSelection={{ type: selectionType, ...rowSelection }}
            columns={columns}
            dataSource={data}
        />
        </Loading>
    )
    }

export default TableComponent