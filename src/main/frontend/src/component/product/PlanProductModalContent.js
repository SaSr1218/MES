import React, {useState, useEffect} from 'react';
import axios from 'axios'

/* -------------- mui -------------- */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

export default function PlanProductModalContent(props){ //생산 지시 모달 부분
    let[pageInfo, setPageInfo] = useState({"page" : 1, "key" : '', "keyword" : ''}) //검색기능과 페이지네이션을 위해

    const[planProduct, setPlanProduct] = useState([]);

    // 상위 컴포넌트에서 gopPlanProduct 상태 변수와 setGopPlanProduct 상태 설정 함수를 초기화합니다.
    const [gopPlanProduct, setGopPlanProduct] = useState([]);
    const [prevGop, setPrevGop] = useState(1); // 이전 gop 값 초기화

    let[totalPage, setTotalPage] = useState(1); //총 페이지수
    let[totalCount, setTotalCount] = useState(0); //총 몇개의 제품


    useEffect(() => { // props로 (시작시) 제품 정보 가져오기 (props가 바뀌면 다시 가져온다.)
       console.log(props.planProdId)
       existMat();
    }, [props.planProdId])

    const existMat = () => {
         axios.get('/planProduct/existMaterialsList', {params : {prodId : props.planProdId}})
            .then( r => {
                console.log(r.data);
                setPlanProduct(r.data)
                setGopPlanProduct(r.data)
            })
    }

    const inputMaterial = (event, matId) => { //해당 자재별 비율 값을 바꿔주는(제품 수 곱하기)
        console.log(matId);
    }

    const onPlanProduct = () => { //생산 지시 axios
        let info = {
            productEntity : planProduct,
            prodPlanCount : document.querySelector('.prodCount').value
        }

        axios.post('/planProduct', info)
            .then(r => {
                if(r.data == true){
                    props.closeModal();
                }
            })
    }

    //페이지 선택
   const selectPage = (event , value) => {
        console.log(value); //
        pageInfo.page = value;
        setPageInfo({...pageInfo});
    }

    //검색
    const onSearch = () => {
        pageInfo.key = document.querySelector('.key').value; //검색할 대상
        pageInfo.keyword = document.querySelector('.keyword').value; //검색 값
        pageInfo.page = 1; //페이지 1
        console.log("key : " + pageInfo.key + " " + "keyword : " + pageInfo.keyword)

        setPageInfo({...pageInfo})
    }


    //지시 수량 입력
    const planInPut = (event) => {
      let gop = event.target.value;

      setGopPlanProduct(planProduct);

      if (gop > 0) {
        setPrevGop(gop); // 현재 gop 값을 이전 gop으로 저장

        let updatedGopPlanProduct = planProduct.map(k => ({
          ...k,
          ratio: k.ratio * Number(gop),
        }));

        setGopPlanProduct(updatedGopPlanProduct);
      }
    }

    return(<>
        <div>
            <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 700 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" style={{ width:'5%' }}>등록번호</TableCell>
                            <TableCell align="center" style={{ width:'15%' }}>자재명</TableCell>
                            <TableCell align="center" style={{ width:'10%' }}>원가</TableCell>
                            <TableCell align="center" style={{ width:'10%' }}>단위</TableCell>
                            <TableCell align="center" style={{ width:'10%' }}>유통기한(Day)</TableCell>
                            <TableCell align="center" style={{ width:'10%' }}>생산자</TableCell>
                            <TableCell align="center" style={{ width:'15%' }}>구입일</TableCell>
                            <TableCell align="center" style={{ width:'5%' }}>코드</TableCell>
                            <TableCell align="center" style={{ width:'20%' }}>입고량</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {planProduct.map((e) => (
                            <TableRow>
                             <TableCell align="center" >{e.matID}</TableCell>
                             <TableCell align="center" >{e.mat_name}</TableCell>
                             <TableCell align="center" >{e.mat_price}</TableCell>
                             <TableCell align="center" >{e.mat_unit}</TableCell>
                             <TableCell align="center" >{e.mat_st_exp}</TableCell>
                             <TableCell align="center" >{e.companyDto.cname}</TableCell>
                             <TableCell align="center" >{e.mdate}</TableCell>
                             <TableCell align="center" >{e.mat_code}</TableCell>
                             <TableCell align="center" ><input style={{padding : '7px', margin : '3px'}} className={'matRate'+e.matID} id={'matRate'+e.matID} placeholder="비율"
                                     onChange={(event) => inputMaterial(event, e.matID)}
                                     value={gopPlanProduct.find(v => v.matID == e.matID).ratio}/></TableCell>
                             </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                     <Container>
                        <div style={{display : 'flex' , justifyContent : 'center', margin : '10px 0px 10px 0px'}}>
                              <Pagination count={totalPage}  color="primary" onChange={selectPage}/>
                        </div>
                        <div style={{display : 'flex' , justifyContent : 'center', marginBottom: '20px'}}>
                               <input type="text" className="keyword" />
                               <button type="button" onClick={onSearch}> 검색 </button>
                        </div>
                        <div style={{display : 'flex' , justifyContent : 'center', marginBottom: '20px'}}>
                            <h5>생산할 제품의 수를 입력해주세요.</h5>
                        </div>
                        <div style={{display : 'flex' , justifyContent : 'center', marginBottom: '20px'}}>
                            <TextField style={{padding : '5px', margin : '5px'}} className="prodCount" id="prodCount" label="지시수량" variant="outlined" onChange={(event) => planInPut(event)}/>
                            <Button variant="contained" disableElevation onClick={onPlanProduct}>제품 생산지시</Button>
                        </div>
                    </Container>
            </div>
    </>)
}