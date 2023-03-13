

import CoinbasewalletSDK from '@coinbase/wallet-sdk'

import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";


import Web3Modal from 'web3modal';
import {ethers} from 'ethers';

import Web3 from 'web3';

import contractABI from '';


// const network = 'bsc testnet' // use rinkeby testnet
// const provider = ethers.getDefaultProvider(network)
// const address = '0xd500E162633a8DCFf8516DD6f8F18AF336B54Cc8'
// provider.getBalance(address).then((balance) => {
//  // convert a currency unit from wei to ether
//  const balanceInEth = ethers.utils.formatEther(balance)
//  console.log(`balance: ${balanceInEth} ETH`)
// })




const web3 = new Web3(Web3.givenProvider);


let pcsContract = new web3.eth.Contract(contractABI,'0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82')
console.log(pcsContract)


// get blance

// connection wallet;
const providerOptions = {

    coinbasewallet : {
      package : CoinbasewalletSDK,
      options : {
        appName : 'web3CoinBase',
        infuraId : "17e323aeeaf048e585041fa2cacb1e2c"
      }
    },
    
    walletconnect: {
      package: WalletConnect, 
      options: {
        appName : 'walletConnet',
        infuraId: "17e323aeeaf048e585041fa2cacb1e2c"
      }
    }
  
}






const connectWallet = async ()=>{

    try{
      
      const web3Model = new Web3Modal({
        cacheProvider : true,
        providerOptions, 
      });

      const web3ModelInstance = await web3Model.connect();
      const web3ModalProvider = new ethers.providers.Web3Provider(web3ModelInstance) 

      const web3 = new Web3(web3ModelInstance);
      const accounts = await web3.eth.getAccounts();

      
      localStorage.setItem("walleetAddress",accounts[0])
      const balanceFromPinCakeSwap = await pcsContract.methods.balanceOf(accounts[0]).call()
      
      
      



      var web3OBjy= {
        web3ModalProvider, web3Model, balanceFromPinCakeSwap
      }

      return web3OBjy;


    }catch(err){
      console.log(err)

      return false
    }


}


export default connectWallet;