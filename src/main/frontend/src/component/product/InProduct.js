import React, {useState, useEffect} from 'react';
import axios from 'axios'

import TextField from '@mui/material/TextField'; //텍스트 필드
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

export default function InProduct(props){ //제품 추가 부분
    let [company , setCompany] = useState([])
    let matIDList = props.material; //매개변수로 받은 선택받은 제품의 리스트

    console.log(matIDList);

    //회사 정보를 가져오는 useEffect
     useEffect( ()=>{
        axios.get('/materials/getcompany')
          .then( r => {
                console.log(r)
                setCompany(r.data)
            } )
     }, [] )

    const companyChangeHandler = (e) => { //회사 변경 이벤트 처리(select)
        console.log(e.target.value)
        setCompany(e.target.value);
    }

    //제품 등록
    const createProduct = () => {
        let info ={
            prod_code : 'C',
            prod_name : document.getElementById('prodName').value,
            prod_price : document.getElementById('prodPrice').value,
            cno : company
        }

        console.log(info)
    }

    //작업 취소
    const cancel = () => {
        company = 0
        document.getElementById('prodName').value = ''
        document.getElementById('prodPrice').value = ''
    }

    return(<>
        <Container>
                <div>
                  <FormControl style={{ width : '100px' , margin : '20px 0px'}}>
                    <InputLabel id="demo-simple-select-label">회사</InputLabel>
                    <Select value={ company } label="카테고리" onChange={ handleChange } >
                        <MenuItem value={0}>회사</MenuItem>
                        {
                            company.map( (c) => {
                                return   <MenuItem value={c.cno}>{ c.cname }</MenuItem>
                            })
                        }
                    </Select>
                  </FormControl>
                </div>

               <div>
                  <TextField style={{padding : '10px', margin : '10px'}} className="prodCode" id="prodCode" label="제품코드" variant="outlined" value={'C'}/>
                  <TextField style={{padding : '10px', margin : '10px'}} className="prodName" id="prodName" label="제품명" variant="outlined" />
                  <TextField style={{padding : '10px', margin : '10px'}} className="prodPrice" id="prodPrice" label="제품가격" variant="outlined" />
               </div>

              <div>
                    <button type ="button" onClick={createProduct}>제품 등록</button>
                    <button type ="button" onClick={cancel}>작업 취소</button>
              </div>
        </Container>
    </>)

}