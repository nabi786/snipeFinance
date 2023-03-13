import { useTranslation } from 'react-i18next';
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
import { Checkbox } from '@app/components/common/Checkbox/Checkbox';
// import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Select, Option } from '@app/components/common/selects/Select/Select';

import { getLockFeeDetails } from '@app/utils/hooks/pinkLock';

import { QuestionCircleFilled } from '@ant-design/icons';

import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';

import { currentTokenData } from '@app/utils/hooks/instances';
import { local } from 'web3modal';

interface iProps {
  isBNBVesting: boolean;
  useBnbVestingFun: any;
  addMaxAmmount: any;
  useVestingFunction: any;
  useVesting: boolean;
  isOwnerField: boolean;
  ownerCheckBox: any;
}

export const Step1: React.FC<iProps> = ({
  isBNBVesting,
  useBnbVestingFun,
  addMaxAmmount,
  useVestingFunction,
  useVesting,
  isOwnerField,
  ownerCheckBox,
}) => {
  const isWalletConnectedContext = useContext(AppCtx);
  const [copyData, setcopyData] = useState('copy');
  const [displayCopySlug, setdisplayCopySlug] = useState('none');
  const [displayOwnerField, setdisplayOwnerField] = useState('none');
  // const [isOwnerField, setownerField]= useState<boolean>(false)
  const [invalidTokenErr, setinvalidTokenErr] = useState('');
  const [tokenAddress, setTokenAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isBNBLock, setIsBNBLock] = useState(false);
  const [getCurrentTokenData, setCurrentTokenData] = useState<[]>([]);
  const [addressToCopy, setAddressToCopy] = useState('0x5E5b9bE5fd939c578ABE5800a90C566eeEbA44a5');
  const [feeDetials, setFeeDetials] = useState<any>('connect Wallet to Check Fee Details');

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

  const changeTokenAddress = async (e: any) => {
    setinvalidTokenErr('');
    var value = e.target.value;
    setTokenAddress(value);

    if (isWalletConnectedContext?.isWalletConnected == true) {
      var currentTokenContract: any = await currentTokenData(value);
      console.log(currentTokenContract);
      if (currentTokenContract.success == false) {
        setinvalidTokenErr('invalid Token');
        setCurrentTokenData([]);
      } else {
        setCurrentTokenData(currentTokenContract.tokenData);
        setinvalidTokenErr('');
      }
    } else {
      setCurrentTokenData([]);
    }
  };

  // select Snipe Lock
  const selectSnipeLock: any = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('this is selected value', e);
    var selectValue: any = e;
    if (selectValue == 'Token Lock') {
      console.log('working A');
      isWalletConnectedContext?.setTokenLocked(true);
      isWalletConnectedContext?.setSelected(true);

      setIsBNBLock(false);

      // fetching data Feedetials while selecting Services of Lock
    } else if (selectValue == 'BNB Lock') {
      console.log('working B');
      isWalletConnectedContext?.setTokenLocked(false);
      isWalletConnectedContext?.setSelected(true);

      setIsBNBLock(true);
    }
  };

  useEffect(() => {
    console.log('is token Locked', isWalletConnectedContext?.isTokenLocked);
    console.log('is bnb or token Selected', isWalletConnectedContext?.isSelectBoxSelected);

    function detechInnerWidth() {
      if (window.innerWidth < 600) {
        setAddressToCopy('0x5E....4a5');
      } else {
        setAddressToCopy('0x5E5b9bE5fd939c578ABE5800a90C566eeEbA44a5');
      }
    }

    setInterval(() => {
      detechInnerWidth();
    }, 2000);
  });

  // this use effect use for get fee details of PinkLock Contract
  useEffect(() => {
    const fetchLockFeeDetials = async () => {
      console.log('functin is working', isWalletConnectedContext?.isWalletConnected);
      if (isWalletConnectedContext?.isWalletConnected == true) {
        var result: any = await getLockFeeDetails();
        if (result.success == true) {
          console.log('this is result', result);
          setFeeDetials(`Lock Fee is ${result.LockFee}  & Vest Lock Fee is ${result.vestFee}`);
        }
      } else {
        setFeeDetials(`Connect Wallet to Check Fee Details`);
      }
    };

    setTimeout(() => {
      fetchLockFeeDetials();
    }, 2000);
  }, [isWalletConnectedContext?.isWalletConnected]);

  const { t } = useTranslation();
  return (
    <S.FormContent>
      <BaseForm.Item name="bulkSender" label={t('Snipe Lock')}>
        <Select defaultValue="Select" onChange={selectSnipeLock}>
          <Option value="Token Lock">Token Lock</Option>
          <Option value="BNB Lock">BNB Lock</Option>
        </Select>

        <Box sx={{ mt: '10px', fontSize: '12px ', fontWeight: '500' }}>
          <span style={{ color: '#339CFD' }}>{feeDetials}</span>
        </Box>
      </BaseForm.Item>

      {isBNBLock ? (
        <>
          {/* this fields use to BNB Lock BNBLock*/}

          <BaseForm.Item
            name="titleBNB"
            label={t('Title')}
            rules={[{ required: true, message: t('Title is required') }]}
          >
            <Input placeholder="Title" />
          </BaseForm.Item>

          <BaseForm.Item
            name="Amount2BNB"
            label={t('Amount')}
            rules={[{ required: true, message: t('Amount is required') }]}
          >
            <Input placeholder="Amount" />
          </BaseForm.Item>

          {/* checkBox Here */}

          <BaseForm.Item>
            <Checkbox onChange={useBnbVestingFun} />{' '}
            <label style={{ color: '#339CFD', fontWeight: '500', marginLeft: '5px', fontSize: '14px' }}>
              use Vesting?
            </label>
          </BaseForm.Item>

          {isBNBVesting ? (
            <>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={6}>
                    <Box sx={{ position: 'relative' }}>
                      <BaseForm.Item
                        name="bnbTgeDate"
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
                        name="BNBtgePercent"
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
                        name="BNBCycleDays1"
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
                        name="BNBcyclePercentage"
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
                name="UnlockDateBNB"
                label={t('Unlock Date')}
                rules={[{ required: true, message: t('unlock date is required') }]}
              >
                <Input type="datetime-local" className="dateTimePicker" placeholder="Select date" />
              </BaseForm.Item>
            </>
          )}
        </>
      ) : (
        <>
          {/* this fields use to Token Lock TokenLock*/}

          <BaseForm.Item
            name="TokenAddress"
            label={t('Token or LP Token address')}
            rules={[{ required: true, message: t('token address is required') }]}
          >
            <Input placeholder="Token or LP Token address" onChange={changeTokenAddress} />
          </BaseForm.Item>

          <Box>
            <Typography style={{ color: 'red', fontSize: '14px' }}>
              {invalidTokenErr}
              {/* invalid Token */}
            </Typography>

            {getCurrentTokenData.map((item: Field, index: number) => {
              return (
                <Box
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    fontSize: '12px',
                    margin: '5px,0px',
                    borderBottom: '1px solid #5c5c5c',
                    padding: '10px 10px',
                  }}
                >
                  <Typography key={index + 1}>{item.name}</Typography>
                  <Typography key={index + 2}>{item.value}</Typography>
                </Box>
              );
            })}
          </Box>

          <BaseForm.Item>
            <Checkbox onChange={ownerCheckBox} />{' '}
            <label style={{ color: '#339CFD', fontWeight: '500', marginLeft: '5px', fontSize: '14px' }}>
              use another owner?
            </label>
          </BaseForm.Item>

          {isOwnerField ? (
            <>
              <BaseForm.Item
                name="Owner1"
                label={t('Owner')}
                rules={[{ required: true, message: t('Enter Owner Address') }]}
              >
                <Input placeholder="Enter Owner Address" />
              </BaseForm.Item>
              <span style={{ fontSize: '10px', color: '#339CFD' }}>
                the address you input here will be receive the tokens once they are unlocked
              </span>
            </>
          ) : (
            <></>
          )}

          <BaseForm.Item
            name="LockTitle"
            label={t('Title')}
            rules={[{ required: true, message: t('title is required') }]}
          >
            <Input placeholder="Ex My Lock" />
          </BaseForm.Item>

          <Box sx={{ position: 'relative' }}>
            <BaseForm.Item
              name="Amount"
              label={t('Amount')}
              rules={[{ required: true, message: t('Amount is required') }]}
            >
              <Input placeholder="Enter Amount" />
              {/* <Button sx={{fontWeight : "bold",position : "absolute", top:"50%", right:"-20px", transform:"translate(-50%,-50%)"}} >MAX</Button> */}
            </BaseForm.Item>
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
          </Box>

          <BaseForm.Item>
            <Checkbox onChange={useVestingFunction} />{' '}
            <label style={{ color: '#339CFD', fontWeight: '500', marginLeft: '5px', fontSize: '14px' }}>
              use Vesting?
            </label>
          </BaseForm.Item>

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
        </>
      )}
    </S.FormContent>
  );
};
