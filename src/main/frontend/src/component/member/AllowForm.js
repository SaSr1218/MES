import React,{ useState , useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
 Panel, Pagination, Container, Button, Box, InputLabel, MenuItem,
 FormControl, Select, Stack, TextField } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

export default function AllowForm(props) {
// 생성이유: 폼 유지보수가 필요한 경우, 1회 수정으로 작업 완료 칠 수 있음
// (동일 폼 100개 있다고 생각하자)

    // 1-1. 상태변수 선언[ 결재 리스트 관리 Controller get으로 받아서 초기화 예정 / DataGrid 적용 ]
    const [ rows, setRows ] = useState([]);
    const [rowSelectionModel, setRowSelectionModel] = React.useState([]);

    // 1-2. 상태변수 선언[ 타입 관리 : 1-자재, 2-제품, 3-판매 ]
    // 어떻게 사용? props로 받아서 분리 시키자 (초기값 1로 세팅)
    const [ type, setType ] = useState(props.type);
        // console.log(type); // --- 확인 완료

    // 2. fetchRows 메소드 생성
    // 생성 이유: axios.get('/allowApproval') 여러차례 사용되기 때문에 메소드 추가 정의함
    const fetchRows = (type, setRows) => {
        axios.get('/allowApproval', { params: { type: type } })
            .then((r) => {
                    console.log(r);
                setRows(r.data);
            });
    };

    // 3. type 변경될 때 렌더링 진행
    useEffect(() => {
      fetchRows(type, setRows);
    }, [type]);

    // 4. 승인 처리 (폼에서 진행)
    const approveHandler = (e) => {
        const selectedIds = rowSelectionModel.map((id) => id);
            console.log(selectedIds);
        axios.put('/allowApproval', { type: type, approve: 1, id: selectedIds })
            .then((response) => {
                // 승인 요청 후 서버 응답에 따른 처리
                fetchRows(type, setRows);
            })
            .catch((error) => { //--- 에러 처리
                console.log(error);
            });
    }

    // 5. 반려 처리 (폼에서 진행)
    const rejectHandler = (e) => {
        const selectedIds = rowSelectionModel.map((id) => id);
            console.log(selectedIds);
        axios.put('/allowApproval', { type: type, approve: 2, id: selectedIds })
            .then((response) => {
                // 승인 요청 후 서버 응답에 따른 처리
                fetchRows(type, setRows);
            })
            .catch((error) => {//--- 에러 처리
                console.log(error);
            });
    }

    // 6. 결재 출력 양식 [type: 1 자재, 2 제품, 3 판매]
    let columns;
    if( type === 1 ){ // --- 자재
        columns = [
            { field: 'materialEntity.mat_name', headerName: '내용', width: 400,
              valueGetter: (params) => {
                 const { mat_in_type, materialEntity } = params.row;
                 const prefix = mat_in_type > 0 ? '입고 ' : mat_in_type < 0 ? '출고 ' : '기타';
                 return `${materialEntity.mat_name} ${prefix}`;
               }
             },
            { field: 'udate', headerName: '요청일자', width: 300 },
            { field: 'allowApprovalEntity.al_app_whether', headerName: '승인여부', width: 300,
              valueGetter: (params) => params.row.allowApprovalEntity.al_app_whether ? '승인완료' : '반려'
            },
        ]

    } else if( type === 2 ){ // --- 제품

    } else if( type === 3){ // --- 판매

    }

    // --------------------------------- 출력부 ---------------------------------
    return(<>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button sx={{ padding: '10px', margin: '10px 20px' }} variant="contained"
                type ="button"
                onClick={approveHandler}
                disabled={ rowSelectionModel.length === 0 ? true : false }
            >
                승인
            </button>

            <button sx={{ padding: '10px', margin: '10px 20px' }} variant="contained"
                type ="button"
                onClick={rejectHandler}
                disabled={ rowSelectionModel.length === 0 ? true : false }
            >
                반려
            </button>
        </Box>
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.mat_in_outid}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={(newRowSelectionModel) => {
                setRowSelectionModel(newRowSelectionModel);
            }}
            />
        </div>
    </>);
}
