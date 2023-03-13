import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnect from '@walletconnect/web3-provider';
import CoinbasewalletSDK from '@coinbase/wallet-sdk';
require('dotenv').config();

const tokenABI = require('@app/ABIs/Erc20TokenABI.json');
const abi = require('@app/ABIs/walletGeneratorABI.json');

const { currentSigner } = require('@app/utils/hooks/instances');

async function getProvider() {
  // const web3_wallet = await web3Modal.connect();
  // const provider = new ethers.providers.Web3Provider(web3_wallet);
  const provider = currentSigner();
  console.log(provider);
  return provider;
}

const signeraddr = async () => {
  // const prov = await getProvider();
  // return await prov.listAccounts();
  const prov = await currentSigner();
  console.log(prov);
  // var listAcount = await prov.listAccounts();
  console.log('list Accounts', prov._address);
  return await prov._address;
};

const signer = async () => provider.getSigner('0x189A8beF5EB2d85bD2aFF85553068eA1893Da0dA');

// wallet Generator Instance
const walletGeneratorInstance = async () => {
  // const prov = (await getProvider()).getSigner(await signeraddr()[0]);

  const prov = await currentSigner();
  console.log('this is current Provider', prov);
  return new ethers.Contract(
    // '0xe1057bEFcf9f0686aC72eCd80569Ec4b0844cE39',
    '0xbA8FE70B078039DF8eFF077B47B7F144265F6b74',
    abi,
    prov,
  );
};

// instance of token Contract
const tokenContractInstance = async () => {
  // const prov = (await getProvider()).getSigner(await signeraddr()[0]);

  const prov = await currentSigner();

  return new ethers.Contract(
    // process.env.tokenContract,
    // '0xEfD81DE38188bef34F5C0E6529C6dDe31Cfc90BF',
    '0x4B7a3995F297865A51aB574a1543372236DAF93e',
    tokenABI,
    prov,
  );
};

export { walletGeneratorInstance, tokenContractInstance, getProvider, signeraddr };
