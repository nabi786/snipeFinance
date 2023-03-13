import React, { useEffect } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { DynamicForm } from '@app/components/forms/DynamicForm/DynamicForm';
import { ControlForm } from '@app/components/forms/ControlForm/ControlForm';
import { ValidationForm } from '@app/components/forms/ValidationForm/ValidationForm';
import { StepForm } from '@app/components/forms/extendLock/StepForm';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import { checkIfUserAuthorizedToUse } from '@app/utils/hooks/use-MultiSenderContract';

const FormPage: React.FC = () => {
  const { t } = useTranslation();
  const useContextAPI = useContext(AppCtx);
  useEffect(() => {
    var isUserAuthorized = async () => {
      useContextAPI?.setIsTimeToShowAuth(true);
      var result = await checkIfUserAuthorizedToUse();
      console.log('this is result of AUth', result);
      if (result.success) {
        useContextAPI?.setAuthorizedUser(result.isAuth);
      } else {
        useContextAPI?.setAuthorizedUser(result.isAuth);
      }
    };
    setTimeout(() => {
      isUserAuthorized();
    }, 2000);
  }, [useContextAPI?.isWalletConnected == true]);
  return (
    <>
      <PageTitle>{t('Form')}</PageTitle>
      <Row gutter={[30, 30]}>
        {/* <Col xs={24} sm={24} xl={10}>
          <Card id="validation form" title={t('forms.validationForm')} padding="1.25rem">
            <ValidationForm />
          </Card>
        </Col> */}

        <Col xs={24} sm={24}>
          {/* <Col> */}
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Card id="step-form" title={t('')} padding="1.25rem">
                <StepForm />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default FormPage;
