import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTokenByID } from '@app/utils/APIs/apis';

import { Box } from '@mui/material';
import { Button } from '@app/components/common/buttons/Button/Button';
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
import { unLockToken, transferLockOwnerShip } from '@app/utils/hooks/pinkLock';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import { Modal } from '@app/components/common/Modal/Modal';
import Timer from '@app/components/common/Timer/Timer';
export const TokenDetialsPage2: React.FC = () => {
  let navigate = useNavigate();

  const isWalletConnectedContext = useContext(AppCtx);
  const { t } = useTranslation();
  const tokenobj = useParams();
  const _id = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [currentTokenState, setCurrentTokenState] = useState<any>('');
  // const [unlockDate , setUnlockDate] = useState("")
  const [tokenSummary, setTokenSummary] = useState<[]>([]);
  const [isTimeTounLock, setisTimeTounLock] = useState(false);
  const [getCurrentDate, setCurrentDate] = useState<any>();
  const [unLockDate, setUnlockDate] = useState();
  const [isTokenAbleToUnlock, setIsTokenAbleToUnlock] = useState(false);
  const [isTokenUnLocked, setIsTokenUnLocked] = useState(false);
  const [getunLockUnixTimeStamp, setUnlockUnixTimeStamp] = useState<number>();
  const [remainDate, setRemainDate] = useState<{ remainDays: string; hours: string; minutes: string; seconds: string }>(
    {
      remainDays: '0',
      hours: '0',
      minutes: '0',
      seconds: '0',
    },
  );
  const [unLockID, setUnLockID] = useState<number>();
  const [timeToShowLockBtn, isTimeToShowLockBtn] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<boolean>(false);
  const [isExtended, setExtended] = useState<boolean>(false);
  const [extenLockModel, setExtentLockModel] = useState<boolean>(false);
  const [timToCloseMDL, setTimToCloseMDL] = useState<boolean>(true);
  const [transFerLockInput, setTransferLockInput] = useState<string>('');
  const [showError, setError] = useState<string>('');
  const [isOwnerTransfered, setOwnerTransfered] = useState<boolean>(false);

  const [IsBasicAddressMatch, setIsBasicAddressMatch] = useState<boolean>(false);
  const [IsBasicModalVisible, setIsBasicModalVisible] = useState<boolean>(false);
  const [currentdataDBID, setCurrentDataDBID] = useState<string>('');
  const [currentTokenAddress, setCurrentTOkenAddress] = useState<string>('');

  // extend Lock button

  // transfer lock owner function (input detech)
  const inputTransferValue = (e: any) => {
    var value: string = e.target.value;

    console.log('this is transver Lock Value', value);
    setTransferLockInput(value);
  };

  const transferLockBlockChainFun = async () => {
    try {
      var currentTokenID = _id._id;
      var tokenAddress = _id.tokenobj;
      // console.log('parmAry', _id)
      setOwnerTransfered(false);
      setIsLoading2(true);
      setError('');

      var newOwner = transFerLockInput;
      var result: any = await transferLockOwnerShip(currentTokenID, unLockID, newOwner, tokenAddress);

      if (result.success == true) {
        setTimeout(() => {
          setIsLoading2(false);
          setOwnerTransfered(true);
          navigate('/token');
        }, 20000);
      } else {
        setIsLoading2(false);
        setError(result.msg);
      }
    } catch (err) {
      console.log('erro', err);
    }
  };

  // unlock token
  const unLockBTN = async () => {
    try {
      setIsLoading(true);
      var currentTokenID = _id._id;
      console.log('this is paramData', _id);
      var tokenAddress = _id.tokenobj;
      // console.log('this is isWalletConnectedContext', isWalletConnectedContext)
      // console.log("this is LockID", lockID)
      var unLockData = await unLockToken(currentTokenID, tokenAddress);

      if (unLockData.success == true) {
        // setTimeout(() => {
        //   navigate(`/token/detail/${tokenAddress}/${currentTokenID}`);
        // }, 5000);
        setIsLoading(false);
        setIsTokenUnLocked(true);
        getCurrentTokenData();
      } else {
        setIsTokenUnLocked(false);
        setIsLoading(false);
      }
    } catch (err) {
      console.log('this is erro', err);
    }
  };

  var nowDate: string;
  const currentDate = () => {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    var dateTime: any = date + ' ' + time;

    const dt = Date.parse(dateTime);
    dateTime = dt / 1000;

    // console.log('this is currentDate', dateTime)
    nowDate = dateTime;
    setCurrentDate(dateTime);
  };

  setInterval(() => {
    currentDate();
  }, 1000);

  // this function used to fetch current Token Data
  const getCurrentTokenData = async () => {
    setCurrentTOkenAddress('');
    var currentTokenID = _id._id;
    console.log('this is current Token ID', currentTokenID);
    setLoading(true);
    var currentTokenData: any = await getTokenByID(currentTokenID);

    if (currentTokenData.success == true) {
      console.log('this fetched Data', currentTokenData.data);

      setCurrentTokenState(currentTokenData.data);
      setLoading(false);
      setCurrentTOkenAddress(currentTokenData.currentTokenAddress);
      setCurrentDataDBID(currentTokenData.currentTokenID);
      setUnlockUnixTimeStamp(Number(currentTokenData.unLockDateUnix));
      setUnLockID(currentTokenData.data.lockID);
      sessionStorage.setItem('unLockDate', currentTokenData.unLockDateUnix);

      // if wallet address match with owner Address so show unlock btn
    } else {
      setLoading(false);
    }
  };

  // use Effect used to fetch locked Token Data
  useEffect(() => {
    getCurrentTokenData();
  }, []);

  // useEffect when state udapte
  useEffect(() => {
    const countDownFun = () => {
      var unLockDate = sessionStorage.getItem('unLockDate');
      // console.log('unLockDate007786', Number(unLockDate), Number(getCurrentDate))

      if (Number(getCurrentDate) > Number(getunLockUnixTimeStamp)) {
        setIsTokenAbleToUnlock(true);

        var dateObj = { remainDays: '00', hours: '00', minutes: '00', seconds: '00' };
        setRemainDate(dateObj);

        // var unLockedDate: any = new Date(Number(getunLockUnixTimeStamp) * 1000);
        // console.log('unLockedDate', unLockedDate);
      } else {
        var newDate: any = Number(unLockDate);
        newDate = Number(getunLockUnixTimeStamp) - Number(getCurrentDate);
        // console.log('unLockDate007786', newDate)

        var date = new Date(Number(newDate) * 1000);

        var getHours = date.getUTCHours();
        var getMinutes = date.getUTCMinutes();
        var getSeconds = date.getUTCSeconds();

        var remainDays: any = 0;

        var hours: any = getHours;
        if (getHours < 10) {
          hours = `0${getHours}`;
        }
        var minutes: any = getMinutes;
        if (minutes < 10) {
          minutes = `0${getMinutes}`;
        }
        var seconds: any = getSeconds;
        if (seconds < 10) {
          seconds = `0${getSeconds}`;
        }

        // console.log(`hours ${getHours}, Minutes ${minutes} seconds ${getSeconds}`)

        interface dateObj {
          hours: string;
          minutes: string;
          seconds: string;
          remainDays: string;
        }
        var dateObj: dateObj = { remainDays: remainDays, hours: hours, minutes: minutes, seconds: seconds };
        setRemainDate(dateObj);
        sessionStorage.setItem('unLockDate', newDate);
      }
    };

    countDownFun();

    const detectIfTokenRelatedToUse = () => {
      // detect the correct token of owner to unlock
      // console.log('wallet Connected successfully')
      console.log(isWalletConnectedContext?.isWalletAddress);
      if (isWalletConnectedContext?.isWalletAddress == currentTokenState.walletAddress) {
        isTimeToShowLockBtn(true);
      } else {
        isTimeToShowLockBtn(false);
      }
    };

    if (isWalletConnectedContext?.isWalletConnected == true) {
      detectIfTokenRelatedToUse();
    }
  }, [getCurrentDate, getunLockUnixTimeStamp, currentTokenState]);

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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '10px',
              padding: '20px',
              marginBottom: '20px',
              maring: '20px',
              backgroundColor: '#25284b',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Typography>UnLock in</Typography>
            </Box>
            <Box sx={{ display: 'flex', marginTop: '10px' }}>
              <Box
                sx={{
                  margin: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '10px',
                  borderRadius: '2px',
                  fontWeight: 'bold',
                }}
              >
                {remainDate.hours ? remainDate.hours : '00'}
              </Box>

              <Box
                sx={{
                  margin: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '10px',
                  borderRadius: '2px',
                  fontWeight: 'bold',
                }}
              >
                {remainDate.minutes ? remainDate.minutes : '00'}
              </Box>
              <Box
                sx={{
                  margin: '5px',
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '10px',
                  borderRadius: '2px',
                  fontWeight: 'bold',
                }}
              >
                {remainDate.seconds ? remainDate.seconds : '00'}
              </Box>
            </Box>
          </Box>

          {/* lock info */}
          <Box sx={{ borderRadius: '10px', padding: '20px', maring: '20px', backgroundColor: '#25284b' }}>
            <Box sx={{ borderBottom: '1px solid gray', paddingTop: '20px', paddingBottom: '20px' }}>
              <Typography>Token Info</Typography>
            </Box>

            {currentTokenState ? (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '300',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid gray',
                  }}
                >
                  <Typography>Token Address</Typography>
                  <Typography>{currentTokenState.tokenAddress}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '300',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid gray',
                  }}
                >
                  <Typography> Token Name </Typography>
                  <Typography>{currentTokenState.tokenName}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '300',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid gray',
                  }}
                >
                  <Typography> Token Symbol </Typography>
                  <Typography>{currentTokenState.tokenSymbol}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: '300',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                    borderBottom: '1px solid gray',
                  }}
                >
                  <Typography>Token Decimal</Typography>
                  <Typography>{currentTokenState.tokenDecimal}</Typography>
                </Box>
              </>
            ) : (
              ''
            )}
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
              <Typography>Lock Info</Typography>
            </Box>
            {/* {isTokenUnLocked ? <></>} */}

            {currentTokenState.isTokenUnlocked == true || isTokenUnLocked == true ? (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography>UnLocked at</Typography>
                    <Typography>{currentTokenState.unLock_Date}</Typography>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography>Title</Typography>
                    <Typography>{currentTokenState.lockTitle}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography>Total Amount Locked</Typography>
                    <Typography>
                      {currentTokenState.total_Locked_Amount} {currentTokenState.tokenSymbol}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography>Total Locked Value</Typography>
                    <Typography>
                      {currentTokenState.total_Locked_Value ? currentTokenState.total_Locked_Value : '0'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography>Owner</Typography>
                    <Typography>{currentTokenState.Owner}</Typography>
                  </Box>

                  {currentTokenState.tGE_Percentage ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: '300',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid gray',
                      }}
                    >
                      <Typography>TGE Percentage</Typography>
                      <Typography>{currentTokenState.tGE_Percentage}</Typography>
                    </Box>
                  ) : (
                    ''
                  )}
                  {currentTokenState.cycle_Days ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: '300',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid gray',
                      }}
                    >
                      <Typography>Cycle Days</Typography>
                      <Typography>{currentTokenState.cycle_Days}</Typography>
                    </Box>
                  ) : (
                    ''
                  )}

                  {currentTokenState.cycle_ReleasePercentage ? (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontWeight: '300',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                        borderBottom: '1px solid gray',
                      }}
                    >
                      <Typography>Cycle Percentage</Typography>
                      <Typography>{currentTokenState.cycle_ReleasePercentage}</Typography>
                    </Box>
                  ) : (
                    ''
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography>Lock Date</Typography>
                    <Typography>{currentTokenState.Lock_Date}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography>UnLock Date</Typography>
                    <Typography>{currentTokenState.unLock_Date}</Typography>
                  </Box>
                </Box>
              </>
            )}

            {/* message to show */}

            {isExtended ? (
              <>
                <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}> Lock Updated Successfully </p>
              </>
            ) : (
              ''
            )}
            {isOwnerTransfered ? (
              <>
                <p style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>
                  {' '}
                  Owner Transfered Successfully{' '}
                </p>
              </>
            ) : (
              ''
            )}

            {isWalletConnectedContext?.isWalletConnected ? (
              <>
                {timeToShowLockBtn ? (
                  <>
                    {currentTokenState.isTokenUnlocked == false ? (
                      <>
                        {isTokenUnLocked == true ? (
                          <></>
                        ) : (
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                borderBottom: '1px solid gray',
                                paddingTop: '20px',
                                paddingBottom: '20px',
                              }}
                            >
                              <Link to={`/extend-lock/token/${currentTokenAddress}/${currentdataDBID}`}>
                                <Button type="primary">Extend Lock</Button>
                              </Link>
                              <Link to="/" style={{ margin: '0px 10px' }}>
                                <Button type="primary">Home</Button>
                              </Link>

                              <Button type="primary" onClick={() => setIsBasicAddressMatch(true)}>
                                Transfer Lock Ownership
                              </Button>
                              {/* <Button type="primary" style={{margin : "0px 10px"}}>
                                  Upate
                                </Button> */}
                              {isTokenAbleToUnlock ? (
                                <>
                                  <Button
                                    type="primary"
                                    onClick={unLockBTN}
                                    style={{ margin: '0px 10px' }}
                                    loading={isLoading}
                                  >
                                    {isLoading ? 'UnLocking' : 'UnLock'}
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    type="ghost"
                                    style={{ border: '1px solid gray', color: 'gray', margin: '0px 10px' }}
                                  >
                                    Unlock
                                  </Button>
                                </>
                              )}
                            </Box>
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  ''
                )}
              </>
            ) : (
              ''
            )}
          </Box>
        </>
      )}

      {/* model */}
      <Modal
        centered
        open={IsBasicAddressMatch}
        onOk={() => setIsBasicAddressMatch(false)}
        onCancel={() => setIsBasicAddressMatch(false)}
        size="medium"
        className="warningModel"
        title="Transfer Lock Ownership"
      >
        <BaseForm.Item
          name="transferLockInput"
          // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
          style={{ fontSize: '20px', textAlign: 'center', margin: '0px' }}
        >
          <Input type="text" defaultValue={currentTokenState.Owner} onChange={inputTransferValue} />
        </BaseForm.Item>

        {showError ? <p style={{ textAlign: 'center', fontSize: '14px', color: 'red' }}>{showError}</p> : ''}

        <Box className="addressMatchBoxButtonBox">
          <Button style={{ margin: 'auto' }} onClick={transferLockBlockChainFun} loading={isLoading2}>
            Transfer Ownership
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};
