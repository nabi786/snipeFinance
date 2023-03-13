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
import { useParams, useNavigate } from 'react-router-dom';

import { extendTokenLock, extendLockBNB } from '@app/utils/hooks/pinkLock';

import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';

import { getTokenByID, getLockedBNbById } from '@app/utils/APIs/apis';

interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export const StepForm: React.FC = () => {
  let navigate = useNavigate();

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
  const [LockID, setLockID] = useState<number>(0);
  const [tokenDecimal, setTokenDecimal] = useState<number>(0);
  const paramData = useParams();

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

  formValues.forEach((item, index) => {
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

  // const next = async () => {
  //   setIsLoading(true)

  //   // form.validateFields().then(() => {
  //   //   setCurrent(current + 1);
  //   // });
  // };

  const addMaxAmmount = async () => {
    try {
      if (isWalletConnectedContext?.isWalletConnected == true) {
        var tokenAddress = paramData.Addr;
        const currentTokenContract: any = await currentTokenData(tokenAddress);

        console.log('this is current token data', currentTokenContract);

        if (currentTokenContract.success != false) {
          var tokenBalance = currentTokenContract.tokenData[1].value;
          console.log('this is current token Balance', tokenBalance);

          let newArr: any = [];
          console.log('these are fields', fields);

          if (fields.length == 0) {
            setFields([{ name: 'Amount', value: tokenBalance }]);
          }

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

  // getting locked data date nad AMound
  useEffect(() => {
    if (isWalletConnectedContext?.isWalletConnected == false) {
      navigate(`/`);
    }

    if (paramData.name == 'token') {
      const getLockedTokenDate = async () => {
        try {
          var id = paramData.id;

          console.log('this is paramOBJ', paramData);
          var currentDate;
          currentDate = await getTokenByID(id);

          if (currentDate.success == true) {
            console.log('this is currentToken Date from backend', currentDate);

            var currentResPondData: any = currentDate.data;
            setLockID(currentResPondData.lockID);
            setTokenDecimal(currentResPondData.tokenDecimal);

            var unLockDate: any = currentDate.unLockDateUnix;

            console.log('these are unLockDate before', unLockDate);
            var newDate = new Date(Number(unLockDate) * 1000);
            console.log('these are unLockDate after', newDate);

            var getYear = newDate.getFullYear();
            var date = newDate.getDate();
            var getMonth: any = newDate.getMonth();
            var hours = newDate.getHours();
            var getMinutes: any = newDate.getMinutes();

            if (getMonth < 10) {
              getMonth = `${getMonth}`;
            }
            if (getMinutes < 10) {
              getMinutes = `0${getMinutes}`;
            }

            unLockDate = `${getYear}-${getMonth + 1}-${date}T${hours}:${getMinutes}`;
            console.log('these are unLockDate after', unLockDate);

            var obj: any = [
              { name: 'Amount', value: currentResPondData.total_Locked_Amount },
              { name: 'LockTime', value: unLockDate },
            ];
            setFields(obj);
          } else {
          }
        } catch (err) {
          console.log('this is error', err);
        }
      };

      getLockedTokenDate();
    }

    if (paramData.name == 'bnb') {
      const getLockedBNBData = async () => {
        try {
          console.log('this is BNB');
          var id = paramData.id;
          var currentDate: any = await getLockedBNbById(id);
          console.log('this is returned data', currentDate);
          if (currentDate.success == true) {
            console.log('this is BNB Data', currentDate);

            var unLockDate: any = currentDate.unLockUnix;
            // console.log("unLockDate",unLockDate)
            console.log('these are unLockDate before', unLockDate);
            var newDate = new Date(Number(unLockDate) * 1000);
            console.log('these are unLockDate after', newDate);

            var getYear = newDate.getFullYear();
            var date = newDate.getDate();
            var getMonth: any = newDate.getMonth();
            var hours: any = newDate.getHours();

            var getMinutes: any = newDate.getMinutes();

            if (hours < 10) {
              hours = `0${hours}`;
            }

            if (getMonth < 10) {
              getMonth = `${getMonth}`;
            }
            if (getMinutes < 10) {
              getMinutes = `0${getMinutes}`;
            }

            unLockDate = `${getYear}-${getMonth + 1}-${date}T${hours}:${getMinutes}`;
            console.log('these are unLockDate after', unLockDate);

            var amount = currentDate.lockedAmountETH;

            var obj: any = [
              { name: 'Amount', value: amount },
              { name: 'LockTime', value: unLockDate },
            ];
            setFields(obj);
          } else {
          }
        } catch (err) {
          console.log('this is error', err);
        }
      };
      getLockedBNBData();
    }
  }, []);

  const UpdateYourLock = async () => {
    var tokenAddress = paramData.Addr;
    var id = paramData.id;

    console.log('this is tokenID', id);
    console.log('this is LockID', LockID);
    setIsLoading(true);
    setError('');
    setSuccess('');

    console.log('these are form values', formValues);

    var amount: any = formValues[0].value;
    var newLockDate: any = formValues[1].value;

    console.log('amount', amount);
    console.log('newLockDate', newLockDate);

    var result: any = await extendTokenLock(LockID, id, amount, newLockDate, tokenDecimal, tokenAddress);

    console.log('result is this', result);
    if (result.success == true) {
      setTimeout(() => {
        setIsLoading(false);

        setSuccess(result.msg);
        navigate(`/token/detail/${tokenAddress}/${id}`);
      }, 10000);
    } else {
      setIsLoading(false);
      setError(result.msg);
    }

    // setIsLoading(false)
  };

  // const update Lock BNB
  const UpdateYourLockBNB = async () => {
    try {
      setIsLoading(true);
      console.log('you have cliekd on update lock');

      setError('');
      setSuccess('');

      var wltAddr = paramData.Addr;
      var id = paramData.id;
      var amount: any = formValues[0].value;
      var newLockDate: any = formValues[1].value;

      var result: any = await extendLockBNB(amount, newLockDate, wltAddr, id);
      console.log('this is result from FUNNN', result);

      if (result?.success == true) {
        setTimeout(() => {
          setIsLoading(false);
          navigate(`/bnb/detail/${wltAddr}`);
        }, 10000);
      } else {
        setError(result.msg);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log('err while update Lock', err);
    }
  };

  const formFieldsUi = [
    <Step1 addMaxAmmount={addMaxAmmount} key="1" useVesting={useVesting} />,
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

      <p style={{ color: 'white', textAlign: 'center', fontSize: '12px', textTransform: 'uppercase' }}>
        {/* LinkTo current Locked Token */}
        <Link to={`/token/detail/${tokenAddress}`} style={{ color: 'white' }}>
          {isLockedSuccessfully ? <>{useVesting ? 'Vested successfully' : `locked Successfully`}</> : ''}
        </Link>

        {/* bnb lcoked Message */}
        <Link to={`/bnb/detail/${walletAddressForLink}`} style={{ color: 'white' }}>
          {isBNBLockedSuccessfully ? <>{isBNBVesting ? 'Vested successfully' : `locked Successfully`}</> : ''}
        </Link>
      </p>

      <p style={{ color: 'red', fontSize: '14px', textAlign: 'center', textTransform: 'uppercase' }}>
        {showError ? showError : ''}
      </p>
      <p style={{ color: 'white', fontSize: '14px', textAlign: 'center', textTransform: 'uppercase' }}>
        {showSuccess ? showSuccess : ''}
      </p>

      {isWalletConnectedContext?.isWalletConnected ? (
        <>
          {paramData.name == 'token' ? (
            <S.ButtonWrapper>
              <Button type="primary" style={{ margin: 'auto' }} loading={isLoading} onClick={UpdateYourLock}>
                {isLoading ? 'Updating Your Lock' : 'Update Your Lock'}
              </Button>
            </S.ButtonWrapper>
          ) : (
            <S.ButtonWrapper>
              <Button type="primary" style={{ margin: 'auto' }} loading={isLoading} onClick={UpdateYourLockBNB}>
                {isLoading ? 'Updating Your Lock' : 'Update Your Lock'}
              </Button>
            </S.ButtonWrapper>
          )}
        </>
      ) : (
        <>
          <S.ButtonWrapper>
            <Button type="ghost" style={{ margin: 'auto' }} onClick={() => setIsBasicModalVisible(true)}>
              Update Your Lock
            </Button>
          </S.ButtonWrapper>
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
