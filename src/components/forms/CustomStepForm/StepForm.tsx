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
import * as S from './StepForm.styles';
import { Steps } from './StepForm.styles';
import { Modal, InfoModal, SuccessModal, WarningModal, ErrorModal } from '@app/components/common/Modal/Modal';
import { Input, TextArea } from '@app/components/common/inputs/Input/Input';
import BigNumber from 'bignumber.js';
import { Box } from '@mui/material';

interface FormValues {
  [key: string]: string | undefined;
}
interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

import { ethers } from 'ethers';
import {
  getContractMultitSender,
  approveTokenWithContract,
  sendBNBFunction,
  getFeesDetailsForTransactions,
} from '@app/utils/hooks/use-MultiSenderContract';

import { tokenContractInstance } from '@app/utils/hooks/instances';

// import allocations
import AllocationsFieldsForToken from './Allocations/allocationsForToken';
import allocationsForBnb from './Allocations/allocationsForBNB';
// getting data back from allocations

import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import { Link } from 'react-router-dom';

// import token contract function

export const Form: React.FC = () => {
  const isWalletConnectedContext = useContext(AppCtx);
  const [IsBasicModalVisible, setIsBasicModalVisible] = useState<boolean>(false);
  const [IsBasicAddressMatch, setIsBasicAddressMatch] = useState<boolean>(false);
  const [approvalHash, setApprovalHash] = useState('');
  const [isBNBValue, setIsBNBValue] = useState<boolean>();
  const [successTransaction, setSuccessTransation] = useState('');
  const [successTransactionLink, setSuccessTransationLink] = useState('');
  const [approvalHashlink, setApprovalHashLink] = useState('');
  const [sendingToken, setSendingToken] = useState(false);
  const [error, setError] = useState<any>('');
  const [isConfirmAndSending, setisConfirmAndSending] = useState(false);
  const [sendingTransaction, setSendingTransaction] = useState(false);
  const [errorStep4, setErrorStep4] = useState<{}>({});
  const [confirmData, setConfirmData] = useState<{}>({});
  const [transactionSentSuccessfully, settransactionSentSuccessfully] = useState(false);
  const [isApprovalGiven, setApprovalGiven] = useState(false);
  const [sendBNBandTokenConfirmData, setSendBNBandTokenConfirmData] = useState<{}>({});
  const [sendBNBBtnDisplay, setsendBNBBtnDispay] = useState<boolean>(false);
  const [btnDescider, setBtnDescider] = useState('');
  const [disPlayNext, setDispayNext] = useState('none');
  const [disPlayConfirmAndSendBtn, setDisPlayConfirmAndSendBtn] = useState('block');
  const [disPlayApprove, setdisPlayApprove] = useState('block');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [addressAry, setAddressary] = useState<any>();
  const [valueAry, setValueAry] = useState<any>();
  const [totalAmmount, setTotalAmmount] = useState<any>();
  const [feesData, setFeesData] = useState<{}>({});
  const [setTToenAddress, getTTokenAddress] = useState('');
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
  const [fields, setFields] = useState<FieldData[]>([
    // { name: 'login', value: 'Jerri' },
    { name: 'Token address', value: '' },
    { name: 'Allocations', value: '' },
    // { name: 'password', value: '123456' },
    // { name: 'confirmPassword', value: '123456' },
    // { name: 'salutation', value: 'mr' },
    // { name: 'gender', value: 'male' },
    // { name: 'firstName', value: 'John' },
    // { name: 'lastName', value: 'Black' },
    // { name: 'phone', value: '298573124' },
    // { name: 'email', value: '' },
    // { name: 'address1', value: 'Slobodskay street' },
    // { name: 'address2', value: 'Nevski street' },
    // { name: 'zipCode', value: '435123' },
    // { name: 'city', value: 'Minsk' },
    // { name: 'country', value: 'Belarus' },
    // { name: 'prefix', value: '+7' },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = useTranslation();

  const formLabels: FormValues = {
    // login: t('forms.stepFormLabels.login'),
    tokenAddress: t('Token address'),
    allocations: t('Allocations'),
    // password: t('common.password'),
    // confirmPassword: t('common.confirmPassword'),
    // salutation: t('forms.stepFormLabels.salutation'),
    // gender: t('forms.stepFormLabels.gender'),
    // firstName: t('common.firstName'),
    // lastName: t('common.lastName'),
    // birthday: t('forms.stepFormLabels.birthday'),
    // phone: t('common.phone'),
    // email: t('common.email'),
    // address1: `${t('common.address')} 1`,
    // address2: `${t('common.address')} 2`,
    // zipCode: t('common.zipcode'),
    // city: t('common.city'),
    // country: t('common.country'),
  };

  const formValues = fields
    .filter((item) => item.name !== 'prefix')
    .map((item) => ({
      name: formLabels[item.name],
      value: String(item.name === 'birthday' && item.value ? item.value.format('YYYY-MM-DD') : item.value),
    }));

  let tmpArray: any = [];
  const handleUpdateCSV: any = (e: any) => {
    console.log('this is value of uploaded file in StepForm', e);
    let newAry007: any = [];
    console.log('this is fileds handleUploadCSV', fields);
    if (fields.length == 0) {
      console.log('if condition is working ');
      newAry007 = [
        { name: '', value: '' },
        { name: 'Token address', value: '' },
        { name: 'Allocations', value: e },
        { name: 'undefined', value: '' },
      ];
      setFields(newAry007);
      console.log('fields in handleUploadCSV', fields);
    }
    console.log('if condition is not working');
    console.log('form fields 007', fields);
    fields.forEach((item: any, index: any) => {
      if (item.name === 'allocations' || item.name === 'Allocations') {
        tmpArray.push({ name: 'allocations', value: e });
      } else {
        tmpArray.push(item);
      }
    });

    setFields(tmpArray);
  };

  console.log('ese are form value', formValues);

  // confirm and send bnb
  const bnbsendAndConfirmBtn = async () => {
    setIsLoading(true);
    try {
      setisConfirmAndSending(true);
      setError('');

      var anyValueSelected = localStorage.getItem('anyValueSelected');

      if (anyValueSelected === 'true') {
        setSendingToken(false);

        setSuccessTransation('');
        // var allocatiosn = formValues[2].value;
        // var tokenAddress = formValues[1].value;
        var allocatiosn = '';
        var tokenAddress = '';

        formValues.forEach((item, index) => {
          if (item.name === 'Token address') {
            tokenAddress = item.value;
          }
          if (item.name === 'Allocations') {
            allocatiosn = item.value;
          }
        });

        console.log('these are tokenAddress values', tokenAddress);
        console.log('these are allocatiosn values', allocatiosn);

        var { isSpaceError, valueAry, addressAry, totalAmmount, isAddreseseMatch, isAllocations, outOfLimit } =
          await allocationsForBnb(allocatiosn);

        if (outOfLimit == '') {
          if (isAllocations === true) {
            var isBNB = true;
            setIsBNBValue(isBNB);
            var { ServiceFees, ChainFees, totalFees, error, msg } = await getFeesDetailsForTransactions(
              tokenAddress,
              addressAry,
              valueAry,
              totalAmmount,
              isBNB,
            );
            if (ServiceFees == 0) {
              ServiceFees = { name: 'Service Fees', value: 'Authorized by holding SNIPE' };
            } else {
              ServiceFees = { name: 'Service Fees', value: ServiceFees };
            }

            if (!error) {
              if (isAddreseseMatch != true) {
                if (isSpaceError != true) {
                  setAddressary(addressAry);
                  setTotalAmmount(totalAmmount);
                  setValueAry(valueAry);

                  if (addressAry.length > 9) {
                    var object = [
                      { name: 'Total Address', value: addressAry.length },
                      { name: 'Total Value', value: totalAmmount },
                    ];
                    setSendBNBandTokenConfirmData(object);

                    var feesOBject = [
                      ServiceFees,
                      { name: 'Chain Fees', value: ChainFees },
                      { name: 'Total Fees', value: totalFees },
                    ];

                    setFeesData(feesOBject);
                    setsendBNBBtnDispay(true);
                    setDisPlayConfirmAndSendBtn('none');
                    setisConfirmAndSending(false);
                    form.validateFields().then(() => {
                      setCurrent(current + 1);
                    });

                    setError('');

                    setIsLoading(false);
                  } else {
                    setError('Minimum of 10  addresses required');
                    setIsLoading(false);
                    setisConfirmAndSending(false);
                  }
                } else {
                  setError('Wrong format, check the sample format');
                  setIsLoading(false);
                  setisConfirmAndSending(false);
                }
              } else {
                setIsBasicAddressMatch(true);
                setIsLoading(false);
                setisConfirmAndSending(false);
              }
            } else {
              setError(msg);
              setIsLoading(false);
              setisConfirmAndSending(false);
            }
          } else {
            setError('MUST FILL ALLOCATION');
            setIsLoading(false);
            setisConfirmAndSending(false);
          }
        } else {
          setError(outOfLimit);
          setIsLoading(false);
          setisConfirmAndSending(false);
        }
      } else {
        setError('Please Select Bulk Sender Option');
        setIsLoading(false);
        setisConfirmAndSending(false);
      }
    } catch (err) {
      console.log('erro in stepForm', err);
      setError('Wrong format, check the sample format');
      setIsLoading(false);
      setisConfirmAndSending(false);
    }
  };

  // SEND   BNB function
  const sendBnbBtn = async () => {
    setIsLoading(true);
    settransactionSentSuccessfully(false);
    setSendingTransaction(true);
    setErrorStep4('');

    console.log('this is send bnb BTN');

    const sendBNB = await sendBNBFunction(addressAry, valueAry, totalAmmount);

    console.log('send bnb user rejected', sendBNB);
    if (sendBNB.success == false) {
      console.log('return data from function senBNB', sendBNB);
      setErrorStep4(sendBNB);
      setIsLoading(false);
      setSuccessTransation('');
      settransactionSentSuccessfully(false);
      setSendingTransaction(false);
    } else {
      // working here NB
      if (sendBNB.response != false) {
        console.log(sendBNB.response);
        setSuccessTransation(sendBNB.response);
        setSuccessTransationLink(`https://testnet.bscscan.com/tx/${sendBNB.response.hash}`);
        settransactionSentSuccessfully(true);
        setSendingTransaction(false);
      }
      setErrorStep4('');
      setIsLoading(false);

      // setCurrent(current - 1);
      // setTimeout(() => {
      //   notificationController.success({ message: t('common.success') });
      //   setIsLoading(false);
      //   setCurrent(0);

      // }, 1500);
      // setDisPlayConfirmAndSendBtn('block')
    }
  };

  // approve token
  const approveButton: any = async () => {
    try {
      setIsLoading(true);
      var anyValueSelected = localStorage.getItem('anyValueSelected');

      if (anyValueSelected === 'true') {
        setSendingToken(true);
        setSuccessTransation('');
        setIsApproved(true);
        setError('');

        // var tokenAddress = formValues[1].value;
        var tokenAddress = '';
        // var allocatiosn = formValues[2].value;
        var allocatiosn = '';
        formValues.forEach((item, index) => {
          if (item.name === 'Token address') {
            tokenAddress = item.value;
          }
          if (item.name === 'Allocations') {
            allocatiosn = item.value;
          }
        });
        console.log('this is token Address', tokenAddress);
        console.log('this is allocations Address', allocatiosn);

        // token contract
        const contractToken = await tokenContractInstance(tokenAddress);

        console.log('contractTOken008', contractToken);

        var {
          addressAry,
          valueAry,
          totalAmmount,
          isSpaceError,
          isInvalidTokenAddress,
          isAddreseseMatch,
          isAllocations,
          outOfLimit,
        } = await AllocationsFieldsForToken(allocatiosn, contractToken);

        if (outOfLimit == '') {
          if (isInvalidTokenAddress != true) {
            if (isAllocations === true) {
              if (isSpaceError != true) {
                console.log('is address Match', isAddreseseMatch);
                if (isAddreseseMatch != true) {
                  if (addressAry.length > 9) {
                    setAddressary(addressAry);
                    setValueAry(valueAry);
                    console.log(totalAmmount);

                    setTotalAmmount(totalAmmount);

                    var tokenContract: any = await approveTokenWithContract(tokenAddress, totalAmmount);

                    // console.log('this iis fadfadfaf', tokenContract)
                    if (tokenContract.err != true) {
                      console.log('this is current TOken Contract', tokenContract);
                      var isBNB = false;
                      setIsBNBValue(isBNB);
                      // working Here

                      var { ServiceFees, ChainFees, totalFees, error } = await getFeesDetailsForTransactions(
                        tokenAddress,
                        addressAry,
                        valueAry,
                        totalAmmount,
                        isBNB,
                      );

                      if (ServiceFees == 0) {
                        ServiceFees = { name: 'Service Fees', value: 'Authorized by holding SNIPE' };
                      } else {
                        ServiceFees = { name: 'Service Fees', value: ServiceFees };
                      }

                      if (!error) {
                        if (tokenContract.err == true) {
                          console.log('this is token Approve Error', tokenContract);
                          setError(tokenContract.msg);
                          setIsApproved(false);
                          setApprovalGiven(false);
                          setIsLoading(false);
                        } else {
                          var feesOBject = [
                            ServiceFees,
                            { name: 'Chain Fees', value: ChainFees },
                            { name: 'Total Fees', value: totalFees },
                          ];

                          setFeesData(feesOBject);

                          console.log('data returned whiled approval', tokenContract);
                          if (tokenContract.approval != false) {
                            setApprovalHash(tokenContract.approval.hash);
                            setApprovalHashLink(`https://testnet.bscscan.com/tx/${tokenContract.approval.hash}`);

                            setIsLoading(false);
                          }
                          setApprovalGiven(true);
                          console.log(tokenContract.tokenData);
                          var object = [
                            { name: 'Token Address', value: tokenAddress },
                            { name: 'Token Name', value: tokenContract.tokenData.tokenName },
                            { name: 'Token Symbol', value: tokenContract.tokenData.tokenSymbol },
                            { name: 'Token Balance', value: tokenContract.tokenData.tokenBalance },
                            { name: 'Total Amount', value: totalAmmount },
                            { name: 'Total Addresses', value: addressAry.length },
                          ];
                          setSendBNBandTokenConfirmData(object);

                          setDispayNext('block');
                          setdisPlayApprove('none');
                          setError('');
                          setIsLoading(false);
                        }
                      } else {
                        setError(error);
                        setIsApproved(false);
                        setApprovalGiven(false);
                        setIsLoading(false);
                      }
                    } else {
                      // this Error when approval erro
                      setError(tokenContract.msg);
                      setIsApproved(false);
                      setIsLoading(false);
                    }
                  } else {
                    setError('Minimum of 10  addresses required');
                    setIsApproved(false);
                    setIsLoading(false);
                  }
                } else {
                  setIsBasicAddressMatch(true);
                  setIsLoading(false);
                  setIsApproved(false);
                  setIsLoading(false);
                }
              } else {
                setError('Wrong format, check the sample format');
                setIsApproved(false);
                setApprovalGiven(false);
                setIsLoading(false);
              }
            } else {
              setError('MUST FILL ALLOCATION');
              setIsApproved(false);
              setApprovalGiven(false);
              setIsLoading(false);
            }
          } else {
            setError('insert valid token address');
            setIsApproved(false);
            setApprovalGiven(false);
            setIsLoading(false);
          }
        } else {
          setError(outOfLimit);
          setIsApproved(false);
          setApprovalGiven(false);
          setIsLoading(false);
        }
      } else {
        setError('SeLECT SNIPE SENDER OPTIONS');
        setIsApproved(false);
        setApprovalGiven(false);
        setIsLoading(false);
      }
    } catch (err) {
      console.log('this is Erro', err);
      setError('Wrong format, check the sample format');
      setIsLoading(false);
      setIsApproved(false);
      setApprovalGiven(false);
    }
  };

  const next = async () => {
    setIsLoading(true);
    settransactionSentSuccessfully(false);
    setApprovalGiven(false);
    setsendBNBBtnDispay(false);
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });

    setIsLoading(false);
  };

  const prev = () => {
    setErrorStep4('');
    setCurrent(current - 1);
    setDispayNext('none');
    setdisPlayApprove('block');
    setIsApproved(false);
    setDisPlayConfirmAndSendBtn('block');
    setSuccessTransation('');

    localStorage.removeItem('anyValueSelected');
    settransactionSentSuccessfully(false);
  };

  const onFinishSendToken = async () => {
    setIsLoading(true);
    setSendingTransaction(true);
    setErrorStep4('');

    // var tokenAddress = formValues[1].value;
    var tokenAddress = '';
    // var allocatiosn = formValues[2].value;
    var allocatiosn = '';
    formValues.forEach((item, index) => {
      if (item.name === 'Token address') {
        tokenAddress = item.value;
      }
      if (item.name === 'Allocations') {
        allocatiosn = item.value;
      }
    });

    const contractToken = await tokenContractInstance(tokenAddress);

    // var {addressAry, valueAry, totalAmmount} = await AllocationsFieldsForToken(allocatiosn,contractToken)

    var multiSenderContract_Data = await getContractMultitSender(tokenAddress, addressAry, valueAry, totalAmmount);

    console.log('this si response from multiSender', multiSenderContract_Data);

    if (multiSenderContract_Data.success == false) {
      setErrorStep4(multiSenderContract_Data);

      setIsLoading(false);
      setSuccessTransation('');
      setSuccessTransationLink('');
      setSendingTransaction(false);
      settransactionSentSuccessfully(false);
    } else {
      if (multiSenderContract_Data.transactionData != false) {
        setSuccessTransation(multiSenderContract_Data.transactionData);
        setSuccessTransationLink(`https://testnet.bscscan.com/tx/${multiSenderContract_Data.transactionData.hash}`);
        settransactionSentSuccessfully(true);
      }
      console.log('this si token transfer Data', multiSenderContract_Data);
      // setCurrent(current - 1);

      // setTimeout(() => {
      //   notificationController.success({ message: t('common.success') });
      //   setIsLoading(false);
      //   setCurrent(0);
      // }, 1500);

      setIsLoading(false);
      setDispayNext('none');
      setIsApproved(false);
      setSendingTransaction(false);
    }
  };

  const keepAddresses = () => {
    console.log('keep address buttons clicked');
    localStorage.setItem('keepAddress', 'true');
    localStorage.setItem('deleteAddress', 'false');
    setIsBasicAddressMatch(false);

    if (sendingToken == true) {
      approveButton();
    } else {
      bnbsendAndConfirmBtn();
    }
  };

  const deleteAddresses = () => {
    console.log('delete address buttons clicked');
    localStorage.setItem('deleteAddress', 'true');
    localStorage.setItem('keepAddress', 'false');
    setIsBasicAddressMatch(false);

    if (sendingToken == true) {
      approveButton();
    } else {
      bnbsendAndConfirmBtn();
    }
  };

  const steps = [
    {
      title: t('Add Your Allocation'),
    },
    // {
    //   title: t('forms.stepFormLabels.info'),
    // },
    // {
    //   title: t('forms.stepFormLabels.location'),
    // },
    {
      title: t('Confirmation'),
    },
  ];

  const formFieldsUi = [
    <Step1
      key="1"
      updateCSV={handleUpdateCSV}
      updateBtnDesciderValue={setBtnDescider}
      setError={setError}
      setIsApproved={setIsApproved}
      setdisPlayApprove={setdisPlayApprove}
      setApprovalGiven={setApprovalGiven}
      setDispayNext={setDispayNext}
    />,
    <Step4
      key="4"
      formValues={formValues}
      sendBNBandTokenConfirmData={sendBNBandTokenConfirmData}
      errors={errorStep4}
      successTransaction={successTransaction}
      successTransactionLink={successTransactionLink}
      feesData={feesData}
    />,
  ];

  // console.log("btn descider", btnDescider);
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
      <Steps labelPlacement="vertical" size="small" current={current}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} description="" />
        ))}
      </Steps>
      <div>{formFieldsUi[current]}</div>
      <div>
        <div>
          <p style={{ fontSize: '14px', textAlign: 'center', textTransform: 'uppercase', color: 'red' }}>{error}</p>
        </div>

        {isApprovalGiven ? (
          <>
            <div>
              <p style={{ fontSize: '14px', textAlign: 'center', textTransform: 'uppercase', color: 'white' }}>
                Approval Given, press next to progress.
                <br />
                <a href={approvalHashlink} target="_blank">
                  {approvalHash}
                </a>
              </p>
            </div>
          </>
        ) : (
          <></>
        )}

        {current < steps.length - 1 && (
          // <Button type="primary" onClick={() => next()}>
          <Button
            type="primary"
            onClick={() => next()}
            loading={isLoading}
            style={{ display: disPlayNext, margin: 'auto' }}
          >
            {t('forms.stepFormLabels.next')}
          </Button>
        )}

        {btnDescider === 'BNB Transfers' ? (
          <>
            {isWalletConnectedContext?.isWalletConnected ? (
              <>
                <S.ButtonWrapper style={{ display: disPlayApprove }}>
                  <Button
                    type="primary"
                    style={{ margin: 'auto', display: disPlayConfirmAndSendBtn }}
                    loading={isLoading}
                    onClick={bnbsendAndConfirmBtn}
                  >
                    {isConfirmAndSending
                      ? `Generating SNIPE multi-sender transaction, please wait`
                      : `Confirm and Send`}
                  </Button>
                </S.ButtonWrapper>
              </>
            ) : (
              <>
                <S.ButtonWrapper>
                  <Button type="ghost" style={{ margin: 'auto' }} onClick={() => setIsBasicModalVisible(true)}>
                    Confirm and Send
                  </Button>
                </S.ButtonWrapper>
              </>
            )}
          </>
        ) : (
          <>
            {isWalletConnectedContext?.isWalletConnected ? (
              <>
                <S.ButtonWrapper style={{ display: disPlayApprove }}>
                  <Button type="primary" onClick={approveButton} style={{ margin: 'auto' }} loading={isLoading}>
                    {isApproved ? `Approving` : `Approve`}
                  </Button>
                </S.ButtonWrapper>
              </>
            ) : (
              <>
                <S.ButtonWrapper>
                  <Button type="ghost" style={{ margin: 'auto' }} onClick={() => setIsBasicModalVisible(true)}>
                    Approve
                  </Button>
                </S.ButtonWrapper>
              </>
            )}
          </>
        )}

        {current === steps.length - 1 && (
          <>
            {sendBNBBtnDisplay ? (
              <>
                {transactionSentSuccessfully ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button type="primary" style={{ marginRight: '10px' }} onClick={() => prev()}>
                        Another Bulk Send
                      </Button>
                      <Button type="primary">
                        <Link to="/" className="backToHome">
                          Home
                        </Link>
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Button type="primary" onClick={sendBnbBtn} loading={isLoading} style={{ margin: 'auto' }}>
                      {sendingTransaction ? 'Generating Transaction, please wait' : `send`}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                {transactionSentSuccessfully ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <Button type="primary" style={{ marginRight: '10px' }} onClick={() => prev()}>
                        Another Bulk Send
                      </Button>

                      <Button type="primary">
                        <Link to="/" className="backToHome">
                          Home
                        </Link>
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Button type="primary" onClick={onFinishSendToken} loading={isLoading} style={{ margin: 'auto' }}>
                      {sendingTransaction ? 'Generating Transaction, please wait' : `send`}
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}

        {current > 0 && (
          <S.PrevButton type="default" onClick={() => prev()}>
            {t('forms.stepFormLabels.previous')}
          </S.PrevButton>
        )}
      </div>

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

      {/* wallet Connected */}
      <Modal
        centered
        visible={IsBasicAddressMatch}
        onOk={() => setIsBasicAddressMatch(false)}
        onCancel={() => setIsBasicAddressMatch(false)}
        size="medium"
        className="warningModel"
      >
        <BaseForm.Item
          name="Oops"
          // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
          style={{ fontSize: '20px', textAlign: 'center', margin: '0px' }}
        >
          {t('Duplicate Addresses Found')}
        </BaseForm.Item>

        <div className="addressMatchBoxButtonBox">
          <Button onClick={keepAddresses}>Keep</Button>
          <Button onClick={deleteAddresses}>Delete</Button>
        </div>
      </Modal>
    </BaseForm>
  );
};
