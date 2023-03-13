import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTokenByTokenID } from '@app/utils/APIs/apis';

import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { RadioButton, RadioGroup } from '@app/components/common/Radio/Radio';
// import { DatePicker } from '@app/components/common/pickers/DatePicker';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import * as S from '../StepForm.styles';
import React from 'react';
import { Typography } from 'antd';
import { Spinner } from '@app/components/common/Spinner/Spinner';
import { Link } from 'react-router-dom';

export const TokenDetialsPage: React.FC = () => {
  const { t } = useTranslation();
  const tokenobj = useParams();
  const _id = useParams();
  const [loading, setLoading] = useState(false);
  const [currentTokenState, setCurrentTokenState] = useState<[]>([]);

  const [tokenSummary, setTokenSummary] = useState<[]>([]);

  useEffect(() => {
    const getCurrentTokenData = async () => {
      var tokenAddress = tokenobj.tokenobj;
      setCurrentTokenState([]);
      setLoading(true);
      var CurrentTokenData: any = await getTokenByTokenID(tokenAddress);

      console.log('this is currentToken Data', CurrentTokenData);
      if (CurrentTokenData.success == true) {
        // var unLock_Date = parseInt(CurrentTokenData.tokenData.unLock_Date * 1000)
        console.log('this is data retunrdd tokenData', CurrentTokenData.tokenData);
        // console.log("this is")

        setCurrentTokenState(CurrentTokenData.tokenData);
        setTokenSummary(CurrentTokenData.tokenSummary);
        setLoading(false);
      } else {
        setLoading(false);
        setCurrentTokenState([]);
      }
    };
    getCurrentTokenData();

    console.log('this si token Summary ', tokenSummary);
  }, []);

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            display: 'flex !important',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <Spinner size="large" />
        </Box>
      ) : (
        <>
          {/* un lock timing */}
          {/* <Box sx={{display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center",borderRadius : "10px", padding: "20px",marginBottom : "20px", maring : "20px", backgroundColor : "#25284b"}}>
                        
                        <Box sx={{display : 'flex', justifyContent : "center"}}>
                          <Typography>UnLock in</Typography>
                        </Box>
                        <Box sx={{display : 'flex', marginTop : "10px"}}>
                           <Box sx={{margin : "5px", backgroundColor : 'white', color : "black", padding : "10px", borderRadius : "2px", fontWeight : "bold"}}>12</Box>
                           <Box sx={{margin : "5px", backgroundColor : 'white', color : "black", padding : "10px", borderRadius : "2px", fontWeight : "bold"}}>22</Box>
                           <Box sx={{margin : "5px", backgroundColor : 'white', color : "black", padding : "10px", borderRadius : "2px", fontWeight : "bold"}}>20</Box>
                           <Box sx={{margin : "5px", backgroundColor : 'white', color : "black", padding : "10px", borderRadius : "2px", fontWeight : "bold"}}>35</Box>
                        </Box>
                          
                    </Box> */}

          {/* lock info */}
          <Box sx={{ borderRadius: '10px', padding: '20px', maring: '20px', backgroundColor: '#25284b' }}>
            <Box sx={{ borderBottom: '1px solid gray', paddingTop: '20px', paddingBottom: '20px' }}>
              <Typography>Lock Info</Typography>
            </Box>

            {tokenSummary.map((item: any, index: number) => {
              return (
                <Box
                  key={index + 1}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '300',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid gray',
                  }}
                >
                  <Typography key={index + 2}>{item.name}</Typography>
                  <Typography key={index + 3}>{item.value}</Typography>
                </Box>
              );
            })}
          </Box>

          {/* lock Infro  */}
          <Box
            sx={{
              borderRadius: '10px',
              padding: '20px',
              marginTop: '20px',
              maring: '20px',
              backgroundColor: '#25284b',
            }}
          >
            <Box sx={{ borderBottom: '1px solid gray', paddingTop: '20px', paddingBottom: '20px' }}>
              <Typography>Lock Record</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box
                sx={{
                  maxWidth: '100px',
                  minWidth: 'auto',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontWeight: '500',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                <Typography className="LockRecordTitle">Wallet</Typography>
              </Box>

              <Box
                sx={{
                  maxWidth: '100px',
                  minWidth: 'auto',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontWeight: '500',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                <Typography className="LockRecordTitle">Amount</Typography>
              </Box>

              <Box
                sx={{
                  maxWidth: '100px',
                  minWidth: 'auto',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontWeight: '500',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                <Typography className="LockRecordTitle">Cycle Release(%)</Typography>
              </Box>
              <Box
                sx={{
                  maxWidth: '100px',
                  minWidth: 'auto',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontWeight: '500',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                <Typography className="LockRecordTitle">TGE(%)</Typography>
              </Box>

              <Box
                sx={{
                  maxWidth: '100px',
                  minWidth: 'auto',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  fontWeight: '500',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                <Typography className="LockRecordTitle">Unlock time (UTC)</Typography>
              </Box>

              <Box
                sx={{
                  visibility: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '500',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                }}
              >
                <Button>View</Button>
              </Box>
            </Box>

            {currentTokenState.map((item: any, index: number) => {
              // console.log('thi sis data', currentTokenState)
              console.log('these are items007', currentTokenState);
              return (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }} key={index + 10}>
                  <Box
                    sx={{
                      maxWidth: '100px',
                      minWidth: 'auto',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontWeight: '500',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    }}
                    key={index + 9}
                  >
                    {/* <Box sx={{marginTop : "30px", fontWeight : "300"}} kye={index+99}>{item.walletAddress}</Box> */}
                    <Box sx={{ marginTop: '30px', fontWeight: '300' }} key={index + 20}>
                      {item.walletAddress}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      maxWidth: '100px',
                      minWidth: 'auto',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontWeight: '500',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    }}
                    key={index + 8}
                  >
                    <Box sx={{ marginTop: '30px', fontWeight: '300' }} key={index + 6}>
                      {item.total_Locked_Amount}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      maxWidth: '100px',
                      minWidth: 'auto',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontWeight: '500',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    }}
                    key={index + 15}
                  >
                    <Box sx={{ marginTop: '30px', fontWeight: '300' }} key={index + 6}>
                      {item.cycle_ReleasePercentage ? item.cycle_ReleasePercentage : '-'}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      maxWidth: '100px',
                      minWidth: 'auto',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontWeight: '500',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    }}
                    key={index + 25}
                  >
                    <Box sx={{ marginTop: '30px', fontWeight: '300' }} key={index + 6}>
                      {item.tGE_Percentage ? item.tGE_Percentage : '-'}
                    </Box>
                  </Box>

                  <Box
                    key={index + 5}
                    sx={{
                      maxWidth: '100px',
                      minWidth: 'auto',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontWeight: '500',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    }}
                  >
                    {/* <Box key={index+3} sx={{marginTop : "30px", fontWeight : "300"}}>{item.unLock_Date}</Box> */}
                    <Box key={index + 3} sx={{ marginTop: '30px', fontWeight: '300' }}>
                      {item.unLock_Date}
                    </Box>
                  </Box>

                  <Box
                    key={index + 2}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '500',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                    }}
                  >
                    <Link to={`/token/detail/${tokenobj.tokenobj}/${item._id}`} key={index + 1}>
                      View
                    </Link>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};
