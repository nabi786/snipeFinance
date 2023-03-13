import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { UploadOutlined, InboxOutlined,CopyFilled,CopyOutlined } from '@ant-design/icons';
import { Input } from '@app/components/common/inputs/Input/Input';
import { InputPassword } from '@app/components/common/inputs/InputPassword/InputPassword';
import * as S from '../StepForm.styles';
import {Badge} from '@app/components/common/Badge/Badge' 
import { useState, useEffect } from 'react';
import {Box,Button} from '@mui/material'
import { Typography} from 'antd';
import {Grid } from '@mui/material'
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import { Link } from 'react-router-dom';
import binanceImg from 'assets/bsc.png';
import { useContext } from "react";
import AppCtx from '@app/components/context/MyContext';

import {currentTokenData} from "@app/utils/hooks/instances";
import { Spinner } from '@app/components/common/Spinner/Spinner';

import {getAllLockedBNB,   getAllTokensByChainID , getMyLockedTokens , getMyLockedBNB} from '@app/utils/APIs/apis'
import {GlobalSpinner} from '@app/components/common/GlobalSpinner';



interface Step4Props {
  searchBNBInput : VoidFunction;
  filteredBNbData : [];
  inputValueLength : number
}



export const Step1: React.FC<Step4Props> = ({searchBNBInput,filteredBNbData,inputValueLength}) => {
  const isWalletConnectedContext = useContext(AppCtx);
  const [isMyLockTokens, setIsMyLockTokens] = useState(true)
  const [allLockedToken, setAllLockedToken] = useState(false)
  const [boldBtn1, setBoldBtn1] = useState(true)
  const [boldBtn2, setBoldBtn2] = useState(false)
  const [itemLength, setitemLength] = useState(0)
  const [returnedTokensData, setReturnedTokensData] = useState<[]>([])
  const [totalPages, setTotalPages] = useState<number>(0);
  const [activeMyLoc, setActiveMyLoc] = useState<{}>({})
  const [tokenThatILocked, setTokensThatIlocked] = useState<[]>([])
  const [page, setPage] = useState(1);
  const [noData, setnoData] = useState("");
  const [loading, setLoading] = useState(false);
  




  interface Field {
    name?: string;
    value: string;
  }





  
  const acitiveBtn ={
    "fontWeight" : "bold"
  }




  // pagination handler
  const handleChange = async (event: React.ChangeEvent<unknown>, value: number) => {
    setReturnedTokensData([])
    setPage(value);
    setLoading(true)
    var pageNum = value;
    var tokensData:any = await getAllLockedBNB(pageNum)
    console.log('this is returned dta', tokensData)

    if(tokensData.success == true){

      setReturnedTokensData(tokensData.data);
      setTotalPages(tokensData.totalPages);
      setitemLength(tokensData.itemLength);
      console.log('page Value', value);
      setLoading(false)

    }
  };







  // my lock function
  const myLockFun = async ()=>{
    // setTokensThatIlocked([])
    setTokensThatIlocked([])
    setReturnedTokensData([])
    setLoading(true)
    setAllLockedToken(true)
    setBoldBtn1(false)
    setBoldBtn2(true)
    setIsMyLockTokens(false)
    setPage(1)

    console.log('I clicked on my lock btn')
    var pageNum = 1;
    const myLockedTokens:any = await getMyLockedBNB(pageNum)

    console.log('this is data after fetching api', myLockedTokens)
    
    if(myLockedTokens.success == true){
      if(myLockedTokens.data.length > 0){

        setTokensThatIlocked(myLockedTokens.data)
        setitemLength(myLockedTokens.itemLength)
        setTotalPages(myLockedTokens.totalPages)
        setLoading(false)
      }else{
          setnoData("no data found")
          setLoading(false)
      }
    }else{
      setLoading(false)
      setnoData("no data found")
      setitemLength(0)
    }
    
  }





  // fetch All Tokens
  const allTokens = async()=>{
    setReturnedTokensData([])
    setTokensThatIlocked([])
    setnoData("")
    setLoading(true)
    setAllLockedToken(false)
    setBoldBtn1(true)
    setBoldBtn2(false)
    setIsMyLockTokens(true)
    setPage(1)
    var pageNum:number = 1
    var tokensData:any = await getAllLockedBNB(pageNum)
    console.log('these are all token fetched', tokensData)
    if(tokensData.success == true){
      console.log('these are tokens', tokensData?.data)
        if(tokensData.data.length > 0){
          setReturnedTokensData(tokensData.data);
          setTotalPages(tokensData.totalPages);
          setitemLength(tokensData.itemLength)
          setLoading(false)
        }else{
          setLoading(false)
          setnoData("no data found")
        }
    }else{
      setLoading(false)
      setnoData("no data found")
    }
    
  }



  // color : "white", fontWeight : "bold"






// handle my lock pagination
const handleChange2 = async (event: React.ChangeEvent<unknown>, value: number) => {
  setTokensThatIlocked([])
  setPage(value);
  setLoading(true)
  var pageNum = value;
  const myLockedTokens:any = await getMyLockedBNB(pageNum)
  console.log('this is data after fetching api', myLockedTokens)
  if(myLockedTokens.success == true){

    setTokensThatIlocked(myLockedTokens.data)
    setitemLength(myLockedTokens.itemLength)
    setTotalPages(myLockedTokens.totalPages)
    setLoading(false)
  
  }
};








// get data of locked BNB 

  useEffect(() => {
    // function to get token by chainID
    async function getTokensByChainID(){

      try{

    
          setLoading(true)
          var pageNum:number = 1;
          var tokensData:any = await getAllLockedBNB(pageNum)
          console.log('this is returned dta', tokensData)
          if(tokensData.data.length > 0){

              setReturnedTokensData(tokensData.data);
              setTotalPages(tokensData.totalPages);
              setitemLength(tokensData.itemLength)
              setLoading(false)
          
          }else{
            
              setLoading(false)
              setnoData("no data found")
            
          }

      
    }catch(err){
        console.log('hereis the Error', err)
    }
    }
    getTokensByChainID()
    


  },[]);







  
  useEffect(()=>{


    async function getFilteredBNB(){
      setnoData("")
      setLoading(true)
      console.log('this si the length of inputVlaue', inputValueLength)
      if(inputValueLength > 0){

          setReturnedTokensData(filteredBNbData)

          if(filteredBNbData.length == 0){
              setnoData("no Data found")
          }

          setLoading(false)
        
      }else{
        

          if(filteredBNbData.length == 0){

            
            var tokensData:any = await getAllLockedBNB(1)
            console.log('this is returned dta', tokensData)
            if(tokensData.data.length > 0){
              
                setReturnedTokensData(tokensData.data);
                setTotalPages(tokensData.totalPages);
                setitemLength(tokensData.itemLength)
                setLoading(false)
            
              }else{
              
                setLoading(false)
                setnoData("no data found")
              
              }
              
          }else{
            setReturnedTokensData([])
            setTotalPages(0)
            setitemLength(0)
            setLoading(false)
            setnoData("no data found")
          }

      }

        

    }
    
    getFilteredBNB()



  },[filteredBNbData,inputValueLength])










  const { t } = useTranslation();
  console.log("returnedTokensData hale tho ",returnedTokensData)
  return (
  <>
    <S.FormContent>
      
      <BaseForm.Item
        name="Search"
      >
        <Input  placeholder='Search by BNB by address...'style={{fontWeight : "300"}} onChange={searchBNBInput}/>
      </BaseForm.Item>

      <Box sx={{display : "flex", justifyContent : "flex-end",marginBottom : "20px"}}>

        {
          boldBtn1 ?
          <>
          <Button sx={{ borderBottom : "1px dotted white", borderRadius : "0px",color : "white", fontWeight: "bold"}} onClick={allTokens}>
            All
          </Button>
          </>
          :
          <>
          <Button sx={{ borderBottom : "1px dotted white", borderRadius : "0px"}} onClick={allTokens}>
          All
          </Button>
          </>
        }

        {boldBtn2? 
        <>
          <Button sx={{marginLeft : "10px", borderBottom : "1px dotted white",color : "white", borderRadius : "0px", fontWeight: "bold"}} onClick={myLockFun}>
            My Lock
          </Button>
          </>
          :
          <>
          <Button sx={{marginLeft : "10px", borderBottom : "1px dotted white", borderRadius : "0px"}} onClick={myLockFun}>
            My Lock
          </Button>
          </>  
        }
       

      </Box>


      <Box sx={{ flexGrow: 1 }}>
        {/* section heading */}


      {/* this is spinner */}
      
          

       

            <Grid container spacing={2} sx={{justifyContent : "center"}}>
              <Grid item xs={4} sm={4}  md={4}>
                  
                     <Typography>BNB</Typography>

              </Grid>
              <Grid item xs={4} sm={4}  md={4}>
              
              <Typography>Amount</Typography>

              </Grid>
              <Grid item xs={4} sm={4}  md={4}>


              </Grid>
            </Grid>




            {/* section Body */}
          {
            loading ? 
            <Box sx={{display : "flex !important", justifyContent : "center", alignItems : "center", marginTop: "20px", marginBottom : "20px"}}>
              <Spinner size="large" />
            </Box>: ""
          }
            
        </Box>
    





    </S.FormContent>
    <div>



       {
       (returnedTokensData && isMyLockTokens) && returnedTokensData.map((item:any,index:number)=>{
              return (
                <Grid container spacing={2} sx={{justifyContent : "center", marginTop : "20px"}} key={index}>
                  <Grid item xs={4} sm={4}  md={4} key={index+1}>
                      
                        <Box sx={{display : "flex", marginRight : "10px"}} key={index+2}>
                            <Box sx={{width : "50px", height : "50px", overflow : "hidden", borderRadius : "50px", marginRight : "10px"}} key={index+3}>
                              <img style ={{width : "100%"}} src={binanceImg} key={index+4}/>
                            </Box>
                            <Box sx={{display : "flex",flexDirection : "column"}} key={index+5}>
                              <Typography  key={index+6}>{item.walletAddress} </Typography>
                              <span style={{fontWeight : "500", color : "rgb(213 213 213)"}}  key={index}>{item.network}</span>
                            </Box>
                        </Box>

                  </Grid>
                  <Grid item xs={4} sm={4}  md={4}  key={index+7}>
                  
                      <Typography  key={index+8}>{item.total_Locked_Amount}</Typography>

                  </Grid>
                  <Grid item xs={4} sm={4}  md={4} sx={{display : "flex", justifyContent : "flex-end"}}  key={index+9}>
              
                      <Link to={`/bnb/detail/${item.fullAddress}`} key={index+10}>View</Link>

                  </Grid>
                </Grid>
              )

            })
            
        }

        {
            
            (isMyLockTokens && itemLength) && totalPages> 1?
            <Stack spacing={2} sx={{marginTop : "10px"}} id="pagination">
              <Pagination count={totalPages} variant="outlined" shape="rounded" sx={{margin:"auto"}} page={page} onChange={handleChange} />
            </Stack>:""

        }

        {




// tokens that I locked
(tokenThatILocked && allLockedToken) && tokenThatILocked.map((item:any,index:number)=>{
             
  return (
    <Grid container spacing={2} sx={{justifyContent : "center", marginTop : "20px"}} key={index+9}>
      <Grid item xs={4} sm={4}  md={4} key={index+8}>
          
            <Box sx={{display : "flex", marginRight : "10px"}} key={index+7}>
                <Box sx={{width : "50px", height : "50px", overflow : "hidden", borderRadius : "50px", marginRight : "10px"}} key={index+6}>
                  <img style ={{width : "100%"}} src={binanceImg} key={index+10}/>
                </Box>
                <Box sx={{display : "flex",flexDirection : "column"}} key={index}>
                  <Typography  key={index}>{item.walletAddress} </Typography>
                  <span style={{fontWeight : "500", color : "rgb(213 213 213)"}}  key={index+5}> {item.network}  </span>
                </Box>
            </Box>

      </Grid>
      <Grid item xs={4} sm={4}  md={4}  key={index+4}>
      
          <Typography  key={index+3}> {item.total_Locked_Amount}  </Typography>

      </Grid>
      <Grid item xs={4} sm={4}  md={4} sx={{display : "flex", justifyContent : "flex-end"}}  key={index+1}>
        <Link to={`/bnb/detail/${item.fullAddress}`} key={index+1}>View</Link>
      
      </Grid>
      </Grid>
      )
    })

  }
              <Box sx={{display : "flex", justifyContent : "center", marginTop : "10px", marginBottom : "10px"}}>
                <span>{noData}</span>
              </Box>

          {
                  //  Pagination of my locked Tokens
                
                  (isMyLockTokens == false && itemLength) && totalPages> 1?
                  <Stack spacing={2} sx={{marginTop : "10px"}} id="pagination">
                    <Pagination count={totalPages} variant="outlined" shape="rounded" sx={{margin:"auto"}} page={page} onChange={handleChange2} />
                  </Stack>:""
              
          }
    </div>
    </>

  );
};



