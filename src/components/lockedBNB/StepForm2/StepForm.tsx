import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Button } from '@app/components/common/buttons/Button/Button';
import { Step1 } from './Steps/Step1';
import { Step4 } from './Steps/Step4';
import { notificationController } from '@app/controllers/notificationController';
import { mergeBy } from '@app/utils/utils';
import * as S from './StepForm.styles';
import { Steps } from './StepForm.styles';
import { Badge } from '@app/components/common/Badge/Badge';
import { Modal, InfoModal, SuccessModal, WarningModal, ErrorModal } from '@app/components/common/Modal/Modal';

import { currentTokenData } from '@app/utils/hooks/instances';

import { approveToken, lockTOkenBlockChainFun } from '@app/utils/hooks/pinkLock';
import { filterLockedBNB } from '@app/utils/APIs/apis';

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
  const [tokenApproved, setTokenApproved] = useState<boolean>(false);
  const [filteredBNbData, setFilteredData] = useState<[]>([]);
  const [inputValueLength, setInputValueLength] = useState<number>(0);

  const [fields, setFields] = useState<FieldData[]>([]);

  const { t } = useTranslation();

  const formLabels: FormValues = {
    TokenAddress: t('TokenAddress'),
    LockTitle: t('Title'),
    Amount: t('Amount'),
    LockTime: t('LockTime'),
    owner: t('owner'),
  };

  const formValues = fields
    .filter((item) => item.name !== 'prefix')
    .map((item) => ({
      name: formLabels[item.name],
      value: String(item.name === 'birthday' && item.value ? item.value.format('YYYY-MM-DD') : item.value),
    }));

  // const here I am seraching Lcked BNb

  const searchBNBInput: any = async (e: any) => {
    try {
      var value: any = e.target.value;
      setInputValueLength(value.length);
      console.log('this is bnb you want to search', value);
      var result: any = await filterLockedBNB(value);
      if (result.success == true) {
        setFilteredData(result.data);
      } else {
        setFilteredData([]);
      }
    } catch (err) {
      console.log('this is erro you want to srach', err);
    }
  };

  const formFieldsUi = [
    // <Step1 addMaxAmmountFunc={addMaxAmmount} key="1" />,
    <Step1
      key="1"
      searchBNBInput={searchBNBInput}
      filteredBNbData={filteredBNbData}
      inputValueLength={inputValueLength}
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
    </BaseForm>
  );
};
