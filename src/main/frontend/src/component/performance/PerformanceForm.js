import React,{ useState , useEffect } from 'react';
import axios from 'axios';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
 Panel, Pagination, Container, Button, Box, InputLabel, MenuItem,
 FormControl, Select, Stack, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function PerformanceForm(props) {

    // 1. 상태변수
    const [ rows, setRows ] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
    const[ type, setType ] = useState(props.type);

    // 2. fetchRows 메소드 생성
    // 생성이유: Controller랑 소통 창구 (Sortation: 1 - 생산실적, 2 - 판매실적)
    const fetchRows = (type, setRows) => {
        axios.get('/perform', { params: { type: type } })
            .then((r) => {
                    console.log(r);
                setRows(r.data);
            })
            .catch((error) => { //--- 에러 처리
                console.log(error);
            });
    };

    // 3. type 변경될 때 렌더링 진행
    useEffect(() => {
      fetchRows(type, setRows);
    }, [type]);

    // 4. 실적 출력 양식 [type: 1 - 생산실적, 2 - 판매실적]
    let columns;
    if( type === 1 ) {
        columns = [
            { field: 'prodName', headerName: '제품명', width: 200 },
            { field: 'prodPrice', headerName: '제품 가격', width: 200,
            valueFormatter: (params) => formatNumber(params.value)
            },
            { field: 'averageSalesPrice', headerName: '평균 판매 가격', width: 200,
            valueFormatter: (params) => formatNumber(params.value)
            },
            { field: 'totalOrderCount', headerName: '총 주문 수량', width: 200,
            valueFormatter: (params) => formatNumber(params.value)
            },
            { field: 'totalSalesAmount', headerName: '총 판매 금액', width: 200,
            valueFormatter: (params) => formatNumber(params.value)
            },
            { field: 'profit', headerName: '수익금', width: 200,
            valueFormatter: (params) => formatNumber(params.value)
            },
            { field: 'profitMargin', headerName: '수익률', width: 200
            },
        ];
    } else if( type === 2 ) {
        columns = [
            { field: 'prodName', headerName: '제품명', width: 200 },
            { field: 'prodPrice', headerName: '제품 가격', width: 200,
            valueFormatter: (params) => formatNumber(params.value) + '원'
            },
            { field: 'averageSalesPrice', headerName: '평균 판매 가격', width: 200,
            valueFormatter: (params) => formatNumber(params.value) + '원'
            },
            { field: 'totalOrderCount', headerName: '총 주문 수량', width: 200,
            valueFormatter: (params) => formatNumber(params.value) + '개'
            },
            { field: 'totalSalesAmount', headerName: '총 판매 금액', width: 200,
            valueFormatter: (params) => formatNumber(params.value) + '원'
            },
            { field: 'profit', headerName: '수익금', width: 200,
            valueFormatter: (params) => formatNumber(params.value) + '원'
            },
            { field: 'profitMargin', headerName: '수익률', width: 200,
            valueFormatter: (params) => params.value + '%'
            },
        ];
    }

    // 숫자 리모델링 함수 생성(1,000 단위 기준으로 표기)
    function formatNumber(value) {
    if (typeof value !== 'number') { return value; }
        return value.toLocaleString();
    }

    return(<>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={type === 1 ? ((row) => row.prodName) : ((row) => row.prodName) }
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
            pageSizeOptions={[5, 10]}
            />
        </div>
    </>);
}