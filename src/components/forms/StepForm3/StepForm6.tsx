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
import { DownOutlined } from '@ant-design/icons';
import { Menu, MenuItem } from '@app/components/common/Menu/Menu';
// import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import Tooltip from '@mui/material/Tooltip';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import logo from './bnb2.png';
import { OutlinedInput } from '@mui/material';

interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export const StepForm6: React.FC = () => {
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

  const formFieldsUi = [
    <Step1 key="1" />,
    <Step2 key="2" />,
    <Step3 key="3" />,
    // <Step4 key="4" formValues={formValues} />,
  ];

  const swapData = [
    {
      id: '1',
      address: '',
      bnbDrop: 'sa',
      cakeDropdown: 'cake',
      prefrence: 'prefence',
    },
    {
      id: '2',
      address: '',
      bnbDrop: 'sa',
      cakeDropdown: 'cake',
      prefrence: 'prefence',
    },
    {
      id: '3',
      address: '',
      bnbDrop: 'sa',
      cakeDropdown: 'cake',
      prefrence: 'prefence',
    },
    {
      id: '4',
      address: '',
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
        <Typography variant="body2" sx={{ fontSize: '10px' }}>
          Token Name
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '10px' }}>
          Symbol
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '10px' }}>
          Decimals
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '10px' }}>
          Liquidity
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '10px' }}>
          Fee on transfer-sell-buy,
        </Typography>
      </Box>
    </Menu>
  );

  const prefrenceMenu = (
    <Menu style={{ padding: '10px', position: 'relative', zIndex: '1', width: '250px' }}>
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
          <Tooltip
            disableFocusListener
            title="Set Preferences"
            sx={{
              width: '10px',
            }}
          >
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
            // justifyContent: 'space-between',
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
        <Input placeholder="Days" style={{ width: '60px', height: '26px', borderRadius: '25px' }} />
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
          <Typography>B. Swap with limits orders and recuring periods</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: '20px' }}>
        <Box
          sx={{
            width: '100%',
          }}
        >
          <Grid container spacing={1}>
            <Grid item lg={1} md={1} sm={1} xs={1}>
              <Typography sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' } }}>ID</Typography>
            </Grid>
            <Grid item lg={5} md={5} sm={5} xs={5}>
              <Typography sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' } }}>ADDRESS</Typography>
            </Grid>
            {/* <Grid item lg={3} md={3} sm={3} xs={3}>
              <Typography sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' } }}>Private Keys</Typography>
            </Grid> */}
            <Grid item lg={2} md={2} sm={2} xs={2}>
              <Typography sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' } }}>Swap From</Typography>
            </Grid>
            <Grid item lg={2} md={2} sm={2} xs={2}>
              <Typography sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' } }}>Swap For</Typography>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            sx={{
              border: '1px solid white',
              mt: '20px',
              borderRadius: '10px',
              height: '250px',
              overflow: 'scroll',
              // overflow: { lg: 'hidden', md: 'hidden', sm: 'hidden', xs: 'scroll' },
              // position: 'relative',
              // zIndex: '1',
            }}
          >
            {swapData.map((v, i) => {
              return (
                <>
                  <Grid item lg={1} md={1} sm={1} xs={1}>
                    <Typography
                      sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' }, textAlign: 'justify' }}
                    >
                      {v.id}
                    </Typography>
                  </Grid>
                  <Grid item lg={5} md={5} sm={5} xs={4}>
                    {/* <Typography
                      sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' }, overflowWrap: 'anywhere' }}
                    >
                      {v.address}
                    </Typography> */}
                    <Input
                      defaultValue={v.address}
                      type="text"
                      style={{ height: '30px' }}
                      placeholder="set receiver wallet"
                    />
                  </Grid>
                  {/* <Grid item lg={3} md={3} sm={3} xs={2}>
                    <Typography
                      sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' }, overflowWrap: 'anywhere' }}
                    >
                      {v.private}
                    </Typography>
                  </Grid> */}
                  <Grid item lg={1.5} md={1.5} sm={1.5} xs={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <img src={logo} width="15px" />
                      </Box>
                      <Box sx={{ mr: { lg: '10px', md: '0px', sm: '0px', xs: '0px' } }}>
                        <Dropdown overlay={positionMenu} trigger={['click']}>
                          <Button
                            sx={{
                              padding: '0px',
                              margin: '0px',
                              fontSize: { lg: 'auto', md: 'auto', sm: 'auto', xs: '8px' },
                              color: 'white',
                            }}
                            variant="text"
                            endIcon={
                              <ExpandMoreIcon sx={{ fontSize: { lg: 'auto', md: 'auto', sm: 'auto', xs: '8px' } }} />
                            }
                            // onClick={(e) => e.preventDefault()}
                          >
                            {t('BNB')}
                          </Button>
                        </Dropdown>
                      </Box>
                      <Box
                        sx={{
                          display: { lg: 'block', md: 'block', sm: 'none', xs: 'none' },
                          width: '60px',
                          height: '27px',
                          backgroundColor: '#3e517e',
                          border: '1px solid #3e517e',
                          borderRadius: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' } }}>
                          0.0
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={1.5} md={1.5} sm={1.5} xs={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <img src={logo} width="15px" />
                      </Box>
                      <Box sx={{ mr: { lg: '10px', md: '0px', sm: '0px', xs: '0px' } }}>
                        <Dropdown overlay={positionMenu} trigger={['click']}>
                          <Button
                            sx={{
                              padding: '0px',
                              margin: '0px',
                              fontSize: { lg: 'auto', md: 'auto', sm: 'auto', xs: '8px' },
                              color: 'white',
                            }}
                            variant="text"
                            endIcon={
                              <ExpandMoreIcon sx={{ fontSize: { lg: 'auto', md: 'auto', sm: 'auto', xs: '8px' } }} />
                            }

                            // onClick={(e) => e.preventDefault()}
                          >
                            {t('CAKE')}
                          </Button>
                        </Dropdown>
                      </Box>
                      <Box
                        sx={{
                          display: { lg: 'block', md: 'block', sm: 'none', xs: 'none' },
                          width: '60px',
                          height: '27px',
                          backgroundColor: '#3e517e',
                          border: '1px solid #3e517e',
                          borderRadius: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: { lg: 'auto', md: '13px', sm: '10px', xs: '8px' } }}>
                          0.0
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item lg={3} md={3} sm={3} xs={3}>
                    <Dropdown overlay={prefrenceMenu} trigger={['click']}>
                      <Button
                        sx={{
                          padding: '0px',
                          margin: '0px',
                          fontSize: { lg: 'auto', md: 'auto', sm: 'auto', xs: '8px' },
                          color: 'white',
                        }}
                        variant="text"
                        endIcon={
                          <ExpandMoreIcon sx={{ fontSize: { lg: 'auto', md: 'auto', sm: 'auto', xs: '8px' } }} />
                        }
                      >
                        {t('SET PREFERENCES')}
                      </Button>
                    </Dropdown>
                  </Grid>
                </>
              );
            })}
          </Grid>
        </Box>
      </Box>
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
