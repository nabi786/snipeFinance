import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Step1 } from './Steps/Step1';
import { Step2 } from './Steps/Step2';
import { Step3 } from './Steps/Step3';
import { Step4 } from './Steps/Step4';
import { notificationController } from '@app/controllers/notificationController';

import { mergeBy } from '@app/utils/utils';
import { Typography } from 'antd';
import * as S from './StepForm.styles';
import { Steps } from './StepForm.styles';
import { Badge } from '@app/components/common/Badge/Badge';
import { Modal, InfoModal, SuccessModal, WarningModal, ErrorModal } from '@app/components/common/Modal/Modal';
import { Link } from 'react-router-dom';
import { currentTokenData } from '@app/utils/hooks/instances';
import { Box } from '@mui/material';

import {
  approveToken,
  lockTOkenBlockChainFun,
  lockTokenVestingFun,
  BNBLockFun,
  bnbLockVesting,
} from '@app/utils/hooks/pinkLock';

import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';

interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export const StepForm: React.FC = () => {
  const isWalletConnectedContext = useContext(AppCtx);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [IsBasicModalVisible, setIsBasicModalVisible] = useState(false);
  const [form] = BaseForm.useForm();
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [showError, setError] = useState('');
  const [showSuccess, setSuccess] = useState('');
  const [tokenApproved, setTokenApproved] = useState<boolean>(false);
  const [isTokenLocking, setisTokenLocking] = useState<boolean>(false);
  const [inValidTokenErr, setinValidTokenErr] = useState('');
  const [approvalGiven, setApprovalGiven] = useState('');
  const [isLockedSuccessfully, setLockedSuccessfully] = useState(false);
  const [isBNBLockedSuccessfully, setBNBLockedSuccessfully] = useState(false);
  const [transactionURL, setTransactionUrl] = useState('');
  const [useVesting, setUseVesting] = useState(false);
  const [isOwnerField, setownerField] = useState(false);
  const [isBNBVesting, setIsBNbVesting] = useState(false);
  const [walletAddressForLink, setWalletAddressForLink] = useState('');

  const [fields, setFields] = useState<FieldData[]>([]);

  const { t } = useTranslation();

  const formLabels: FormValues = {
    TokenAddress: t('TokenAddress'),
    LockTitle: t('Title'),
    Amount: t('Amount'),
    LockTime: t('LockTime'),
    Owner1: t('Owner1'),
    tgeDate: t('tgeDate'),
    tgePercent: t('tgePercent'),
    cyclePercentage: t('cyclePercentage'),
    CycleDays1: t('CycleDays1'),
    titleBNB: t('titleBNB'),
    Amount2BNB: t('Amount2BNB'),
    UnlockDateBNB: t('UnlockDateBNB'),
    bnbTgeDate: t('bnbTgeDate'),
    BNBtgePercent: t('BNBtgePercent'),
    BNBCycleDays1: t('BNBCycleDays1'),
    BNBcyclePercentage: t('BNBcyclePercentage'),
  };

  const formValues = fields
    .filter((item) => item.name !== 'prefix')
    .map((item) => ({
      name: formLabels[item.name],
      value: String(item.name === 'birthday' && item.value ? item.value.format('YYYY-MM-DD') : item.value),
    }));

  console.log('these are form values', formValues);
  var tokenAddress: any = '';
  var TotalAmmount: any = '';
  var owner: any = '';
  var title: any = '';
  var lockTime: any = '';
  var tgeDate: any = '';
  var tgePercent: any = '';
  var CycleDays: any = '';
  var cyclePercentage: any = '';
  var titleBNB: any = '';
  var Amount2BNB: any = '';
  var UnlockDateBNB: any = '';

  var bnbTgeDate: any = '';
  var BNBtgePercent: any = '';
  var BNBCycleDays1: any = '';
  var BNBcyclePercentage: any = '';

  formValues.forEach((item: any, index: number) => {
    if (item.name == 'titleBNB') {
      titleBNB = item.value;
    } else if (item.name == 'Amount2BNB') {
      Amount2BNB = item.value;
    } else if (item.name == 'UnlockDateBNB') {
      UnlockDateBNB = item.value;
    } else if (item.name == 'TokenAddress') {
      tokenAddress = item.value;
    } else if (item.name == 'Amount') {
      TotalAmmount = item.value;
    } else if (item.name == 'Owner1') {
      owner = item.value;
    } else if (item.name == 'Title') {
      title = item.value;
    } else if (item.name == 'LockTime') {
      lockTime = item.value;
    } else if (item.name == 'tgeDate') {
      tgeDate = item.value;
    } else if (item.name == 'tgePercent') {
      tgePercent = item.value;
    } else if (item.name == 'CycleDays1') {
      CycleDays = item.value;
    } else if (item.name == 'cyclePercentage') {
      cyclePercentage = item.value;
    } else if (item.name == 'bnbTgeDate') {
      bnbTgeDate = item.value;
    } else if (item.name == 'BNBtgePercent') {
      BNBtgePercent = item.value;
    } else if (item.name == 'BNBCycleDays1') {
      BNBCycleDays1 = item.value;
    } else if (item.name == 'BNBcyclePercentage') {
      BNBcyclePercentage = item.value;
    }
  });

  console.log('this is tge Date', tgeDate);
  console.log('this is tge Percent', tgePercent);
  console.log('this is cycle Days', CycleDays);
  console.log('thi sis cycle realease percent', cyclePercentage);

  const next = async () => {
    setIsLoading(true);

    // form.validateFields().then(() => {
    //   setCurrent(current + 1);
    // });
  };

  // approve button
  const approveButton = async () => {
    setError('');
    setLockedSuccessfully(false);
    if (isWalletConnectedContext?.isSelectBoxSelected) {
      setTransactionUrl('');

      form.validateFields().then(async () => {
        setinValidTokenErr('');
        setIsLoading(true);
        setIsApproved(true);
        setApprovalGiven('');

        var approvalData = await approveToken(tokenAddress, TotalAmmount);
        console.log('approval data', approvalData);
        if (approvalData.err != 'not enough Balance') {
          if (approvalData) {
            if (approvalData.err == false) {
              setTokenApproved(true);
              setIsApproved(false);
              setinValidTokenErr('');
              setApprovalGiven('Approved, you can now Lock');
            } else {
              setTokenApproved(false);
              setIsApproved(false);
              setApprovalGiven('');
              setinValidTokenErr('');
              setIsLoading(false);
            }
          }
          setIsLoading(false);

          // if not enough balance
        } else {
          console.log('working here2');
          setTokenApproved(false);
          setIsApproved(false);
          setApprovalGiven('');
          setinValidTokenErr(approvalData.msg);
        }

        setIsLoading(false);
        setIsApproved(false);
      });
    } else {
      setError('Select Snip Lock First');
    }
  };

  const useVestingFunction = async (e: any) => {
    if (e.target.checked == true) {
      setUseVesting(true);
      console.log('this is Vesting');
    } else {
      setUseVesting(false);
      console.log('this is not Vesting');
    }
  };

  const useBnbVestingFun = async (e: any) => {
    console.log('you clicked on checkBox');
    if (e.target.checked == true) {
      setIsBNbVesting(true);
      console.log('bnb Vesting Enable');
    } else {
      setIsBNbVesting(false);
      console.log('bnb Vesting disAble');
    }
  };

  // checkbox owner field
  const ownerCheckBox = (e: any) => {
    console.log('is this checked', e.target.checked);
    if (e.target.checked == true) {
      setownerField(true);
    } else {
      setownerField(false);

      let newArr: any = [];
      fields.forEach((item, index) => {
        console.log(item);
        if (item?.name === 'Owner1') {
          newArr.push({ name: 'Owner1', value: '' });
        } else {
          newArr.push(item);
        }
      });

      setFields(newArr);
    }
  };

  const addMaxAmmount = async () => {
    try {
      if (isWalletConnectedContext?.isWalletConnected == true) {
        const currentTokenContract: any = await currentTokenData(tokenAddress);

        console.log('this is current token data', currentTokenContract);

        if (currentTokenContract.success != false) {
          var tokenBalance: any = currentTokenContract.tokenData[1].value;
          console.log('this is current token Balance', tokenBalance);

          let newArr: any = [];
          fields.forEach((item, index) => {
            console.log(item);
            if (item?.name === 'Amount') {
              console.log('mein agaya', item?.value);
              newArr.push({ name: 'Amount', value: tokenBalance });
            } else {
              newArr.push(item);
            }
          });

          setFields(newArr);
        }
      }
    } catch (err) {
      console.log('error while add max aammount', err);
    }
  };

  // const lock token function
  const LockToken = async () => {
    try {
      setError('');
      setIsLoading(true);
      setisTokenLocking(true);
      setBNBLockedSuccessfully(false);
      setApprovalGiven('');
      var unlockDate = lockTime;
      var description = title;
      var isLpToken = false;

      //
      if (useVesting == false) {
        // token lock without Vesting
        var data: any = await lockTOkenBlockChainFun(
          owner,
          tokenAddress,
          isLpToken,
          TotalAmmount,
          unlockDate,
          description,
        );

        console.log('this is data returned after lock', data);

        if (data.success == true) {
          setTimeout(() => {
            setTransactionUrl(`/token`);
            setLockedSuccessfully(true);
            setisTokenLocking(false);
            setIsLoading(false);
            setTokenApproved(false);
          }, 10000);

          // }else if(data.success == false && data.msgID === "007"){
        } else if (data.success == false) {
          setError(data.msg);
          setisTokenLocking(false);
          setIsLoading(false);
          setTokenApproved(false);
          setLockedSuccessfully(false);
        }
        // setIsLoading(false)
      } else {
        // Token Lock Using Vesting
        var data: any = await lockTokenVestingFun(
          owner,
          tokenAddress,
          TotalAmmount,
          tgeDate,
          tgePercent,
          CycleDays,
          cyclePercentage,
          title,
        );

        if (data.success == true) {
          setTimeout(() => {
            setLockedSuccessfully(true);
            setTransactionUrl(`/token`);
            setisTokenLocking(false);
            setIsLoading(false);
            setTokenApproved(false);
          }, 10000);
        } else {
          setisTokenLocking(false);
          setIsLoading(false);
          setTokenApproved(false);
          setLockedSuccessfully(false);
        }
      }
    } catch (err) {
      console.log(err);
      setisTokenLocking(false);
      setTokenApproved(false);
      setIsLoading(false);
    }
  };

  // Lock BNB BTN Click

  const LockBNBSubmitBTN = async () => {
    try {
      setError('');
      setSuccess('');
      setIsLoading(true);
      setBNBLockedSuccessfully(false);
      setLockedSuccessfully(false);

      // var bnbTgeDate : ""
      // var BNBtgePercent : ""
      // var BNBCycleDays1 : ""
      // var BNBcyclePercentage : ""

      // console.log("this is ", isWalletConnectedContext.isWalletAddress)

      if (isWalletConnectedContext?.isSelectBoxSelected) {
        console.log('is BNB Vesting Selected', isBNBVesting);

        if (isBNBVesting == false) {
          var bnbLocked: any = await BNBLockFun(titleBNB, Amount2BNB, UnlockDateBNB);
          console.log('this is BNB Locked', bnbLocked);

          if (bnbLocked.success == true) {
            setTimeout(() => {
              setWalletAddressForLink(isWalletConnectedContext?.isWalletAddress);
              setSuccess('');
              setIsLoading(false);
              setBNBLockedSuccessfully(true);
            }, 15000);
            // if user reject the transaction
          } else if (bnbLocked.success == false) {
            setError(bnbLocked.msg);
            setIsLoading(false);
            setBNBLockedSuccessfully(false);
          }

          // BNB Vesting
        } else {
          console.log('you want to VestLock BNB but still not have function ');

          // console.log("bnbTgeDate",bnbTgeDate)
          // console.log("BNBtgePercent",BNBtgePercent)
          // console.log("BNBCycleDays1",BNBCycleDays1)
          // console.log("BNBcyclePercentage",BNBcyclePercentage)

          var result: any = await bnbLockVesting(
            titleBNB,
            Amount2BNB,
            bnbTgeDate,
            BNBtgePercent,
            BNBCycleDays1,
            BNBcyclePercentage,
          );

          console.log('this is reuslt of Vesting Lock', result);

          if (result.success == true) {
            setTimeout(() => {
              setWalletAddressForLink(isWalletConnectedContext.isWalletAddress);

              setBNBLockedSuccessfully(true);
              setSuccess('');
              setIsLoading(false);
              setError('');
            }, 20000);
          } else {
            setIsLoading(false);
            setBNBLockedSuccessfully(false);
            setError(result.msg);
          }
        }
      } else {
        setError('select Snipe Lock first');
      }
    } catch (err) {
      console.log('thi sis errr while Vest/BNB lock', err);

      setIsLoading(false);
    }
  };

  const formFieldsUi = [
    // <Step1 addMaxAmmountFunc={addMaxAmmount} key="1" />,
    <Step1
      isBNBVesting={isBNBVesting}
      useBnbVestingFun={useBnbVestingFun}
      ownerCheckBox={ownerCheckBox}
      isOwnerField={isOwnerField}
      addMaxAmmount={addMaxAmmount}
      key="1"
      useVestingFunction={useVestingFunction}
      useVesting={useVesting}
    />,
    // <Step2 key="2" />,
    // <Step3 key="3" />,
    // <Step4 key="4" formValues={formValues} />,
  ];

  return (
    <BaseForm
      name="stepForm"
      form={form}
      fields={fields}
      onFieldsChange={(_, allFields) => {
        const currentFields = allFields.map((item) => ({
          name: Array.isArray(item.name) ? item.name[0] : '',
          value: item.value,
        }));
        const uniqueData = mergeBy(fields, currentFields, 'name');
        setFields(uniqueData);
      }}
    >
      <div>{formFieldsUi[current]}</div>

      <Typography style={{ color: 'red', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase' }}>
        {' '}
        {inValidTokenErr}{' '}
      </Typography>
      <Typography style={{ color: 'white', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase' }}>
        {' '}
        {approvalGiven}{' '}
      </Typography>

      <p style={{ textAlign: 'center', fontSize: '12px', textTransform: 'uppercase' }}>
        {/* LinkTo current Locked Token */}
        <Link to={`/token/detail/${tokenAddress}`} style={{ color: '#339CFD' }}>
          {isLockedSuccessfully ? (
            <>{useVesting ? 'Vested successfully, Check Here' : `locked Successfully, Check Here`}</>
          ) : (
            ''
          )}
        </Link>

        {/* bnb lcoked Message */}
        <Link to={`/bnb/detail/${walletAddressForLink}`} style={{ color: '#339CFD' }}>
          {isBNBLockedSuccessfully ? (
            <>{isBNBVesting ? 'Vested successfully, Check Here' : `locked Successfully, Check Here`}</>
          ) : (
            ''
          )}
        </Link>
      </p>

      <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', textTransform: 'uppercase' }}>
        {showError ? showError : ''}
      </p>

      {isWalletConnectedContext?.isWalletConnected ? (
        <>
          {isWalletConnectedContext?.isTokenLocked ? (
            <>
              {tokenApproved ? (
                <>
                  <S.ButtonWrapper>
                    <Button type="ghost" onClick={LockToken} style={{ margin: 'auto' }} loading={isLoading}>
                      {isTokenLocking ? 'Locking' : 'Lock'}
                    </Button>
                  </S.ButtonWrapper>
                </>
              ) : (
                <>
                  <S.ButtonWrapper>
                    {isLockedSuccessfully ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Link to={`/`} style={{ color: 'white' }}>
                            <Button type="primary" style={{ margin: 'auto' }}>
                              HOME
                            </Button>
                          </Link>

                          <Button
                            type="primary"
                            style={{ marginLeft: '5px' }}
                            onClick={() => {
                              setLockedSuccessfully(false);
                            }}
                          >
                            ANOTHER LOCK
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Button onClick={approveButton} style={{ margin: 'auto' }} loading={isLoading}>
                          {isApproved ? `Approving` : `Approve`}
                        </Button>
                      </>
                    )}
                  </S.ButtonWrapper>
                </>
              )}
            </>
          ) : (
            <>
              {isWalletConnectedContext.isWalletConnected ? (
                <>
                  {/* lock BNB Button */}
                  <S.ButtonWrapper>
                    {isBNBLockedSuccessfully ? (
                      <>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Link to={`/`} style={{ color: 'white' }}>
                            <Button type="primary" style={{ margin: 'auto' }}>
                              HOME
                            </Button>
                          </Link>
                          <Button
                            type="primary"
                            style={{ marginLeft: '5px' }}
                            onClick={() => {
                              setBNBLockedSuccessfully(false);
                            }}
                          >
                            ANOTHER LOCK
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Button onClick={LockBNBSubmitBTN} style={{ margin: 'auto' }} loading={isLoading}>
                          {isLoading ? `Locking BNB` : 'Lock BNB'}
                        </Button>
                      </>
                    )}
                  </S.ButtonWrapper>
                </>
              ) : (
                <>
                  {/* lock BNB Button */}
                  <S.ButtonWrapper>
                    <Button type="ghost" style={{ margin: 'auto' }} loading={isLoading}>
                      Lock BNB
                    </Button>
                  </S.ButtonWrapper>
                </>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {isWalletConnectedContext?.isTokenLocked ? (
            <>
              <S.ButtonWrapper>
                <Button type="ghost" style={{ margin: 'auto' }} onClick={() => setIsBasicModalVisible(true)}>
                  Lock
                </Button>
              </S.ButtonWrapper>
            </>
          ) : (
            <>
              <S.ButtonWrapper>
                <Button type="ghost" style={{ margin: 'auto' }} onClick={() => setIsBasicModalVisible(true)}>
                  Lock BNB
                </Button>
              </S.ButtonWrapper>
            </>
          )}
        </>
      )}

      <Modal
        centered
        visible={IsBasicModalVisible}
        onOk={() => setIsBasicModalVisible(false)}
        onCancel={() => setIsBasicModalVisible(false)}
        size="medium"
        className="warningModel"
      >
        <BaseForm.Item
          name="Oops"
          // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
          style={{ fontSize: '20px', textAlign: 'center', margin: '0px' }}
        >
          {t('Oops Wallet Not Connected')}
        </BaseForm.Item>
      </Modal>
    </BaseForm>
  );
};
