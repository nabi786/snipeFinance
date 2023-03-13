import React from 'react';
import { Avatar, Col, Row } from 'antd';
import { Dropdown } from '@app/components/common/Dropdown/Dropdown';
import { H6 } from '@app/components/common/typography/H6/H6';
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useResponsive } from '@app/hooks/useResponsive';
import * as S from './ProfileDropdown.styles';

import bscImg from 'assets/bsc.png';
import logOutImg from 'assets/exit.png';
// import walletModel from '../../walletModel';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { useState, useEffect } from 'react';

// import metaMaskImg from 'assets/metamask-icon.png'
// import coinBaseImg from 'assets/coinbase-logo.png'
// import walletConnectImg from 'assets/walletConnect.png'

import AddIcon from '@mui/icons-material/Add';
import { useSSR } from 'react-i18next';

import Web3Modal from 'web3modal';
import { ethers } from 'ethers';

import WalletConnect from '@walletconnect/web3-provider';
import CoinbasewalletSDK from '@coinbase/wallet-sdk';

const panCakeSwapCaddressABI = require('../ABIs/panCakeAbi.json');

const batchTransferABI = require('@app/ABIs/batchTransfer.json');

import useMultiSenderContract from '@app/utils/hooks/use-MultiSenderContract';
// import onWalletConnectActiveButton from '@app/utils/hooks/user-customeEventHook'
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';

// Token Contract instance Function
import getSigner from '@app/utils/hooks/instances';

const REACT_APP_BATCH_TRANSFER_CONTRACT = process.env.REACT_APP_BATCH_TRANSFER_CONTRACT;
const REACT_APP_PANCAKESWAPADDRESS = process.env.REACT_APP_PANCAKESWAPADDRESS;

console.log('this is REACT_APP_BATCH_TRANSFER_CONTRACT ', '0xa6dbb0EA831eB8E86F7B704872c1CB44Bc379f1E');
console.log('this is REACT_APP_PANCAKESWAPADDRESS ', `${REACT_APP_PANCAKESWAPADDRESS}`);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  background: '#1e2142',
};

// console.log('infuraID is here', process.env.REACT_APP_IFURAID)

// web3 modal provider options

const providerOptions = {
  coinbasewallet: {
    package: CoinbasewalletSDK,
    options: {
      appName: 'buenotech',
      infuraId: process.env.REACT_APP_INFURA_KEY,
      // rpc: 'https://mainnet.infura.io/v3/ab9630f1994d402794f3288ff330ef9c',
    },
  },

  walletconnect: {
    package: WalletConnect,
    options: {
      infuraId: process.env.REACT_APP_INFURA_KEY,
      // rpc: 'https://mainnet.infura.io/v3/ab9630f1994d402794f3288ff330ef9c',
    },
  },
};

// provider
const web3Modal = new Web3Modal({
  network: 'mainnet', // optional
  cacheProvider: true, // optional
  providerOptions, // required
});

export const ProfileDropdown: React.FC = () => {
  const isWalletConnectedContext = useContext(AppCtx);
  const { isTablet } = useResponsive();

  const user = useAppSelector((state) => state.user.user);

  // style to display block and none button while connnect and disConnect
  var [styleDis1, setStyleDis1] = useState('block');
  var [styleDis2, setStyleDis2] = useState('none');
  var [CwalletAddress, setCwalletAddress] = useState('0x');
  var [CwalletAddressLast, setCwalletAddressLast] = useState('');
  const [multiSenderContract, setmultiSenderContract] = useState<{}>({});
  const [signer, setSigner] = useState<{}>({});
  var [provider, setProvider] = useState<any>();
  var [library, setlibrary] = useState<{}>({});
  var [waltAddress, setWalletAddress] = useState<any>();

  const connectWallet = async () => {
    try {
      provider = await web3Modal.connect();
      setProvider(provider);
      const instance = new ethers.providers.Web3Provider(provider);
      console.log(instance);

      var accountsAddress: any = await instance.listAccounts();

      //
      isWalletConnectedContext?.setIsWalletConnected(true);

      if (accountsAddress.length) {
        setWalletAddress(accountsAddress[0]);
        // console.log('this is account Address', accountsAddress[0]);
        isWalletConnectedContext?.setAddress(accountsAddress[0]);

        localStorage.setItem('walleetAddress', accountsAddress[0]);

        // Signer
        const signer = instance.getSigner(accountsAddress[0]); // Contract
        setSigner(signer);

        const contract = new ethers.Contract(
          '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
          panCakeSwapCaddressABI,
          signer,
        );

        // contract of multiSender
        var batchTransferContract = new ethers.Contract(
          // "0x6F61c68C767ED16BBc69F833c6b10007666b68f4",
          '0xa6dbb0EA831eB8E86F7B704872c1CB44Bc379f1E',
          batchTransferABI,
          signer,
        );

        setmultiSenderContract(batchTransferContract);

        console.log('batch transfer contract', batchTransferContract);

        var tokenBalance = await contract.balanceOf(accountsAddress[0]);
        tokenBalance = tokenBalance.toNumber();
        console.log('token Balance', tokenBalance);
        localStorage.setItem('tokenBalance', tokenBalance);
      }

      setStyleDis2('block');
      setStyleDis1('none');

      // console.log('now working fine')
    } catch (err) {
      console.log('err from try catch in while connect');
      console.log(err);
    }
  };

  const disConnetWallet = async () => {
    isWalletConnectedContext?.setIsWalletConnected(false);
    isWalletConnectedContext?.setAddress('');
    isWalletConnectedContext?.setAuthorizedUser(false);
    if (provider.close) {
      provider.close();
    }

    localStorage.removeItem('walleetAddress');
    setStyleDis2('none');
    setStyleDis1('block');

    await web3Modal.clearCachedProvider();
    setProvider({});
  };

  useMultiSenderContract(multiSenderContract, signer, waltAddress);
  getSigner(signer, waltAddress);

  useEffect(() => {
    window.onload = async function () {
      if (provider.close) {
        provider.close();
      }

      localStorage.removeItem('walleetAddress');
      setStyleDis2('none');
      setStyleDis1('block');

      await web3Modal.clearCachedProvider();
      setProvider({});

      localStorage.removeItem('anyValueSelected');
    };

    async function checkIfWalletConnected() {
      var walletAddress = localStorage.getItem('walleetAddress');

      if (walletAddress) {
        var oldAddress = walletAddress.split('');
        var newAdd = [];
        for (var x = 0; x <= 4; x++) {
          newAdd.push(oldAddress[x]);
        }

        var lastItems = oldAddress.slice(-3);
        var lastAryItme = lastItems.join('');
        lastAryItme = lastAryItme.toLocaleLowerCase();
        //  console.log(lastAryItme)

        var withoutCommas = newAdd.join('');
        withoutCommas = withoutCommas.toLocaleLowerCase();
        setCwalletAddress(withoutCommas);
        setCwalletAddressLast(lastAryItme);

        setStyleDis2('block');
        setStyleDis1('none');
      } else {
        setStyleDis2('none');
        setStyleDis1('block');
      }
    }
    // setInterval(() => {
    checkIfWalletConnected();
    // }, 500);

    // detect if account changes
    //   window.ethereum.on('accountsChanged', function () {
    //     connectWallet()
    // })

    // // detect if chain changed
    // window.ethereum.on('chainChanged', function(){
    //     console.log('now its working detecting if chainChanged')
    // })
  });

  useEffect(() => {
    async function clearData() {
      // if(provider.close){
      //   provider.close()
      // }

      localStorage.removeItem('walleetAddress');
      setStyleDis2('none');
      setStyleDis1('block');

      await web3Modal.clearCachedProvider();
      setProvider({});

      localStorage.removeItem('anyValueSelected');
    }

    clearData();
  }, []);

  return user ? (
    <>
      <S.ProfileDropdownHeader
        as={Row}
        gutter={[10, 10]}
        align="middle"
        style={{ display: styleDis1, padding: '5px 15px' }}
        className="headerConnetEthBtn"
        onClick={connectWallet}
      >
        <Box sx={{ display: 'flex' }}>
          <Col>
            {/* <Avatar src={user.imgUrl} alt="User" shape="circle" size={40} /> */}
            <img src={bscImg} style={{ width: '25px', borderRadius: '50px' }} />
          </Col>
          <Col>Connect</Col>
        </Box>
      </S.ProfileDropdownHeader>

      <S.ProfileDropdownHeader
        as={Row}
        gutter={[10, 10]}
        align="middle"
        style={{ display: styleDis2, padding: '5px 15px' }}
        className="headerConnetEthBtn headerConnectedBnt"
        onClick={disConnetWallet}
      >
        <Box sx={{ display: 'flex' }}>
          <Col>
            {CwalletAddress}...{CwalletAddressLast}
          </Col>

          <Col style={{ width: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <Avatar src={user.imgUrl} alt="User" shape="circle" size={40} /> */}
            <img src={logOutImg} style={{ width: '100%' }} />
          </Col>
          {/* {isTablet && (
        )} */}
        </Box>
      </S.ProfileDropdownHeader>

      {/* <div> */}
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        > */}
      {/* <Box sx={style} style={{backgroundColor:"#1e2142"}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal walletModel
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box> */}

      {/* <Box className="connectWalletButtonBox">

                 <Box className="connetWalletDropDownHeader">
                     <Typography>Connect Wallet</Typography>
                     <Box  sx={{fontSize:"30px", color:"white",transform: "rotate(45deg)", cursor:"pointer"}}> <AddIcon  /> </Box>
                 </Box>

                 <Box className="connectWalletButtonBoxBody" sx={{padding:"5px, 0px"}}>

                     <Box  className="Wallets" sx={{cursor : "pointer", padding : "15px 0px",display : 'flex', alignItems: "center", borderBottom :"1px solid lightgray"}}>
                         <Box sx={{marginRight : "15px", width:"40px"}}>
                             <img src={metaMaskImg} style={{width:"100%"}}/>
                         </Box>
                         <Typography>
                             Meta Mask
                         </Typography>
                     </Box>
                     <Box className="Wallets" sx={{cursor : "pointer", padding : "15px 0px",display : 'flex', alignItems: "center", borderBottom :"1px solid lightgray"}}>
                         <Box sx={{marginRight : "15px", width:"40px"}}>
                             <img src={coinBaseImg} style={{width:"100%"}}/>
                         </Box>
                         <Typography>
                             CoinBase Wallet
                         </Typography>
                     </Box>
                     <Box className="Wallets" sx={{cursor : "pointer", padding : "15px 0px",display : 'flex', alignItems: "center", borderBottom :"1px solid lightgray"}}>
                         <Box sx={{marginRight : "15px", width:"40px"}}>
                             <img src={walletConnect} style={{width:"100%"}}/>
                         </Box>
                         <Typography>
                             Wallet Connect 
                         </Typography>
                     </Box>
                 </Box>


                 <Box className="connetWalletDropDownFooter">
                     <Typography sx={{textAlign : 'center', fontSize : "10px"}}>powered by emoji</Typography>
                 </Box>
            
             </Box> */}
      {/* </Modal> */}
      {/* </div> */}
    </>
  ) : null;
};
