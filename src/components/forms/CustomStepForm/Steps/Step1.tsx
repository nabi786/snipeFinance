import { useTranslation } from 'react-i18next';

import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Input, TextArea } from '@app/components/common/inputs/Input/Input';
import { UploadOutlined, InboxOutlined, CopyFilled, CopyOutlined } from '@ant-design/icons';
import { InputPassword } from '@app/components/common/inputs/InputPassword/InputPassword';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { Upload, UploadDragger } from '@app/components/common/Upload/Upload';
import { Button } from '@app/components/common/buttons/Button/Button';
import * as S from '../StepForm.styles';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Select, Option } from '@app/components/common/selects/Select/Select';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import useMutltiSenderContract from '@app/utils/hooks/use-MultiSenderContract';
import { Modal, InfoModal, SuccessModal, WarningModal, ErrorModal } from '@app/components/common/Modal/Modal';
import { Badge } from '@app/components/common/Badge/Badge';
import { Box, Typography } from '@mui/material';
import { currentTokenData } from '@app/utils/hooks/instances';

interface IProps {
  updateCSV: any;
  updateBtnDesciderValue: any;
  setError: any;
  setIsApproved: any;
  setdisPlayApprove: any;
  setApprovalGiven: any;
  setDispayNext: any;
}

export const Step1: React.FC<IProps> = ({
  setDispayNext,
  setApprovalGiven,
  setdisPlayApprove,
  setIsApproved,
  updateCSV,
  updateBtnDesciderValue,
  setError,
}) => {
  const isWalletConnectedContext = useContext(AppCtx);
  const { t } = useTranslation();
  const [selectValue, setSelectValue] = useState('');
  var [dispayField, setDispayField] = useState('block');

  // const [isApproved, setIsApproved]= useState<boolean>(false)
  const [IsBasicModalVisible, setIsBasicModalVisible] = useState<boolean>(false);
  const [copyData, setcopyData] = useState('copy');
  const [displayCopySlug, setdisplayCopySlug] = useState('none');
  const [tokenDataAry, setTokenDataAry] = useState<[]>([]);
  const [addressToCopy, setAddressToCopy] = useState('0x5E5b9bE5fd939c578ABE5800a90C566eeEbA44a5');

  interface Field {
    name?: string;
    value: string;
  }

  const normFile = (e = { fileList: [] }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const handleAllocationField = async () => {
    setIsApproved(false);
    setdisPlayApprove('block');
    setApprovalGiven(false);
    setDispayNext('none');
  };

  const handleSelectChange: any = (e: React.ChangeEvent<HTMLInputElement>) => {
    var selectedValue: any = e;
    localStorage.removeItem('keepAddress');
    localStorage.removeItem('deleteAddress');
    setSelectValue(selectedValue);
    updateBtnDesciderValue(selectedValue);

    console.log('values of selector', selectedValue);
    var boolValue: any = true;
    localStorage.setItem('anyValueSelected', boolValue);
    if (selectedValue == 'BNB Transfers') {
      setDispayField('none');
      setTokenDataAry([]);
    } else {
      setDispayField('block');
    }
  };

  // const approveButton= ()=>{
  //   console.log('now I clicked on apprve');

  //   setIsApproved(!isApproved)
  // }

  const copyBtnFun = () => {
    navigator.clipboard.writeText('0xB803b0E5E7457B135085E896FD7A3398b266cd43');
    setcopyData('copied');

    setInterval(() => {
      setcopyData('copy');
    }, 2000);
  };

  const copyBtnMouseOver = () => {
    setdisplayCopySlug('block');
  };

  const csvFileToArray = (string: any) => {
    const tmpArray: any = [];
    const csvHeader = string.slice(0, string.indexOf('\n')).split(',');
    const csvRows = string.slice(string.indexOf('\n') + 1).split('\n');

    const array = csvRows.map((i: any) => {
      const values = i.split(',');
      const obj = csvHeader.reduce((object: any, header: any, index: any) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    //  array.map((item:any)=>{
    //    Object.values(item).map((val:any) => (
    //     tmpArray.push(val)
    //     ))
    //   });
    //   tmpArray.join(",")
    //   console.log("tmpArray",)
    console.log('csvRows', csvRows.join('\n'));
    updateCSV(csvRows.join('\n'));
  };

  const handleOnSubmit = (e: any) => {
    console.log('this is handleOnSubmit', e);
    const fileReader = new FileReader();
    fileReader.readAsText(e);

    fileReader.onload = function (event: any) {
      const text = event.target.result;
      console.log('this is text in fileReader fun', text);
      csvFileToArray(text);
    };
  };

  const handleTokenAddressChange = async (e: any) => {
    var value = e.target.value;
    setTokenDataAry([]);
    var isWalletConnected: any = isWalletConnectedContext?.isWalletConnected;
    console.log('is walletConnecte', isWalletConnected);
    if (isWalletConnected == true) {
      var currentTokenContract: any = await currentTokenData(value);
      console.log(currentTokenContract);
      if (currentTokenContract.success == true) {
        setTokenDataAry(currentTokenContract.tokenData);
        setError('');
      } else {
        setTokenDataAry([]);
        setError('INSERT VALID TOKEN ADDRESS');
      }
    } else {
      setTokenDataAry([]);
    }

    setIsApproved(false);
    setdisPlayApprove('block');
    setApprovalGiven(false);
    setDispayNext('none');
  };

  useEffect(() => {
    function detechInnerWidth() {
      if (window.innerWidth < 600) {
        setAddressToCopy('0x5E...4a5');
      } else {
        setAddressToCopy('0x5E5b9bE5fd939c578ABE5800a90C566eeEbA44a5');
      }
    }

    setInterval(() => {
      detechInnerWidth();
    }, 2000);
  });

  return (
    <S.FormContent>
      <BaseForm.Item
        name="bulkSender"
        label={t('Bulk Sender')}
        // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
      >
        <Select defaultValue="Select" onChange={handleSelectChange}>
          <Option value="Token Transfers">Token Transfers</Option>
          <Option value="BNB Transfers">BNB Transfers</Option>
        </Select>
        <p style={{ fontSize: '14px', color: '#339CFD', marginTop: '10px' }}>
          {t(
            'Snipe Multi Sender easily allows you to send ERC20 Token in batch. Select an option to send tokens or bnb.',
          )}
          <br />
          {/* {t("fee to use the multisender 1000000000000000")} */}
        </p>
      </BaseForm.Item>

      <BaseForm.Item
        name="tokenAddress"
        label={t('Token Address')}
        // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
        style={{ display: dispayField }}
      >
        <Input placeholder="Ex: 0x..." onChange={handleTokenAddressChange} />
      </BaseForm.Item>

      {tokenDataAry.map((item: Field, index: number) => {
        return (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px',
              flexWrap: 'wrap',
              borderBottom: '1px solid #5c5c5c',
              padding: '10px 10px',
            }}
          >
            <Box sx={{ width: '50%' }}>
              <Typography key={index + 1} sx={{ fontSize: '14px' }}>
                {item.name}
              </Typography>
            </Box>
            <Box sx={{ width: '50%', textAlign: 'right' }}>
              <Typography key={index + 2} sx={{ fontSize: '14px' }}>
                {item.value}
              </Typography>
            </Box>
          </Box>
        );
      })}

      <BaseForm.Item
        name="allocations"
        label={t('Allocations')}
        rules={[{ message: t('Recipients allocation is required') }]}
        style={{ marginBottom: '0px' }}
      >
        <TextArea
          id="textArea"
          rows={8}
          value=""
          onChange={handleAllocationField}
          placeholder="Insert allocation separate with breaks link. By format: address,amount
        Ex: 
        0x000000000000000000000000000000000000000,13.45
        0x000000000000000000000000000000000000000,1.049
        0x000000000000000000000000000000000000000,1
        "
        />
      </BaseForm.Item>
      <Box sx={{ marginBottom: '10px' }}>
        <span style={{ color: '#339cfd', fontWeight: '500', textTransform: 'uppercase' }}>
          maximum 2000 wallets per batch
        </span>
      </Box>
      {/* <BaseButtonsForm
      {...formItemLayout}
      isFieldsChanged={isFieldsChanged}
      onFieldsChange={() => setFieldsChanged(true)}
      name="validateForm"
      initialValues={{
        'input-number': 3,
        'checkbox-group': ['A', 'B'],
        rate: 3.5,
      }}
      footer={
        <BaseButtonsForm.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {t('common.submit')}
          </Button>
        </BaseButtonsForm.Item>
      }
      onFinish={onFinish}
    >
</BaseButtonsForm> */}
      {/* <div style={{display:"flex", flexWrap:"wrap",justifyContent:"flex-start",alignItems:"center",}}> */}
      <S.UploadButtonAndSampleCSVFILEButtonWrapper>
        <BaseButtonsForm.Item
          name="upload"
          // label={t('Sample CSV file')}
          valuePropName="fileList"
          getValueFromEvent={normFile}
        >
          <Upload name="logo" onChange={(e) => handleOnSubmit(e.file.originFileObj)} listType="picture">
            <div className="uploadBtnInMultiSenderForm" style={{ display: 'flex', alignItems: 'center' }}>
              <Button type="default" style={{ borderColor: '#a9a9a9' }}>
                <span style={{ color: '#339cfd', fontWeight: 'normal', fontSize: '14px' }}>
                  {' '}
                  {t('Or Choose from CSV File')}
                </span>
                {/* <UploadOutlined/> */}
                <img
                  style={{ width: '23px', marginRight: '5px' }}
                  src="https://res.cloudinary.com/learn2code/image/upload/v1668621137/240_F_164165971_ELxPPwdwHYEhg4vZ3F4Ej7OmZVzqq4Ov_fbtjck.png"
                />
              </Button>
            </div>
          </Upload>
        </BaseButtonsForm.Item>
        <Button
          type="ghost"
          style={{
            margin: '0px 0px 16px 10px',
            borderColor: '#a9a9a9',
            border: 'none',
            fontWeight: 'normal',
            fontSize: '14px',
          }}
          onClick={() => setIsBasicModalVisible(true)}
        >
          {t('Sample CSV File')}
        </Button>
      </S.UploadButtonAndSampleCSVFILEButtonWrapper>

      <S.infoWrapper style={{ position: 'relative' }}>
        <span>
          Please exclude {addressToCopy}
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
          from fees, rewards, max tx amount to start sending tokens
        </span>
      </S.infoWrapper>

      {/* <S.ButtonWrapper>


        <Button type="ghost" onClick={approveButton} >
              {
                isApproved ? `${t('Approving')}` : `${t('Approve')}`
              }
        </Button>


      </S.ButtonWrapper> */}

      <Modal
        centered
        visible={IsBasicModalVisible}
        onOk={() => setIsBasicModalVisible(false)}
        onCancel={() => setIsBasicModalVisible(false)}
        size="medium"
      >
        <S.FormContent>
          <BaseForm.Item
            name="sample"
            label={t('Sample CSV File')}
            // rules={[{ message: t('forms.stepFormLabels.loginError') }]}
          >
            <TextArea
              rows={8}
              defaultValue="0x55d398326f99059775485246999027b3197955,13.45
                    0x55d398326f99059775485246999027b3197955,1.049
                    0x55d398326f99059775485246999027b3197955,1"
              style={{ color: '#339cfd', borderColor: '#339cfd' }}
            />
          </BaseForm.Item>
        </S.FormContent>
      </Modal>
    </S.FormContent>
  );
};
