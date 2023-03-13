import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { Card } from '@app/components/common/Card/Card';
import { DynamicForm } from '@app/components/forms/DynamicForm/DynamicForm';
import { ControlForm } from '@app/components/forms/ControlForm/ControlForm';
import { ValidationForm } from '@app/components/forms/ValidationForm/ValidationForm';
import { StepForm } from '@app/components/forms/StepForm3/StepForm';
import { StepForm2 } from '@app/components/forms/StepForm3/StepForm2';
import { StepForm3 } from '@app/components/forms/StepForm3/StepForm3';
import { Box, Typography } from '@mui/material';
import { StepForm4 } from '@app/components/forms/StepForm3/StepForm4';
import { StepForm5 } from '@app/components/forms/StepForm3/StepForm5';
import { StepForm6 } from '@app/components/forms/StepForm3/StepForm6';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { Modal } from '@app/components/common/Modal/Modal';
import useExitPrompt from './useExitPrompt';
import { checkIfUserAuthorizedToUse } from '@app/components/forms/Form2Controllers/controller';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
const FormPage: React.FC = () => {
  const { t } = useTranslation();
  const useContextAPI = useContext(AppCtx);
  const [stepForm3Page, setstepForm3Page] = useState<String>('');
  const [stepForm3Page1, setstepForm3Page1] = useState<String>('');
  const [stepForm3Page2, setstepForm3Page2] = useState(false);
  const [stepForm3Page3, setstepForm3Page3] = useState(false);
  const [stepForm3Page4, setstepForm3Page4] = useState<String>('');
  const [MultipleWallets, setMultipleWallets] = useState<any>('');
  const [IsBasicModalVisible, setIsBasicModalVisible] = useState(false);

  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  // check if User is Authorized to use This Service
  useEffect(() => {
    var isUserAuthorized = async () => {
      useContextAPI?.setIsTimeToShowAuth(true);
      var result = await checkIfUserAuthorizedToUse();
      // console.log('this is result of AUth', result);
      if (result.success) {
        if (useContextAPI?.isWalletConnected == true) {
          useContextAPI?.setAuthorizedUser(result.isAuth);
        }
      } else {
        if (useContextAPI?.isWalletConnected == true) {
          useContextAPI?.setAuthorizedUser(result.isAuth);
        }
      }
    };
    setTimeout(() => {
      isUserAuthorized();
    }, 2000);
  }, [useContextAPI?.isWalletConnected == true]);

  setInterval(function () {
    if (localStorage.getItem('A1') === 'A1') {
      setstepForm3Page('A1');
      setstepForm3Page4('');
    }
    if (localStorage.getItem('A1') === 'A2') {
      setstepForm3Page4('A2');
      setstepForm3Page('');
    }
    if (localStorage.getItem('B1') === 'B') {
      setstepForm3Page1('B');
    }
    if (!localStorage.getItem('B1')) {
      setstepForm3Page1('');
    }
    if (!localStorage.getItem('A1')) {
      setstepForm3Page('');
      setstepForm3Page4('');
    }
    if (localStorage.getItem('A1') === 'A1' && localStorage.getItem('B1') === 'B') {
      setstepForm3Page2(true);
    }
    if (localStorage.getItem('A1') === 'A2' && localStorage.getItem('B1') === 'B') {
      setstepForm3Page3(true);
    }
  }, 1000);

  useEffect(() => {
    if (MultipleWallets === '') {
      setShowExitPrompt(false);
    } else {
      setShowExitPrompt(true);
    }
  }, [MultipleWallets]);

  useEffect(() => {
    // setIsBasicModalVisible(true);
    localStorage.removeItem('A1');
    localStorage.removeItem('B1');
  }, []);

  const handleClick = (e: any) => {
    e.preventDefault();
    setShowExitPrompt(!showExitPrompt);
  };

  // useEffect(() => {
  //   return () => {
  //     setShowExitPrompt(true);
  //   };
  // }, []);

  return (
    <>
      <PageTitle>{t('Form')}</PageTitle>
      <Row gutter={[30, 30]}>
        <Col xs={24} sm={24}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Card id="step-form" title={t('')} padding="1.25rem">
                <StepForm />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col xs={24} sm={24}>
          <Row gutter={[30, 30]}>
            <Col span={24}>
              <Card id="step-form" title={t('')} padding="1.25rem">
                <StepForm2 setMultipleWallets={setMultipleWallets} />
              </Card>
            </Col>
          </Row>
        </Col>

        {stepForm3Page === 'A1' && stepForm3Page1 === '' && stepForm3Page4 === '' ? (
          <Col xs={24} sm={24}>
            <Row gutter={[30, 30]}>
              <Col span={24}>
                <Card id="step-form" title={t('')} padding="1.25rem">
                  <StepForm3 MultipleWallets={MultipleWallets} />
                </Card>
              </Col>
            </Row>
          </Col>
        ) : stepForm3Page1 === 'B' && stepForm3Page === '' && stepForm3Page4 === '' ? (
          <Col xs={24} sm={24}>
            <Row gutter={[30, 30]}>
              <Col span={24}>
                <Card id="step-form" title={t('')} padding="1.25rem" style={{ height: 'auto' }}>
                  <StepForm5 />
                </Card>
              </Col>
            </Row>
          </Col>
        ) : stepForm3Page2 && stepForm3Page === 'A1' && stepForm3Page1 === 'B' ? (
          <Col xs={24} sm={24}>
            <Row gutter={[30, 30]}>
              <Col span={24}>
                <Card id="step-form" title={t('')} padding="1.25rem">
                  <StepForm4 MultipleWallets={MultipleWallets} />
                </Card>
              </Col>
            </Row>
          </Col>
        ) : stepForm3Page3 && stepForm3Page4 === 'A2' && stepForm3Page1 === 'B' ? (
          <Col xs={24} sm={24}>
            <Row gutter={[30, 30]}>
              <Col span={24}>
                <Card id="step-form" title={t('')} padding="1.25rem">
                  <StepForm6 />
                </Card>
              </Col>
            </Row>
          </Col>
        ) : (
          ''
        )}
      </Row>
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
          {t(
            "DON'T REFRESH OR LEAVE THIS PAGE WITHOUT SAVING YOUR GENERATED WALLETS 'ID, ADDRESS, PRIVATE KEY', WE DON'T SAVE THIS INFORMATION, IF YOU DON'T SAVE THEM THEY WILL BE LOST FOREVER",
          )}
        </BaseForm.Item>
      </Modal>
    </>
  );
};

export default FormPage;
