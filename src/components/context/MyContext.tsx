import { createContext } from 'react';

export interface AppContextInterface {
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

const AppCtx = createContext<AppContextInterface | null>(null);

export default AppCtx;

// import React from 'react'

// const MyContext = React.createContext()

// export default MyContext;
