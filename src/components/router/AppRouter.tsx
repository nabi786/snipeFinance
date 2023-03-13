import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
// import LoginPage from '@app/pages/LoginPage';
import CreateLock from '@app/pages/createLockPage';
import FormPage from '@app/pages/FormPage';
import ExtendLock from '@app/pages/extendLock';
import TokensPage from '@app/pages/token';
import LockedBNBPage from '@app/pages/bnbLockPage';
import { LockedBNBPageDetial } from '@app/components/lockedBNB/StepForm2/Steps/detail';

import { LockedBNBPageDetialPage2 } from '@app/components/lockedBNB/StepForm2/Steps/detialPage2';

import { TokenDetialsPage } from '@app/components/forms/StepForm2/Steps/detail';
import { TokenDetialsPage2 } from '@app/components/forms/StepForm2/Steps/detialPage2';
import LiquadityPage from '@app/pages/liquadity';
import SnipeTool from '@app/pages/SnipeToolPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import NftDashboardPage from '@app/pages/DashboardPages/NftDashboardPage';

export const NFT_DASHBOARD_PATH = '/';
// export const MEDICAL_DASHBOARD_PATH = '/medical-dashboard';

import AppCtx from '@app/components/context/MyContext';

import { useState, useEffect } from 'react';

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  const [isWalletConnectedVal, setIsWalletConnectedVal] = useState<boolean>(false);
  const [isTokenLockVal, setIsTokenLockVal] = useState<boolean>(true);
  const [isSelectBoxSelected, setIsSelectBoxSelected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isAuthorizedUser, setIsAuthorizedUser] = useState<boolean>(false);
  const [isTimeToShowAuth, setIsTimeToShowAuth] = useState<boolean>(false);

  interface AppContextInterface {
    isWalletConnected: boolean;
    isTokenLocked: boolean;
    isSelectBoxSelected: boolean;
    isWalletAddress: string;
    isAuthorizedUser: boolean;
    isTimeToShowAuth: boolean;
    setIsWalletConnected: (newValue: boolean) => void;
    setTokenLocked: (newValue: boolean) => void;
    setSelected: (newValue: boolean) => void;
    setAddress: (newValue: string) => void;
    setAuthorizedUser: (newValue: boolean) => void;
    setIsTimeToShowAuth: (newValue: boolean) => void;
  }

  const sampleAppContext: AppContextInterface = {
    isWalletConnected: isWalletConnectedVal,
    setIsWalletConnected: (newValue: boolean) => setIsWalletConnectedVal(newValue),
    isTokenLocked: isTokenLockVal,
    setTokenLocked: (newValue: boolean) => setIsTokenLockVal(newValue),
    isSelectBoxSelected: isSelectBoxSelected,
    setSelected: (newValue: boolean) => setIsSelectBoxSelected(newValue),
    isWalletAddress: walletAddress,
    setAddress: (newValue: string) => setWalletAddress(newValue),
    isAuthorizedUser: isAuthorizedUser,
    setAuthorizedUser: (newValue: boolean) => setIsAuthorizedUser(newValue),
    isTimeToShowAuth: isTimeToShowAuth,
    setIsTimeToShowAuth: (newValue: boolean) => setIsTimeToShowAuth(newValue),
  };

  return (
    <BrowserRouter>
      <AppCtx.Provider value={sampleAppContext}>
        <Routes>
          <Route path={NFT_DASHBOARD_PATH} element={protectedLayout}>
            <Route index element={<NftDashboardPage />} />
            <Route path="/create-lock" element={<CreateLock />} />
            <Route path="/extend-lock/:name/:Addr/:id" element={<ExtendLock />} />
            <Route path="/liquidity" element={<LiquadityPage />} />
            <Route path="/snipe-tool" element={<SnipeTool />} />
            <Route path="/token" element={<TokensPage />} />
            <Route path="/bnb" element={<LockedBNBPage />} />

            <Route path="/bnb/detail/:walletAddress" element={<LockedBNBPageDetial />} />
            <Route path="/bnb/detail/:walletAddress/:id" element={<LockedBNBPageDetialPage2 />} />

            <Route path="/token/detail/:tokenobj" element={<TokenDetialsPage />} />
            <Route path="/token/detail/:tokenobj/:_id" element={<TokenDetialsPage2 />} />

            <Route path="/snipe-bulk-transfers" element={<FormPage />} />
          </Route>
        </Routes>
      </AppCtx.Provider>
    </BrowserRouter>
  );
};
