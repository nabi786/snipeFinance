import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { UploadOutlined, InboxOutlined, CopyFilled, CopyOutlined } from '@ant-design/icons';
import { Input } from '@app/components/common/inputs/Input/Input';
import { InputPassword } from '@app/components/common/inputs/InputPassword/InputPassword';
import * as S from '../StepForm.styles';
import { Badge } from '@app/components/common/Badge/Badge';
import { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { Typography } from 'antd';
import { Grid } from '@mui/material';
// import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Spinner } from '@app/components/common/Spinner/Spinner';

import { QuestionCircleFilled } from '@ant-design/icons';

import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';

import { currentTokenData } from '@app/utils/hooks/instances';

import { getLockedBNbById } from '@app/utils/APIs/apis';

import { local } from 'web3modal';

interface iProps {
  addMaxAmmount: any;
  useVesting: boolean;
}

export const Step1: React.FC<iProps> = ({ addMaxAmmount, useVesting }) => {
  const isWalletConnectedContext = useContext(AppCtx);
  const [copyData, setcopyData] = useState('copy');
  const [displayCopySlug, setdisplayCopySlug] = useState('none');
  const [displayOwnerField, setdisplayOwnerField] = useState('none');
  // const [isOwnerField, setownerField]= useState<boolean>(false)
  const [invalidTokenErr, setinvalidTokenErr] = useState<any>('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBNBLock, setIsBNBLock] = useState(false);
  const [getCurrentTokenData, setCurrentTokenData] = useState<[]>([]);
  const [addressToCopy, setAddressToCopy] = useState('0x5E5b9bE5fd939c578ABE5800a90C566eeEbA44a5');
  const [apiLoader, setapiLoader] = useState<boolean>(false);

  const paramData = useParams();

  interface Field {
    name?: string;
    value: string;
  }

  const copyBtnFun = () => {
    navigator.clipboard.writeText('0x5E5b9bE5fd939c578ABE5800a90C566eeEbA44a5');
    setcopyData('copied');

    setInterval(() => {
      setcopyData('copy');
    }, 2000);
  };

  const copyBtnMouseOver = () => {
    setdisplayCopySlug('block');
  };

  useEffect(() => {
    if (paramData.name == 'token') {
      const changeTokenAddress = async () => {
        setinvalidTokenErr('');
        setapiLoader(true);
        var value = paramData.Addr;
        // setTokenAddress(value)
        console.log('this is value', value);

        if (isWalletConnectedContext?.isWalletConnected == true) {
          var currentTokenContract: any = await currentTokenData(value);
          console.log(currentTokenContract);
          if (currentTokenContract.success == false) {
            setinvalidTokenErr('invalid Token');
            setCurrentTokenData([]);
            // setapiLoader(false)
          } else {
            setCurrentTokenData(currentTokenContract.tokenData);
            setinvalidTokenErr('');
            setapiLoader(false);
          }
        } else {
          setCurrentTokenData([]);
        }
      };
      changeTokenAddress();
    }

    if (paramData.name == 'bnb') {
      const getBNBData = async () => {
        var bnbID = paramData.id;
        setapiLoader(true);

        var currentBNBData: any = await getLockedBNbById(bnbID);
        if (currentBNBData.success == true) {
          setapiLoader(false);
          setCurrentTokenData(currentBNBData.data);
        } else {
          setinvalidTokenErr(false);
        }
      };
      getBNBData();
    }
  }, []);

  useEffect(() => {
    function detechInnerWidth() {
      if (window.innerWidth < 600) {
        setAddressToCopy('0x5E....4a5');
      } else {
        setAddressToCopy('0x5E5b9bE5fd939c578ABE5800a90C566eeEbA44a5');
      }
    }

    // fetch token Token Data

    setInterval(() => {
      detechInnerWidth();
    }, 2000);
  }, []);

  const { t } = useTranslation();
  return (
    <S.FormContent>
      <Box
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          fontSize: '16px',
          marginBottom: '30px',
          borderBottom: '1px solid #5c5c5c',
          padding: '20px 10px',
          paddingTop: '0px',
        }}
      >
        <Typography>Edit Your Lock</Typography>
      </Box>

      <Box sx={{ marginBottom: '20px' }}>
        {getCurrentTokenData.map((item: Field, index: number) => {
          return (
            <Box
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                fontSize: '14px',
                margin: '5px,0px',
                borderBottom: '1px solid #5c5c5c',
                padding: '10px 10px',
              }}
            >
              <Box sx={{ width: '50%' }}>
                <Typography key={index + 1}>{item.name}</Typography>
              </Box>

              <Box sx={{ width: '50%', textAlign: 'right', fontWeight: '300' }}>
                <Typography key={index + 2}>{item.value ? item.value : '0'}</Typography>
              </Box>
            </Box>
          );
        })}

        {apiLoader ? (
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
          ''
        )}
      </Box>

      <Box sx={{ position: 'relative' }}>
        <BaseForm.Item name="Amount" label={t('Amount')} rules={[{ required: true, message: t('Amount is required') }]}>
          <Input placeholder="Enter Amount" />
          {/* <Button sx={{fontWeight : "bold",position : "absolute", top:"50%", right:"-20px", transform:"translate(-50%,-50%)"}} >MAX</Button> */}
        </BaseForm.Item>

        {paramData.name == 'bnb' ? (
          ''
        ) : (
          <Button
            sx={{
              fontWeight: 'bold',
              position: 'absolute',
              top: '59px',
              right: '-20px',
              transform: 'translate(-50%,-50%)',
            }}
            onClick={addMaxAmmount}
          >
            MAX
          </Button>
        )}
      </Box>
      {/* <span style={{fontSize : "10px", color : "#339CFD"}}>New Amount Should not be less than Current Amount</span> */}

      {/* <BaseForm.Item>
                <Checkbox onChange={useVestingFunction}/> <label style={{color : "#339CFD", fontWeight : "500", marginLeft : "5px", fontSize : "14px"}}>use Vesting?</label>
              </BaseForm.Item> */}

      {useVesting ? (
        <>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ position: 'relative' }}>
                  <BaseForm.Item
                    name="tgeDate"
                    label={t('TGE Date (UTC time)')}
                    rules={[{ required: true, message: t('TGE Date needs to be after now') }]}
                  >
                    <Input type="datetime-local" className="dateTimePicker" placeholder="Select Date" />
                  </BaseForm.Item>
                  <QuestionCircleFilled
                    title="on which date youw an to release tokens"
                    style={{
                      position: 'absolute',
                      top: '59px',
                      right: '0px',
                      transform: 'translate(-50%,-50%)',
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ position: 'relative' }}>
                  <BaseForm.Item
                    name="tgePercent"
                    label={t('TGE Percent')}
                    rules={[{ required: true, message: t('TGE Percent required') }]}
                  >
                    <Input placeholder="EX:10 " />
                  </BaseForm.Item>
                  <QuestionCircleFilled
                    style={{
                      position: 'absolute',
                      top: '59px',
                      right: '0px',
                      transform: 'translate(-50%,-50%)',
                      cursor: 'pointer',
                    }}
                    title="Percentage tokens that you want to release"
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ position: 'relative' }}>
                  <BaseForm.Item
                    name="CycleDays1"
                    label={t('Cycle Days')}
                    rules={[{ required: true, message: t('CycleDays required') }]}
                  >
                    <Input placeholder="EX:10" />
                  </BaseForm.Item>
                  <QuestionCircleFilled
                    title="cycle days"
                    style={{
                      position: 'absolute',
                      top: '59px',
                      right: '0px',
                      transform: 'translate(-50%,-50%)',
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Box sx={{ position: 'relative' }}>
                  <BaseForm.Item
                    name="cyclePercentage"
                    label={t('Cycle Release Percent')}
                    rules={[{ required: true, message: t('Cycle Release Percent required') }]}
                  >
                    <Input placeholder="EX:10" />
                  </BaseForm.Item>
                  <QuestionCircleFilled
                    title="how much percentage you want to release on every cycle day"
                    style={{
                      position: 'absolute',
                      top: '59px',
                      right: '0px',
                      transform: 'translate(-50%,-50%)',
                      cursor: 'pointer',
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      ) : (
        <>
          <BaseForm.Item
            name="LockTime"
            label={t('Lock until (UTC time)')}
            rules={[{ required: true, message: t('Unlock time needs to be after now') }]}
          >
            <Input type="datetime-local" className="dateTimePicker" placeholder="Select date" />
          </BaseForm.Item>
        </>
      )}

      <S.infoWrapper style={{ position: 'relative' }}>
        <span>
          Please exclude SNIPE's lockup address {addressToCopy}
          <span style={{ position: 'relative' }} className="copyBtn">
            <CopyOutlined
              style={{ color: '#0073de', fontSize: '16px' }}
              onClick={copyBtnFun}
              onMouseOver={copyBtnMouseOver}
            />
            <span className="CopyBtnValue">
              <Badge>{copyData}</Badge>
            </span>
          </span>
          from fees, rewards, max tx, dividends,etc to lock correctly the tokens. <br />
          SNIPE Lock doesn't support rebase tokens.
        </span>
      </S.infoWrapper>
    </S.FormContent>
  );
};
