import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input } from '@app/components/common/inputs/Input/Input';
import { InputPassword } from '@app/components/common/inputs/InputPassword/InputPassword';
import * as S from '../StepForm.styles';
import { Box, Typography, IconButton } from '@mui/material';

import { Theme, useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useState, useEffect } from 'react';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { Radio, RadioGroup, RadioChangeEvent } from '@app/components/common/Radio/Radio';
import Tooltip from '@mui/material/Tooltip';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { Card } from '@app/components/common/Card/Card';

export const Step1: React.FC = () => {
  // type User = typeof initUser;
  // const initUser = { status: false };

  const [checkRadio1, setCheckRadio1] = useState(false);
  const [checkRadio2, setCheckRadio2] = useState(false);
  const [checkRadio3, setCheckRadio3] = useState(false);
  const [selectVal, setselectVal] = useState<String>('');
  // const [selectVal1, setselectVal] = useState<String>('Select');

  console.log('CheckinBtnRadio1', checkRadio1);
  console.log('CheckinBtnRadio2', checkRadio2);
  console.log('CheckinBtnRadio3', checkRadio3);

  const [value, setValue] = useState<any>('');
  const [valueB, setValueB] = useState<any>('');

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
  };
  const onChangeB = (e: RadioChangeEvent) => {
    setValueB(e.target.value);
  };
  console.log('CheckingRadioValueSelected', value);
  console.log('CheckingRadioValueSelectedB', valueB);
  console.log(checkRadio1, 'ConsoleFromCheckRadio1');
  const handleA1SetValue = () => {
    if (selectVal === '') {
      setselectVal('Generate wallets with Private Keys');
    } else if (checkRadio1 == true) {
      localStorage.removeItem('A1');
      setselectVal('');
      setValue('');
      // localStorage.removeItem('B1');
      console.log(checkRadio1, 'ConsoleFromCheckRadio1Func');
    } else if (selectVal === 'Swap with limits orders and recurring periods') {
      setselectVal(selectVal + ' , ' + 'Generate wallets with Private Keys');
    } else if (selectVal === 'Paste wallets address' && value === '2') {
      setselectVal('Generate wallets with Private Keys');
    } else {
      setselectVal(selectVal);
    }
  };

  const handleA2SetValue = () => {
    if (selectVal === '') {
      setselectVal('Paste wallets address , Swap with limits orders and recurring periods');
      setCheckRadio2(true);
      localStorage.setItem('B1', 'B');
    } else if (selectVal === 'Swap with limits orders and recurring periods') {
      setselectVal(selectVal + ' , ' + 'Paste wallets address');
    } else if (selectVal === 'Generate wallets with Private Keys' && value === '1') {
      setselectVal('Paste wallets address');
    } else if (checkRadio3 == true) {
      setselectVal('');
      setValue('');
      setCheckRadio2(false);
      localStorage.removeItem('B1');
      localStorage.removeItem('A1');
      console.log(checkRadio3, 'ConsoleFromCheckRadio3');
    } else {
      setselectVal(selectVal);
    }
  };

  const handleClickB = () => {
    if (selectVal === '') {
      setselectVal('Swap with limits orders and recurring periods');
    } else if (selectVal === 'Generate wallets with Private Keys' || selectVal === 'Paste wallets address') {
      setselectVal(selectVal + ' , ' + 'Swap with limits orders and recurring periods');
    } else if (checkRadio2 == true) {
      setselectVal('');
      setValue('');
      setCheckRadio1(false);
      setCheckRadio3(false);
      localStorage.removeItem('B1');
      localStorage.removeItem('A1');
      console.log(checkRadio2, 'ConsoleFromCheckRadio2');
    } else {
      setselectVal(selectVal);
      console.log('runningElse', checkRadio2);
    }
  };
 

  console.log('CheckingSelectVal', selectVal);
  return (
    <Box>
      <Box>
        <S.FormContent>
          <BaseForm.Item>
            <Select defaultValue="Select" value={selectVal === '' ? 'Select' : selectVal}>
              <Option value="anything" selected>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: { lg: 'row', md: 'row', sm: 'column', xs: 'column' },
                    alignItems: 'center',
                    justiyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography sx={{ fontSize: { lg: '15px', md: '14px', sm: 'auto', xs: '7px' } }}>
                        A1. Generate wallets with Private Keys
                      </Typography>
                    </Box>
                    <Box>
                      <RadioGroup onChange={onChange} value={value}>
                        <Radio
                          value="1"
                          onClick={() => {
                            setCheckRadio1(!checkRadio1);
                            setTimeout(() => {
                              handleA1SetValue();
                            }, 500);

                            localStorage.setItem('A1', 'A1');
                          }}
                          checked={checkRadio1}
                        />
                      </RadioGroup>

                      <Tooltip disableFocusListener title="Info">
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

                  <Box sx={{ ml: '20px', mr: '20px', display: { lg: 'block', md: 'block', sm: 'none', xs: 'none' } }}>
                    <Typography> | </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: checkRadio1 && checkRadio2 ? 'gray' : 'white',
                          fontSize: { lg: '15px', md: '14px', sm: 'auto', xs: '7px' },
                        }}
                      >
                        A2. Paste wallets address
                      </Typography>
                    </Box>
                    <Box>
                      <RadioGroup onChange={onChange} value={value}>
                        <Radio
                          disabled={checkRadio1 && checkRadio2}
                          value="2"
                          onClick={() => {
                            setCheckRadio3(!checkRadio3);
                            setTimeout(() => {
                              handleA2SetValue();
                            }, 500);

                            localStorage.setItem('A1', 'A2');
                          }}
                          checked={checkRadio3}
                        />
                      </RadioGroup>

                      <Tooltip disableFocusListener title={checkRadio1 && checkRadio2 ? 'Disabled' : 'Info'}>
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
                </Box>
              </Option>
              <Option value="nothing" selected>
                <Box
                  sx={{
                    width: { lg: '48%', md: '48%', sm: '100%', xs: '100%' },
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontSize: { lg: '15px', md: '14px', sm: 'auto', xs: '7px' } }}>
                      B. Swap with limits orders and recurring periods
                    </Typography>
                  </Box>
                  <Box>
                    <Radio
                      onClick={() => {
                        setCheckRadio2(!checkRadio2);
                        setTimeout(() => {
                          handleClickB();
                        }, 500);
                        localStorage.setItem('B1', 'B');
                      }}
                      checked={checkRadio2}
                    />

                    <Tooltip disableFocusListener title="Info">
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
              </Option>
            </Select>
          </BaseForm.Item>
        </S.FormContent>
      </Box>
    </Box>
  );
};
