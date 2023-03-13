import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRef } from 'react';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Step1 } from './Steps/Step1';
import { Step2 } from './Steps/Step2';
import { Step3 } from './Steps/Step3';
import { Step4 } from './Steps/Step4';
import { notificationController } from '@app/controllers/notificationController';
// import { Dates } from '@app/constants/Dates';
import { mergeBy } from '@app/utils/utils';
import * as S from './StepForm.styles';
import { Steps } from './StepForm.styles';
import { Box, Typography } from '@mui/material';
import { Switch } from '@app/components/common/Switch/Switch';
import { Input } from '@app/components/common/inputs/Input/Input';
import { Radio, RadioGroup, RadioChangeEvent } from '@app/components/common/Radio/Radio';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Table } from '@app/components/common/Table/Table';
import { Modal, InfoModal, SuccessModal, WarningModal, ErrorModal } from '@app/components/common/Modal/Modal';
import { ColumnsType } from 'antd/es/table';
import { defineColorByPriority } from '@app/utils/utils';
import { useMounted } from '@app/hooks/useMounted';
import { BasicTableRow, getBasicTableData, Pagination } from 'api/serviceFee.api';
import { Col, Row, Space, TablePaginationConfig } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import Timer from '@app/components/common/Timer/Timer';
import Grid from '@mui/material/Grid';
// import { generateMultipleWallets } from '@app/utils/hooks/snipeTool';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import './style.css';

import {
  checkPlan,
  approveWallets,
  checkIfUserBoughtPlan,
  getExpiry,
  extendPlan,
  checkIfUserAuthorizedToUse,
  checkIfFees_In_BNB,
} from '../Form2Controllers/controller';
import { fontWeight } from '@mui/system';

interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

interface IProps {
  setMultipleWallets: Dispatch<SetStateAction<any>>;
}

export const StepForm2: React.FC<IProps> = ({ setMultipleWallets }: IProps) => {
  let navigate = useNavigate();
  const ref = useRef(null);
  const isWalletConnectedContext = useContext(AppCtx);
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
  const [numberOfWallet, setNumbofWallet] = useState<any>(0);
  const [valueRadio, setValueRadio] = useState<string>('');
  const [switchStatus, setswitchStatus] = useState(false);
  const [IsBasicModalVisible, setIsBasicModalVisible] = useState(false);
  const [showEror, setErr] = useState<string>('');
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isPlanBouhgt, setPlanBought] = useState<boolean>(false);
  const [WalletConnected, setWalltedConected] = useState<any>(false);
  const [remainPlanTime, setRemainPlanTime] = useState<any>(0);
  const [currentDateStatic, setcurrentDateStatic] = useState<any>('');
  const [expirePlan, setRemainExpiryPlan] = useState<any>('');
  const [FullExpirayDate, setFullExpirayDate] = useState<any>('');
  const [remianTimeObj, setRemainTimeObj] = useState<any>('');
  const [isUserAuthorized, setUserAuthorized] = useState<boolean>(false);
  const [fields, setFields] = useState<FieldData[]>([
    { name: 'login', value: 'Jerri' },
    { name: 'password', value: '123456' },
    { name: 'confirmPassword', value: '123456' },
    { name: 'salutation', value: 'mr' },
    { name: 'gender', value: 'male' },
    { name: 'firstName', value: 'John' },
    { name: 'lastName', value: 'Black' },
    // { name: 'birthday', value: Dates.getDate(1576789200000) },
    { name: 'phone', value: '298573124' },
    { name: 'email', value: '' },
    { name: 'address1', value: 'Slobodskay street' },
    { name: 'address2', value: 'Nevski street' },
    { name: 'zipCode', value: '435123' },
    { name: 'city', value: 'Minsk' },
    { name: 'country', value: 'Belarus' },
    { name: 'prefix', value: '+7' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const formLabels: FormValues = {
    login: t('forms.stepFormLabels.login'),
    password: t('common.password'),
    confirmPassword: t('common.confirmPassword'),
    salutation: t('forms.stepFormLabels.salutation'),
    gender: t('forms.stepFormLabels.gender'),
    firstName: t('common.firstName'),
    lastName: t('common.lastName'),
    birthday: t('forms.stepFormLabels.birthday'),
    phone: t('common.phone'),
    email: t('common.email'),
    address1: `${t('common.address')} 1`,
    address2: `${t('common.address')} 2`,
    zipCode: t('common.zipcode'),
    city: t('common.city'),
    country: t('common.country'),
  };

  const formValues = fields
    .filter((item) => item.name !== 'prefix')
    .map((item) => ({
      name: formLabels[item.name],
      value: String(item.name === 'birthday' && item.value ? item.value.format('YYYY-MM-DD') : item.value),
    }));

  const next = () => {
    form.validateFields().then(() => {
      setCurrent(current + 1);
    });
  };

  // input on change
  const inputWalletNumber = (e: any) => {
    var value = e.target.value;
    setNumbofWallet(value);
    console.log('entered Values are', value);
    if (Number(value) <= 1000) {
      console.log('this is value of inputfield', value);
      console.log('this is Radio Selected', valueRadio);
      if (isPlanBouhgt != true) {
        setIsApproved(false);
        setValueRadio('');
      }
      setErr('');
    } else {
      setErr('max 1000 wallets at once');
    }
  };

  const approveBTN = async () => {
    try {
      setIsLoading(true);
      setErr('');
      console.log('ehese arenumberOfWallet', numberOfWallet);
      var result: any = await approveWallets(valueRadio, numberOfWallet);
      if (result.success == true) {
        setTimeout(() => {
          setIsLoading(false);
          setIsApproved(true);
          payAngGenerateBtn();
        }, 10000);
      } else {
        setIsLoading(false);
        setIsApproved(false);
        setErr(result.msg);
      }
    } catch (err) {
      setIsApproved(false);
      setErr(result?.msg);
      console.log('err while approving', err);
    }
  };

  // pay and Generate Button
  const payAngGenerateBtn = async () => {
    try {
      if (numberOfWallet <= 1000) {
        setIsLoading(true);
        setErr('');
        console.log(numberOfWallet);

        console.log('this is value of Radio', valueRadio);
        // var fee = value;

        var result: any = await checkPlan(valueRadio, numberOfWallet);
        console.log('this is result007', result);

        if (result.success == true) {
          setIsLoading(false);
          setMultipleWallets(result.data);
          if (valueRadio == '2' || valueRadio == '3') {
            // setPlanBought(true);
            setValueRadio('007');
            setPlanBought(false);
            setTimeout(() => {
              // console.log('extend Plan Button TimeOut WorkingAlso');
              checkIfUserboutPlan();
            }, 2000);
          }
          var mainElm: any = document.getElementById('main-content');
          mainElm.scrollTop = mainElm.scrollHeight;
          console.log('this is document', mainElm);
        } else {
          if (valueRadio == '007') {
            setIsApproved(true);
          } else {
            setIsApproved(false);
          }
          setIsLoading(false);
          setErr(result.msg);
        }
      } else {
        setErr('MAX 1000 WALLETS AT ONCE');
      }
    } catch (err) {
      // setIsApproved(false);
      if (valueRadio == '007') {
        setIsApproved(true);
      } else {
        setIsApproved(false);
      }
      setIsLoading(false);
      console.log('this is Err', err);
    }
  };

  // plan Timer remain Plan Timer
  const checkIfUserboutPlan = async () => {
    try {
      console.log('this is checkIf User about Plan');
      var result: any = await checkIfUserBoughtPlan(isWalletConnectedContext?.isWalletConnected);
      console.log('this is result', result);
      if (result.isBoughtPlan == true) {
        setValueRadio('007');
        setIsApproved(true);
        // console.log('this is planExpiray', result.checkExpiray);
        setRemainPlanTime(result.checkExpiray);

        var newDate: any = new Date();
        const dt: any = Date.parse(newDate);
        newDate = dt / 1000;
        newDate = Number(newDate) + Number(result.checkExpiray);

        setPlanBought(result.isBoughtPlan);
        setFullExpirayDate(newDate);
      } else {
        setPlanBought(result.isBoughtPlan);
        setValueRadio('');
        setIsApproved(false);
      }
    } catch (err) {
      // console.log('this is err', err);
    }
  };

  //  this useEffect will run when user will connect Wallet
  useEffect(() => {
    setTimeout(() => {
      checkIfUserboutPlan();
    }, 2000);
  }, [isWalletConnectedContext?.isWalletConnected]);

  //
  //
  //

  //
  //
  //
  //
  // check if use has bought Plan

  //
  //
  //

  // extend Plan
  const extendPlanFun = async () => {
    try {
      console.log('extend Plan Button Working', valueRadio);
      setErr('');
      setRemainPlanTime('000000');
      setIsLoading(true);
      var result: any = await extendPlan(valueRadio);
      if (result.success == true) {
        setErr('');
        setIsLoading(false);
        setPlanBought(false);
        setTimeout(() => {
          // console.log('extend Plan Button TimeOut WorkingAlso');
          checkIfUserboutPlan();
        }, 2000);
      } else {
        setErr(result.msg);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
    }
  };

  //
  //
  //

  //
  //
  //

  const formFieldsUi = [
    <Step1 key="1" />,
    <Step2 key="2" />,
    <Step3 key="3" />,
    // <Step4 key="4" formValues={formValues} />,
  ];

  const handleSwitch = () => {
    setswitchStatus(!switchStatus);
  };

  const onChangeRadioFunc = async (e: RadioChangeEvent) => {
    // console.log('value of radioBtn', e.target.value);
    setIsApproved(false);
    setValueRadio(e.target.value);
    var result = await checkIfFees_In_BNB(e.target.value);
  };

  const [tableData, setTableData] = useState<{ data: BasicTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const { isMounted } = useMounted();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getBasicTableData(pagination).then((res) => {
        if (isMounted.current) {
          setTableData({ data: res.data, pagination: res.pagination, loading: false });
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: TablePaginationConfig) => {
    fetch(pagination);
  };

  const columns: ColumnsType<BasicTableRow> = [
    {
      title: t('Services Fees'),
      dataIndex: 'seviceFee',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('Pay Per Use'),
      dataIndex: 'pay',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('1 Month'),
      dataIndex: 'month',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('1 Year'),
      dataIndex: 'year',
      render: (text: string) => {
        return (
          <>
            <Row gutter={[10, 10]}>
              <Col>
                <span>{text}</span>
              </Col>
            </Row>
            <Row gutter={[10, 10]}>
              <Col>
                <span style={{ color: '#faac4d' }}>Save 33% now!</span>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const [showWalletSec, setShowWalletSec] = useState(false);
  const [showWalletSec1, setShowWalletSec1] = useState(false);

  setInterval(function () {
    if (localStorage.getItem('A1') === 'A1' || localStorage.getItem('A1') === 'A2') {
      setShowWalletSec(true);
    } else {
      setShowWalletSec(false);
    }
  }, 1000);

  // useEffect(() => {
  //   if (localStorage.getItem('A1') === 'A1') {
  //     setShowWalletSec(true);
  //   }
  // }, []);

  useEffect(() => {
    localStorage.removeItem('A1');
    localStorage.removeItem('B1');
  }, []);

  return (
    <BaseForm
      name="stepForm2"
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: '10px',
          mb: '30px',
        }}
      >
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid item lg={6} md={6} sm={12} xs={12} sx={{ display: 'flex' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography>Services Fees Table</Typography>
              </Box>
              <Box sx={{ ml: '20px' }}>
                <Switch onClick={handleSwitch} checked={switchStatus} />
              </Box>
            </Box>
          </Grid>
          {/* Remain Timer COmponent */}
          <Grid item lg={6} md={6} sm={12} xs={12} className="TimerBox">
            <Box>{isPlanBouhgt ? <Timer expiryTime={remainPlanTime} /> : ''}</Box>
          </Grid>
        </Grid>
      </Box>

      {switchStatus ? (
        <Box>
          <Table
            columns={columns}
            dataSource={tableData.data}
            pagination={tableData.pagination}
            loading={tableData.loading}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            bordered
          />
        </Box>
      ) : (
        ''
      )}

      {showWalletSec ? (
        <Box>
          <Box>
            <Box sx={{ mb: '10px' }}>
              <Typography>Wallet</Typography>
            </Box>
            <Box>
              <Input
                placeholder="Input the number of wallet to generate max 1000 wallets at time"
                onChange={inputWalletNumber}
                min="0"
                type="number"
              />
            </Box>

            <>
              {isWalletConnectedContext?.isAuthorizedUser ? (
                <></>
              ) : (
                <>
                  <Box sx={{ mt: '20px', mb: '10px' }}>
                    {isPlanBouhgt ? (
                      <>
                        <Typography>Extend Plan</Typography>
                      </>
                    ) : (
                      <>
                        <Typography>Pay and Generate</Typography>
                      </>
                    )}
                  </Box>

                  {isPlanBouhgt ? (
                    <>
                      <Box
                        sx={{
                          // width: { lg: '48%', md: '60%', sm: '100%', xs: '100%' },
                          display: 'flex',
                          flexDirection: { lg: 'row', md: 'row', sm: 'row', xs: 'column' },
                          justifyContent: 'space-around',
                          mt: '30px',
                          width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            width: { lg: '20%', md: '40%', sm: '40%', xs: '100%' },
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box>{t('Extend For 1 Month')}</Box>
                          <Box>
                            <RadioGroup onChange={onChangeRadioFunc} value={valueRadio}>
                              <Radio value="2" />
                            </RadioGroup>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: { lg: '40%', md: '50%', sm: '50%', xs: '100%' },
                            margin: 'auto',
                            // width: '100%',
                          }}
                        >
                          <Box>{t('Extend For 1 Year')}</Box>
                          <Box>
                            <RadioGroup onChange={onChangeRadioFunc} value={valueRadio}>
                              <Radio value="3" />
                            </RadioGroup>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          width: { lg: '48%', md: '60%', sm: '100%', xs: '100%' },
                          display: 'flex',
                          flexDirection: { lg: 'row', md: 'row', sm: 'row', xs: 'column' },
                          justifyContent: 'space-around',
                          mt: '30px',
                          // width: '100%',
                        }}
                      >
                        <Box
                          sx={{
                            width: { lg: '25%', md: '25%', sm: '25%', xs: '100%' },
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box>{t('Pay per use')}</Box>

                          <Box>
                            <RadioGroup onChange={onChangeRadioFunc} value={valueRadio}>
                              <Radio value="1" />
                            </RadioGroup>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            width: { lg: '20%', md: '20%', sm: '20%', xs: '100%' },
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box>{t('1 Month')}</Box>
                          <Box>
                            <RadioGroup onChange={onChangeRadioFunc} value={valueRadio}>
                              <Radio value="2" />
                            </RadioGroup>
                          </Box>
                        </Box>

                        <Box
                          sx={{
                            width: { lg: '20%', md: '20%', sm: '20%', xs: '100%' },
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Box>{t('1 Year')}</Box>
                          <Box>
                            <RadioGroup onChange={onChangeRadioFunc} value={valueRadio}>
                              <Radio value="3" />
                            </RadioGroup>
                          </Box>
                        </Box>
                      </Box>
                    </>
                  )}
                </>
              )}
            </>
          </Box>
          <Box sx={{ marginTop: '50px' }}>
            {/* show Erro */}
            <Typography sx={{ textTransform: 'uppercase', fontSize: '14px', color: 'red', textAlign: 'center' }}>
              {showEror}
              {/* How are you */}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                // mt: '0px',
                mt: '20px',
              }}
            >
              {isWalletConnectedContext?.isWalletConnected ? (
                <>
                  {isApproved ? (
                    <>
                      {isPlanBouhgt ? (
                        <>
                          <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid item lg={4} md={4} sm={12} xs={12} sx={{ display: 'flex' }}>
                              <Button
                                disabled={numberOfWallet === 0 || numberOfWallet === '' ? true : false}
                                type="primary"
                                onClick={payAngGenerateBtn}
                                loading={isLoading}
                                block
                                style={{ whiteSpace: 'normal', height: 'auto' }}
                                className="ResponsiveButton"
                              >
                                {isLoading ? <>GENERATING</> : 'GENERATE'}
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <>
                          {isLoading ? (
                            <>
                              <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ display: 'flex' }}>
                                  <Button
                                    disabled={numberOfWallet === 0 && valueRadio == '007' ? true : false}
                                    type="primary"
                                    onClick={payAngGenerateBtn}
                                    loading={isLoading}
                                    block
                                    style={{ whiteSpace: 'normal', height: 'auto' }}
                                    className="ResponsiveButton"
                                  >
                                    PLEASE WAIT, WALLETS ARE BEING GENERATED
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ display: 'flex' }}>
                                  <Button
                                    disabled={numberOfWallet === 0 && valueRadio == '007' ? true : false}
                                    type="primary"
                                    onClick={payAngGenerateBtn}
                                    loading={isLoading}
                                    block
                                    style={{ whiteSpace: 'normal', height: 'auto' }}
                                    className="ResponsiveButton"
                                  >
                                    PAY AND GENERATE
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {isPlanBouhgt ? (
                        <>
                          <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Grid item lg={4} md={4} sm={12} xs={12} sx={{ display: 'flex' }}>
                              <Button
                                disabled={valueRadio === '' ? true : false}
                                type="primary"
                                onClick={extendPlanFun}
                                loading={isLoading}
                                block
                                style={{ whiteSpace: 'normal', height: 'auto' }}
                                className="ResponsiveButton"
                              >
                                {isLoading ? 'UPDATING PLAN' : 'EXTEND PLAN'}
                              </Button>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <>
                          {isWalletConnectedContext?.isAuthorizedUser ? (
                            <>
                              <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ display: 'flex' }}>
                                  <Button
                                    disabled={numberOfWallet === 0 || numberOfWallet === '' ? true : false}
                                    type="primary"
                                    onClick={payAngGenerateBtn}
                                    loading={isLoading}
                                    block
                                    style={{ whiteSpace: 'normal', height: 'auto' }}
                                    className="ResponsiveButton"
                                  >
                                    {isLoading ? <>GENERATING</> : 'GENERATE'}
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          ) : (
                            <>
                              <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ display: 'flex' }}>
                                  <Button
                                    disabled={numberOfWallet === 0 || valueRadio === '' ? true : false}
                                    type="primary"
                                    onClick={approveBTN}
                                    loading={isLoading}
                                    block
                                    style={{ whiteSpace: 'normal', height: 'auto' }}
                                    className="ResponsiveButton"
                                  >
                                    {isLoading ? 'APPROVING' : 'APPROVE TO PAY AND GENERATE'}
                                  </Button>
                                </Grid>
                              </Grid>
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  <Grid container sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ display: 'flex' }}>
                      <Button
                        // disabled={numberOfWallet === 0 || valueRadio === '' ? true : false}
                        type="ghost"
                        onClick={() => {
                          setIsBasicModalVisible(true);
                        }}
                        loading={isLoading}
                        block
                        style={{ whiteSpace: 'normal', height: 'auto' }}
                        className="ResponsiveButton"
                      >
                        {t('APPROVE TO PAY AND GENERATE')}
                      </Button>
                    </Grid>
                  </Grid>
                </>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        ''
      )}
      {/* Modal to show if wallet not connected */}
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

      {/* <Steps labelPlacement="vertical" size="small" current={current}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} description="" />
        ))}
      </Steps> */}
      {/* <div>{formFieldsUi[current]}</div> */}

      {/* <div>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            {t('forms.stepFormLabels.next')}
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={onFinish} loading={isLoading}>
            {t('forms.stepFormLabels.done')}
          </Button>
        )}
        {current > 0 && (
          <S.PrevButton type="default" onClick={() => prev()}>
            {t('forms.stepFormLabels.previous')}
          </S.PrevButton>
        )}
      </div> */}
    </BaseForm>
  );
};
