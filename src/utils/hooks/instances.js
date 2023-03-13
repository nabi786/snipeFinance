import { ethers } from 'ethers';

import erc20ABI from '@app/ABIs/Erc20TokenABI.json';

var signerData = '';
var walletAddress;

const getSigner = (signer, waltAddress) => {
  (signerData = signer), (walletAddress = waltAddress);
};

// get current Signer
const currentSigner = () => {
  var getSignerData = signerData;

  return getSignerData;
};

// token contract
const tokenContractInstance = (tokeAddress) => {
  try {
    var contract = new ethers.Contract(tokeAddress, erc20ABI, signerData);

    return contract;
  } catch (err) {
    return { msg: 'invalid token', success: false };
  }
};

// get currentToken Data
const currentTokenData = async (tokenAddress) => {
  try {
    var contract = new ethers.Contract(tokenAddress, erc20ABI, signerData);

    console.log('current tokenContract', contract);
    var decimals = await contract.decimals();

    var tokenName = await contract.name();
    var tokenBalance = (await contract.balanceOf(walletAddress)).toString();

    tokenBalance = await ethers.utils.formatUnits(tokenBalance, decimals);

    var symbol = await contract.symbol();

    var tokenData = [
      { name: 'Name', value: tokenName },
      { name: 'Balance', value: tokenBalance },
      { name: 'Symbol', value: symbol },
      { name: 'Decimal', value: decimals },
    ];

    return { success: true, tokenData };
  } catch (err) {
    console.log('this is error while Fetchign Current Token', err);
    return { success: false };
  }
};

export default getSigner;

export { tokenContractInstance, currentSigner, currentTokenData };
