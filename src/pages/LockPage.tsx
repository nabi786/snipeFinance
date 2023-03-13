import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
// import { LockForm } from '@app/components/auth/LockForm/LockForm';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import { checkIfUserAuthorizedToUse } from '@app/utils/hooks/use-MultiSenderContract';
const LockPage: React.FC = () => {
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
      <PageTitle>{t('common.lock')}</PageTitle>
      {/* <LockForm /> */}
    </>
  );
};

export default LockPage;
