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
import { Box, Typography, Button, TextField } from '@mui/material';
import { Switch } from '@app/components/common/Switch/Switch';
import { Input } from '@app/components/common/inputs/Input/Input';
import { Radio, RadioGroup, RadioChangeEvent } from '@app/components/common/Radio/Radio';
// import { Button } from '@app/components/common/buttons/Button/Button';
import DownloadIcon from '@mui/icons-material/Download';

interface FormValues {
  [key: string]: string | undefined;
}

interface FieldData {
  name: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

interface StepForm3 {
  MultipleWallets: any;
}

export const StepForm3: React.FC<StepForm3> = ({ MultipleWallets }) => {
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

  const Data = [
    {
      id: '1',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '2',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '3',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '4',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '5',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '6',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '7',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '8',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '9',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '10',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '11',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '12',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
    {
      id: '13',
      address: '0xfBKiiytBKiisjaoJJIksaiIji54V',
      privateKey: 'animal free easy',
    },
  ];

  //  const download = (event:any) => {
  //     event.preventDefault();
  //   	// Prepare the file
  //     let output:any;
  //     if (this.MultipleWallets.fileType === "json") {
  //     	output = JSON.stringify({states: this.MultipleWallets.data},
  //       	null, 4);
  //     } else if (this.MultipleWallets.fileType === "csv"){
  //       // Prepare data:
  //       let contents = [];
  //       contents.push (["publickeys" , "PrivateKeys"]);
  //       this.MultipleWallets.data.forEach(row:any => {
  //       	contents.push([row.MultipleWallets, row.electors])
  //       });
  //       output = this.makeCSV(contents);
  //     } else if (this.MultipleWallets.fileType === "text"){
  //       // Prepare data:
  //       output = '';
  //       this.MultipleWallets.data.forEach(row:any => {
  //       	output += `${row.MultipleWallets}: ${row.electors}\n`
  //       });
  //     }
  //     // Download it
  //     const blob = new Blob([output]);
  //     const fileDownloadUrl = URL.createObjectURL(blob);
  //     this.setState ({fileDownloadUrl: fileDownloadUrl},
  //       () => {
  //         this.dofileDownload.click();
  //         URL.revokeObjectURL(fileDownloadUrl);  // free up storage--no longer needed.
  //         this.setState({fileDownloadUrl: ""})
  //     })
  //   }

  const [downloadValue, setDownloadValue] = useState<string>('');

  function download(filename: any, text: any) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  // Start file download.

  function handleClick() {
    // Generate download of hello.txt file with some content
    var text: any = document.getElementById('text-val') as HTMLDivElement | null;
    text = text?.innerHTML;
    var filename: any = 'WalletGenerated.txt';

    download(filename, text);
  }

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
      <Box
        sx={{
          textTransform: 'uppercase',
          mt: '20px',
          backgroundColor: 'red',
          color: 'white',
          borderRadius: '6px',
          padding: '10px',
        }}
      >
        <Typography sx={{ fontSize: '12px', textAlign: 'center' }}>
          Don't refresh or leave this page without saving your generated wallets "Id, Address, Private Key", we don't
          save this information, If you don't save them they will be lost forever
        </Typography>
      </Box>
      <Box sx={{ mt: '20px' }}>
        <Box sx={{ mb: '10px' }}>
          <Typography>A1. Generate wallets with Private keys</Typography>
        </Box>
      </Box>

      {MultipleWallets ? (
        <Box
          sx={{
            width: '100%',
            height: '300px',
            overflowX: 'scroll',
            overflowY: 'scroll',
            border: '1px solid white',
            borderRadius: '9px',
          }}
        >
          <Box>
            <p id="text-val" style={{ display: 'none' }}>
              {MultipleWallets &&
                MultipleWallets.publickeys.map((v: any, i: any) => {
                  return (
                    <span key={i}>
                      Id:{i} , Address:{v} , PrivateKeys:{MultipleWallets.privateKeys[i]} <br />
                    </span>
                  );
                })}
            </p>
          </Box>
          <Box
            sx={{
              width: { lg: '50%', md: '50%', sm: '100%', xs: '100%' },
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                width: { lg: '10%', md: '10%', sm: '20%', xs: '30%' },
                height: 'auto',
              }}
            >
              <Box sx={{ pl: '10px', mb: '20px' }}>
                <Typography sx={{ fontSize: { lg: '15px', md: 'auto', sm: 'auto', xs: '12px' }, fontWeight: 'bold' }}>
                  ID
                </Typography>
              </Box>

              <Box
                sx={{
                  width: '100%',
                  height: 'auto',
                  // borderRight: '1px solid white',
                  // borderRadius: '9px',
                  pl: '10px',
                  // overflowY: 'scroll',
                }}
              >
                {MultipleWallets &&
                  MultipleWallets.publickeys.map((v: any, i: any) => {
                    return (
                      <>
                        <Typography key={i} sx={{ fontSize: 'auto' }}>
                          {i}
                        </Typography>
                      </>
                    );
                  })}
              </Box>
            </Box>
            <Box
              sx={{
                width: 'auto',
                height: 'auto',
              }}
            >
              <Box sx={{ pl: '10px', mb: '20px' }}>
                <Typography sx={{ fontSize: { lg: '15px', md: 'auto', sm: 'auto', xs: '12px' }, fontWeight: 'bold' }}>
                  Address
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 'auto',
                  height: 'auto',
                  borderLeft: '1px solid white',
                  // borderRadius: '9px',
                  pl: '10px',
                  pr: '10px',
                  // overflowY: 'scroll',
                }}
              >
                {MultipleWallets &&
                  MultipleWallets.publickeys.map((v: any, i: any) => {
                    return (
                      <Typography key={i} sx={{ fontSize: 'auto' }}>
                        {v}
                      </Typography>
                    );
                  })}
              </Box>
            </Box>
            <Box
              sx={{
                width: 'auto',
                height: 'auto',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  pl: '10px',
                  mb: '16px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography sx={{ fontSize: { lg: '15px', md: 'auto', sm: 'auto', xs: '12px' }, fontWeight: 'bold' }}>
                    Private Keys
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={handleClick}
                    sx={{ p: '0px', m: '0px', textTransform: 'capitalize' }}
                    endIcon={<DownloadIcon />}
                  >
                    Download all
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  width: 'auto',
                  height: 'auto',
                  borderLeft: '1px solid white',
                  // borderRadius: '9px',
                  pl: '10px',
                  pr: '10px',
                  // overflowY: 'scroll',
                }}
              >
                {MultipleWallets &&
                  MultipleWallets.privateKeys.map((v: any, i: any) => {
                    return (
                      <Typography key={i} sx={{ fontSize: 'auto' }}>
                        {v}
                      </Typography>
                    );
                  })}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        ''
      )}
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
