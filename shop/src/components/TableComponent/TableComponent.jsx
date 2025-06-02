import { Table, Button } from 'antd';
import React, { useRef, useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { useDownloadExcel } from 'react-export-table-to-excel';

const TableComponent = (props) => {
    const {
        selectionType = 'checkbox',
        data = [],
        isPending = false,
        columns = [],
        handleDeleteMany,
    } = props;

    const [rowSelectedKeys, setRowSelectedKeys] = useState([]);
    const tableRef = useRef(null);

    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'data_export',
        sheet: 'data_sheet',
    });

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys);
        },
    };

    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys);
    };

    return (
        <Loading isPending={isPending}>
            {rowSelectedKeys.length > 0 && (
                <div
                    style={{
                        background: '#1d1ddd',
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '10px',
                        cursor: 'pointer',
                    }}
                    onClick={handleDeleteAll}
                >
                    Xóa tất cả
                </div>
            )}

            <Button onClick={onDownload} type="primary" style={{ marginBottom: 16 }}>
                Export Excel
            </Button>

            <div style={{ overflowX: 'auto' }}>
                <table ref={tableRef} style={{ display: 'none' }}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.key || col.dataIndex}>{col.title}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* {data.map((item, rowIndex) => (
                            <tr key={item._id || rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={col.key || col.dataIndex}>
                                        {col.render
                                            ? col.render(item[col.dataIndex], item, rowIndex)
                                            : item[col.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </div>

            <Table
                rowSelection={{ type: selectionType, ...rowSelection }}
                columns={columns}
                dataSource={data}
                rowKey="_id"
                {...props}
            />
        </Loading>
    );
};

export default TableComponent;
