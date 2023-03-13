import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { Box, Typography, Grid, IconButton, Button } from '@mui/material';
import { Switch } from '@app/components/common/Switch/Switch';
import { Input } from '@app/components/common/inputs/Input/Input';
import { Radio, RadioGroup, RadioChangeEvent } from '@app/components/common/Radio/Radio';
// import { Button } from '@app/components/common/buttons/Button/Button';
import { Table } from '@app/components/common/Table/Table';
import { useMounted } from '@app/hooks/useMounted';
import { ColumnsType } from 'antd/es/table';
import { BasicTableRow, getBasicTableData, Pagination, Tag } from 'api/table.api';
import { Col, Row, Space, TablePaginationConfig } from 'antd';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { Modal } from '@app/components/common/Modal/Modal';
import { DownOutlined } from '@ant-design/icons';
import { Menu, MenuItem } from '@app/components/common/Menu/Menu';
// import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import Tooltip from '@mui/material/Tooltip';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import logo from './bnb2.png';
import Chart from './Chart/Chart';

interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export const StepForm5: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [form] = BaseForm.useForm();
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

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      notificationController.success({ message: t('common.success') });
      setIsLoading(false);
      setCurrent(0);
    }, 1500);
  };

  const steps = [
    {
      title: t('Choice Service'),
    },
    {
      title: t('Pay and obtain service'),
    },
    {
      title: t('Confirmation'),
    },
  ];

  const formFieldsUi = [<Step1 key="1" />, <Step2 key="2" />, <Step3 key="3" />];

  const swapData = [
    {
      id: '1',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      private: 'Private key 1 : animal free easy',
      bnbDrop: 'sa',
      cakeDropdown: 'cake',
      prefrence: 'prefence',
    },
    {
      id: '2',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      private: 'Private key 1 : animal free easy',
      bnbDrop: 'sa',
      cakeDropdown: 'cake',
      prefrence: 'prefence',
    },
    {
      id: '3',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      private: 'Private key 1 : animal free easy',
      bnbDrop: 'sa',
      cakeDropdown: 'cake',
      prefrence: 'prefence',
    },
    {
      id: '4',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      private: 'Private key 1 : animal free easy',
      bnbDrop: 'sa',
      cakeDropdown: 'cake',
      prefrence: 'prefence',
    },
  ];

  const [value, setValue] = useState();

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };

  const positionMenu = (
    <Menu style={{ padding: '10px', width: '200px' }}>
      <Box sx={{ mb: '10px' }}>
        <Input placeholder="Paste address" />
      </Box>
      <Box>
        <Typography variant="body2">Token Name</Typography>
        <Typography variant="body2">Symbol</Typography>
        <Typography variant="body2">Decimals</Typography>
        <Typography variant="body2">Liquidity</Typography>
        <Typography variant="body2">Fee on transfer-sell-buy,</Typography>
      </Box>
    </Menu>
  );

  const prefrenceMenu = (
    <Menu style={{ padding: '10px', width: '250px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          mb: '20px',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '12px' }}>SET PREFERENCES</Typography>
        </Box>
        <Box sx={{ ml: '10px' }}>
          <Tooltip disableFocusListener title="Set Preferences">
            <IconButton
              sx={{
                border: '1px solid white',
                borderRadius: '50%',
                width: '10px',
                height: '10px',
              }}
            >
              <QuestionMarkIcon sx={{ fontSize: '9px', color: 'white' }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ mb: '10px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
          }}
        >
          <Box sx={{ mr: '10px', fontSize: '10px' }}>{t('Set Date')}</Box>
          <Box>
            <RadioGroup onChange={onChange} value={value}>
              <Radio value="1" />
            </RadioGroup>
          </Box>
        </Box>
        {/* <DayjsDatePicker style={{ width: '100%', height: '26px' }} /> */}
        <input
          type="date"
          style={{
            width: '100%',
            height: '26px',
            backgroundColor: '#25284B',
            color: '#9292a0',
            border: '1px solid #a9a9a9',
            borderRadius: '25px',
            fontSize: '16px',
            padding: '11.4px 11px',
          }}
        ></input>
      </Box>
      <Box sx={{ mb: '10px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Box sx={{ mr: '10px', fontSize: '10px' }}>{t('Set Price Limit')}</Box>
          <Box>
            <RadioGroup onChange={onChange} value={value}>
              <Radio value="2" />
            </RadioGroup>
          </Box>
        </Box>
        <Input style={{ width: '80px', height: '26px', borderRadius: '25px' }} />
      </Box>
      <Box sx={{ mb: '30px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
          }}
        >
          <Box sx={{ mr: '10px', fontSize: '10px' }}>{t('Recurring')}</Box>
          <Box>
            <RadioGroup onChange={onChange} value={value}>
              <Radio value="3" />
            </RadioGroup>
          </Box>
        </Box>
        <Input placeholder="Days" style={{ width: '65px', height: '26px', borderRadius: '25px' }} />
      </Box>
      <Box>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            // justifyContent: 'space-between',
          }}
        >
          <Box sx={{ mr: '10px', fontSize: '10px' }}>{t('All wallets')}</Box>
          <Box>
            <RadioGroup onChange={onChange} value={value}>
              <Radio value="4" />
            </RadioGroup>
          </Box>
        </Box>
      </Box>
    </Menu>
  );

  const [IsBasicModalVisible, setIsBasicModalVisible] = useState(false);
  const [IsBasicModalVisible1, setIsBasicModalVisible1] = useState(false);
  const [switchStatus, setswitchStatus] = useState(false);
  const [switchStatus1, setswitchStatus1] = useState(false);

  const handleSwitch = () => {
    setswitchStatus(!switchStatus);
  };
  const handleSwitch1 = () => {
    setswitchStatus1(!switchStatus1);
  };

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
      {/* <Steps labelPlacement="vertical" size="small" current={current}>
        {steps.map((item) => (
          <Steps.Step key={item.title} title={item.title} description="" />
        ))}
      </Steps> */}
      {/* <div>{formFieldsUi[current]}</div> */}
      <Box>
        <Box sx={{ mb: '10px' }}>
          <Typography>B. Connect wallet and swap with limits orders and recurring periods</Typography>
        </Box>
      </Box>
      <Box sx={{ width: '100%', mt: '50px' }}>
        <Grid container spacing={2}>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Box>
              <Chart />
            </Box>
          </Grid>

          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid item lg={3} md={3} sm={3} xs={6}>
                    <Typography>Swap From</Typography>
                  </Grid>
                  <Grid item lg={3} md={3} sm={3} xs={6}>
                    <Typography>Swap For</Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  spacing={1}
                  sx={{
                    border: '1px solid white',
                    mt: '20px',
                    borderRadius: '10px',
                    height: { lg: '80px', md: '80px', sm: '80px', xs: 'auto' },
                    width: '100%',
                    // overflow: 'scroll',
                  }}
                >
                  <Grid item lg={4} md={4} sm={4} xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <img src={logo} width="20px" />
                      </Box>
                      <Box sx={{ mr: '10px' }}>
                        <Dropdown overlay={positionMenu} trigger={['click']}>
                          <Button
                            sx={{ padding: '0px', margin: '0px', color: 'white' }}
                            variant="text"
                            // onClick={(e) => e.preventDefault()}
                          >
                            {t('BNB')} <DownOutlined />
                          </Button>
                        </Dropdown>
                      </Box>
                      <Box
                        sx={{
                          width: '60px',
                          height: '27px',
                          backgroundColor: '#3e517e',
                          border: '1px solid #3e517e',
                          borderRadius: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <Typography>0.0</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={4} md={4} sm={4} xs={12}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <img src={logo} width="20px" />
                      </Box>
                      <Box sx={{ mr: '10px' }}>
                        <Dropdown overlay={positionMenu} trigger={['click']}>
                          <Button
                            variant="text"
                            sx={{ padding: '0px', margin: '0px', color: 'white' }}
                            // onClick={(e) => e.preventDefault()}
                          >
                            {t('CAKE')} <DownOutlined />
                          </Button>
                        </Dropdown>
                      </Box>
                      <Box
                        sx={{
                          width: '60px',
                          height: '27px',
                          backgroundColor: '#3e517e',
                          border: '1px solid #3e517e',
                          borderRadius: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <Typography>0.0</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={4} md={4} sm={4} xs={12}>
                    {/* <Dropdown overlay={prefrenceMenu} trigger={['click']}> */}
                    <Button
                      sx={{ padding: '0px', margin: '0px', color: 'white' }}
                      variant="text"
                      onClick={() => setIsBasicModalVisible1(true)}
                    >
                      {t('SET PREFERENCES')} <DownOutlined />
                    </Button>
                    {/* </Dropdown> */}
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Modal
        centered
        visible={IsBasicModalVisible1}
        onOk={() => setIsBasicModalVisible1(false)}
        onCancel={() => setIsBasicModalVisible1(false)}
        size="medium"
        className="warningModel"
        // style={{
        //   height: '500px',
        //   overflowY: 'scroll',
        // }}
      >
        <BaseForm.Item
          name="Oops"
          // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
          style={{ fontSize: '20px', margin: '0px' }}
        >
          <Box>
            <Box>
              <Box sx={{ mb: '10px' }}>
                {/* <Typography>SET PREFERNCES</Typography> */}
                {t('SET PREFERENCES')}
              </Box>
              <Box>
                <Typography variant="body2">Selected Pair :</Typography>
                <Typography variant="body2">BNB - CAKE</Typography>
              </Box>
              <Box
                sx={{
                  // width: '50%',
                  mt: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  // justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Box>
                    <Typography variant="body2">BNB Balance:</Typography>
                  </Box>
                  <Box
                    sx={{
                      border: '1px solid #339cfd',
                      borderRadius: '12px',
                      width: '100px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2">0.00</Typography>
                  </Box>
                </Box>
                <Box sx={{ ml: '20px' }}>
                  <Box>
                    <Typography variant="body2">CAKE Balance:</Typography>
                  </Box>
                  <Box
                    sx={{
                      border: '1px solid #339cfd',
                      borderRadius: '12px',
                      width: '100px',
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2">0.00</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: '10px', mb: '5px' }}>
                <Typography variant="body2">Current Price:</Typography>
              </Box>
              <Box
                sx={{
                  // width: '50%',
                  display: 'flex',
                  flexDirection: { lg: 'row', md: 'row', sm: 'row', xs: 'column' },
                  // justifyContent: 'space-between',
                  mt: '10px',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body2">BNB</Typography>
                  </Box>
                  <Box
                    sx={{
                      border: '1px solid #339cfd',
                      borderRadius: '12px',
                      width: '100px',
                      textAlign: 'center',
                      ml: '5px',
                    }}
                  >
                    <Typography variant="body2">0.00</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    ml: { lg: '20px', md: '20px', sm: '20px', xs: '0px' },
                    mt: { lg: '0px', md: '0px', sm: '0px', xs: '10px' },
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="body2">CAKE</Typography>
                  </Box>
                  <Box
                    sx={{
                      border: '1px solid #339cfd',
                      borderRadius: '12px',
                      width: '100px',
                      textAlign: 'center',
                      ml: '5px',
                    }}
                  >
                    <Typography variant="body2">0.00</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: '10px' }}>
                <Box>
                  <Typography variant="body2">Gas in Gwei</Typography>
                </Box>
                <Box>
                  <Input placeholder="0.00" style={{ width: '100px', height: '26px', borderRadius: '20px' }} />
                </Box>
                {/* <Box
                  sx={{
                    border: '1px solid darkgray',
                    borderRadius: '12px',
                    width: '100px',
                    textAlign: 'center',
                    backgroundColor: 'gray',
                  }}
                >
                  <Typography variant="body2">0.00</Typography>
                </Box> */}
              </Box>
              <Box sx={{ mt: '10px' }}>
                <Box>
                  <Typography variant="body2">SLIPPAGE</Typography>
                </Box>  
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Input placeholder="0.00" style={{ width: '100px', height: '26px', borderRadius: '20px' }} />
                  </Box>
                  {/* <Box
                    sx={{
                      border: '1px solid darkgray',
                      borderRadius: '12px',
                      width: '100px',
                      textAlign: 'center',
                      backgroundColor: 'gray',
                    }}
                  >
                    <Typography variant="body2">0.00</Typography>
                  </Box> */}
                  <Box>
                    <Typography>%</Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: '10px' }}>
                <Typography variant="body2">Set Dex router</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: 'space-around',
                }}
              >
                <Box>
                  <Typography variant="body2">Pancakeswap</Typography>
                </Box>
                <Box sx={{ ml: '10px' }}>
                  <Typography variant="body2" sx={{ color: '#339cfd' }}>
                    Uniswap
                  </Typography>
                </Box>
                <Box sx={{ ml: '10px' }}>
                  <Typography variant="body2">1inch</Typography>
                </Box>
                <Box sx={{ ml: '10px' }}>
                  <Typography variant="body2">SushiSwap</Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="body2">Anti-bot (MEV Bot)</Typography>
                </Box>
                <Box>
                  <Switch onClick={handleSwitch} checked={switchStatus} />
                </Box>
              </Box>
              <Box sx={{ mt: '10px' }}>
                <Box>
                  <Typography variant="body2">Set Execution</Typography>
                </Box>
                <Box>
                  <Typography variant="body2">Time and Triggering</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: '10px' }}>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    height: '26px',
                    backgroundColor: '#25284B',
                    color: '#9292a0',
                    border: '1px solid #a9a9a9',
                    borderRadius: '25px',
                    fontSize: '16px',
                    padding: '11.4px 11px',
                  }}
                ></input>
              </Box>
              <Box sx={{ mt: '10px' }}>
                <Button
                  variant="text"
                  sx={{
                    textTransform: 'capitalize',
                    color: 'white',
                  }}
                  onClick={() => setIsBasicModalVisible(true)}
                >
                  Recurring
                </Button>
              </Box>
              <Box
                sx={{
                  mt: '10px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="body2">Set for all wallets</Typography>
                </Box>
                <Box>
                  <Switch onClick={handleSwitch1} checked={switchStatus1} />
                </Box>
              </Box>
              <Box sx={{ mt: '20px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <Button variant="contained">Confirm & Swap</Button>
              </Box>
            </Box>
            <Modal
              centered
              visible={IsBasicModalVisible}
              onOk={() => setIsBasicModalVisible(false)}
              onCancel={() => setIsBasicModalVisible(false)}
              size="medium"
              className="warningModel"
              // style={{
              //   height: '500px',
              //   width:'100px',
              //   overflowY: 'scroll',
              // }}
            >
              <BaseForm.Item
                name="Oops"
                // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
                style={{ fontSize: '20px', margin: '0px' }}
              >
                <Box>
                  <Box>
                    {t('Recurring')}
                    <Box>
                      <Box sx={{ mt: '10px' }}>
                        <Button variant="text" sx={{ textTransform: 'capitalize', color: 'white' }}>
                          Daily
                        </Button>
                      </Box>
                      <Box sx={{ mt: '10px' }}>
                        <Button variant="text" sx={{ textTransform: 'capitalize', color: 'white' }}>
                          Weekly
                        </Button>
                      </Box>
                      <Box sx={{ mt: '10px' }}>
                        <Button variant="text" sx={{ textTransform: 'capitalize', color: 'white' }}>
                          Monthly
                        </Button>
                      </Box>
                    </Box>
                    <Box sx={{ mt: '30px' }}>
                      <Box>
                        <Typography variant="body2">Custom</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Typography variant="body2">Every</Typography>
                        </Box>
                        <Box sx={{ ml: '30px' }}>
                          <Input placeholder="Hours" style={{ width: '130px', height: '26px', borderRadius: '20px' }} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </BaseForm.Item>
            </Modal>
          </Box>
        </BaseForm.Item>
      </Modal>
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
