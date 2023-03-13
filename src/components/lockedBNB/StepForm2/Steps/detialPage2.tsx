import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLockedBNbById } from '@app/utils/APIs/apis';

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
import { unLockSimpleBNB, unLockSimpleBNBVesting } from '@app/utils/hooks/pinkLock';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import { Modal } from '@app/components/common/Modal/Modal';

import { transferLockOwnerShipBNBFun } from '@app/utils/hooks/pinkLock';

export const LockedBNBPageDetialPage2: React.FC = () => {
  let navigate = useNavigate();

  const isWalletConnectedContext = useContext(AppCtx);
  const { t } = useTranslation();
  const _id = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentBNBState, setCurrentBNBState] = useState<[]>([]);
  const [isTimeTounLock, setisTimeTounLock] = useState(false);
  const [getCurrentDate, setCurrentDate] = useState();
  const [unLockDate, setUnlockDate] = useState();
  const [isTokenAbleToUnlock, setIsTokenAbleToUnlock] = useState(false);
  const [getunLockUnixTimeStamp, setUnlockUnixTimeStamp] = useState<number>();
  const [remainDate, setRemainDate] = useState<{ hours: string; minutes: string; seconds: string }>({
    hours: '0',
    minutes: '0',
    seconds: '0',
  });
  const [unLockID, setUnLockID] = useState<number>();
  const [timeToShowLockBtn, isTimeToShowLockBtn] = useState(false);
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<boolean>(false);
  const [ownerToUnlockToken, setOwnerToUnlockToken] = useState('');
  const [erorMessage, setErrMsg] = useState('');
  const [testTGEDate, setTGEDate] = useState<string>('');
  const [IsBasicAddressMatch, setIsBasicAddressMatch] = useState<boolean>(false);
  const [showError, setError] = useState<string>('');
  const [isLoading2, setIsLoading2] = useState(false);
  const [transFerLockInput, setTransferLockInput] = useState<string>('');
  const [lockOwner, setLockOwner] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [BNBID, setBNBID] = useState<string>('');
  const [isBNBUnLocked, setBnbUnLocked] = useState<any>(false);

  const inputTransferValue = (e: any) => {
    var value: string = e.target.value;

    console.log('this is transver Lock Value', value);
    setLockOwner(value);
    setTransferLockInput(value);
  };

  // transfer Lock OwnerShip function

  const transferLockBlockChainFun = async () => {
    try {
      var currentBNBID = _id.id;

      // setOwnerTransfered(false);
      setIsLoading2(true);
      setError('');

      var newOwner = transFerLockInput;
      var result: any = await transferLockOwnerShipBNBFun(currentBNBID, newOwner);

      if (result.success == true) {
        setTimeout(() => {
          // setOwnerTransfered(true);
          navigate('/bnb');
        }, 15000);
        setIsLoading2(false);
      } else {
        setIsLoading2(false);
        setError(result.msg);
      }
    } catch (err) {
      console.log('erro', err);
    }
  };

  // function to call Locked BNB while Loaindg Page
  const getCurrentBNBData = async () => {
    var currentTokenID: any = _id.id;
    var walletAddressPrm: any = _id.walletAddress;
    setWalletAddress(walletAddressPrm);
    setBNBID(currentTokenID);
    console.log('this is current Token ID', currentTokenID);
    setLoading(true);
    var currentTokenData: any = await getLockedBNbById(currentTokenID);

    console.log('this fetched Data', currentTokenData);

    if (currentTokenData.success == true) {
      setCurrentBNBState(currentTokenData.data);
      setLockOwner(currentTokenData.lockOwner);
      setTGEDate(currentTokenData.tgeDate);
      setOwnerToUnlockToken(currentTokenData.data[1].value);
      setLoading(false);
      setBnbUnLocked(currentTokenData.isBnbUnLocked);
      setUnlockUnixTimeStamp(Number(currentTokenData.unLockUnix));
      setUnLockID(currentTokenData.lockID);
      sessionStorage.setItem('unLockDate', currentTokenData.unLockUnix);
    } else {
      setLoading(false);
    }
  };

  // unlock token
  const unLockBTN = async () => {
    try {
      setIsLoading(true);
      setErrMsg('');
      var currentTokenID = _id.id;
      var lockID = unLockID;
      // console.log('this is id', _id)
      var unLockData: any = '';
      if (testTGEDate != '') {
        console.log('you are unlocking Vesting BNB');
        unLockData = await unLockSimpleBNBVesting(lockID, currentTokenID);
      } else {
        console.log('you are unlocking Simple BNB');
        unLockData = await unLockSimpleBNB(currentTokenID);
      }

      if (unLockData.success == true) {
        setIsLoading(false);
        setBnbUnLocked(true);
        getCurrentBNBData();
      } else {
        setBnbUnLocked(false);
        setErrMsg(unLockData.msg);
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

    nowDate = dateTime;

    setCurrentDate(dateTime);
  };

  setInterval(() => {
    currentDate();
  }, 1000);

  // use Effect used to run global function that call Locked BNB
  useEffect(() => {
    getCurrentBNBData();
  }, []);

  // useEffect when state udapte
  useEffect(() => {
    const countDownFun = () => {
      var unLockDate = sessionStorage.getItem('unLockDate');
      // console.log('unLockDate007786', Number(unLockDate), Number(getCurrentDate))

      if (Number(getCurrentDate) > Number(getunLockUnixTimeStamp)) {
        setIsTokenAbleToUnlock(true);

        var dateObj = { hours: '00', minutes: '00', seconds: '00' };
        setRemainDate(dateObj);
      } else {
        var newDate: any = Number(unLockDate);
        newDate = Number(getunLockUnixTimeStamp) - Number(getCurrentDate);

        // console.log('unLockDate007786', newDate)

        var date = new Date(Number(newDate) * 1000);

        var getHours = date.getUTCHours();
        var getMinutes = date.getUTCMinutes();
        var getSeconds = date.getUTCSeconds();

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
        }
        var dateObj: dateObj = { hours: hours, minutes: minutes, seconds: seconds };
        setRemainDate(dateObj);
        sessionStorage.setItem('unLockDate', newDate);
      }
    };

    countDownFun();

    const detectIfTokenRelatedToUse = () => {
      // detect the correct token of owner to unlock
      // console.log('wallet Connected successfully')\

      // console.log('this is the owner has access to unlockToken', ownerToUnlockToken)
      if (isWalletConnectedContext?.isWalletAddress == ownerToUnlockToken) {
        isTimeToShowLockBtn(true);
      } else {
        isTimeToShowLockBtn(false);
      }
    };

    if (isWalletConnectedContext?.isWalletConnected == true) {
      detectIfTokenRelatedToUse();
    }

    // console.log('this is getCurrentDate', getCurrentDate)
  }, [getCurrentDate, getunLockUnixTimeStamp, ownerToUnlockToken]);

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
                {remainDate?.hours}
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
                {remainDate?.minutes}
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
                {remainDate?.seconds}
              </Box>
              {/* <Box sx={{margin : "5px", backgroundColor : 'white', color : "black", padding : "10px", borderRadius : "2px", fontWeight : "bold"}}>{remainDate.getHours}</Box> */}
            </Box>
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

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              {currentBNBState.map((item: any, index: number) => {
                console.log('theser are items');
                // console.log('this is data', currentBNBState)
                return (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontWeight: '300',
                      paddingTop: '20px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid gray',
                    }}
                  >
                    <Typography key={index + 1}>
                      <span> {item?.name}</span>
                    </Typography>
                    <Typography key={index + 2}>{item.value ? item.value : '-'}</Typography>
                  </Box>
                );
              })}
            </Box>

            <p
              style={{
                marginTop: '20px',
                textAlign: 'center',
                color: 'red',
                fontSize: '14px',
                textTransform: 'uppercase',
              }}
            >
              {erorMessage}
            </p>

            {isWalletConnectedContext?.isWalletConnected ? (
              <>
                {isBNBUnLocked ? (
                  <></>
                ) : (
                  <>
                    {timeToShowLockBtn ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          borderBottom: '1px solid gray',
                          paddingTop: '20px',
                          paddingBottom: '20px',
                        }}
                      >
                        <Link to={`/extend-lock/bnb/${walletAddress}/${BNBID}`}>
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
                              {isLoading ? `UnLocking` : 'UnLock'}
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
                    ) : (
                      ''
                    )}
                  </>
                )}
              </>
            ) : (
              ''
            )}
          </Box>
        </>
      )}

      {/* model to transfer Lock OwnerShip */}

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
          <Input type="text" defaultValue={lockOwner} onChange={inputTransferValue} />
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
