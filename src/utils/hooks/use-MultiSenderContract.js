import { format } from 'echarts';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: [-300, 300] });

const provider = ethers.getDefaultProvider();
import { useCallback, useState, useEffect } from 'react';

const tokenABI = require('@app/ABIs/Erc20TokenABI.json');

const batchTransferContractABI = require('@app/ABIs/batchTransfer.json');

var contractData;

var signerData;

// var contractAddress="0x6F61c68C767ED16BBc69F833c6b10007666b68f4";
var contractAddress = '0xa6dbb0EA831eB8E86F7B704872c1CB44Bc379f1E';

var walletAddress = '';

var sumAmount = new BigNumber('0.0');

// sending contract data while connecting wallet
const useMultiSenderContract = async (contract, signer, waltAddress) => {
  contractData = contract;

  signerData = signer;

  walletAddress = waltAddress;
};

const useMultiSenderContractFun = async () => {
  var batchContract = contractData;

  return batchContract;
};

// Method to approve Token
const approveTokenWithContract = async (tokenAddress, totalAmmount) => {
  try {
    // getting contract of current token
    var tokenContract = new ethers.Contract(tokenAddress, tokenABI, signerData);

    console.log('this is contract address', contractAddress);
    console.log('this is contract', tokenContract);
    var decimals = await tokenContract.decimals();

    console.log('decimal', decimals);

    console.log('this is total Amount', totalAmmount);

    var totalAmmount = ethers.utils.parseUnits(totalAmmount, decimals).toString();

    console.log('this is total Amount after parseUnits', totalAmmount);

    console.log('this is the deciamls', decimals);

    // console.log(signerData)
    // console.log("this is token address", tokenAddress)

    var balance = (await tokenContract.balanceOf(walletAddress)).toString();

    balance = await ethers.utils.formatUnits(balance, decimals);

    var tokenName = (await tokenContract.name()).toString();

    var tokenSymbol = (await tokenContract.symbol()).toString();

    var tokenData = {
      tokenBalance: balance,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
    };

    var error2 = '';

    console.log('this is balance and totalAmount', balance + ' totalAmount', totalAmmount);

    if (Number(balance) < Number(totalAmmount)) {
      return { msg: 'not enough balance', err: true, tokenData: '', approval: false };
    }

    // var deciamals = (await tokenContract.decimals()).toString();

    console.log('this is wallet address', walletAddress);

    var approvedAmount = (await tokenContract.allowance(walletAddress, contractAddress)).toString();

    console.log('totalAmmount', totalAmmount);

    // approvedAmount = parseInt(approvedAmount);

    console.log('approvedAmount ammount', approvedAmount, ' This is TotalAmount ', totalAmmount);

    if (Number(approvedAmount) < Number(totalAmmount)) {
      var approve = await tokenContract.approve(contractAddress, totalAmmount);
      // setToken ToHoldAndQuantity

      console.log('this is approval', approve);
      return { approval: approve, err: false, tokenData: tokenData, msg: '' };
    }

    // console.log("decimals", deciamals);
    // console.log("this is the toekn contract address", tokenContract)

    return { msg: 'already approved', err: false, tokenData: tokenData, approval: false };
  } catch (err) {
    console.log('this is Error', err);
    console.log('this is error is JSON', err);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, err: true, msg: 'user rejected transaction' };
    }
  }
};

// MultiSenderTokenContract (Multiple token sender)
const getContractMultitSender = async (tokenAddressFromInput, addressAry, valueAry, totalAmmount) => {
  try {
    // contractData
    console.log('this is contract', contractData);

    var fees = (await contractData.fee()).toString();
    const authorizedUser = await contractData.authorizedusers(walletAddress);
    console.log('is user Authorized', authorizedUser);
    const quantity = (await contractData.quantity()).toString();
    const tokenAddress = await contractData.tokenaddress();
    console.log('token Quantity', quantity);

    console.log('this is token Address007', tokenAddress);

    var tokenContract = new ethers.Contract(
      // tokenAddress,
      tokenAddressFromInput,
      tokenABI,
      signerData,
    );

    var balanceofToken = (await tokenContract.balanceOf(walletAddress)).toString();

    var decimals = await tokenContract.decimals();

    console.log('this si decimals of this token', decimals);

    console.log('balance of token', balanceofToken);
    console.log('this is fees', fees);
    console.log('total Ammount', totalAmmount);
    console.log('token address', tokenAddress);
    console.log('address Ary', addressAry);
    console.log('value arry', valueAry);

    if (authorizedUser && Number(balanceofToken) >= Number(quantity)) {
      fees = 0;
      console.log('fess in if condition', fees);
    }
    console.log('fees of contract outSide if condition', fees);

    // Token transfer
    var tokenTransfer = await contractData.TOKENmultisender(tokenAddressFromInput, addressAry, valueAry, {
      value: fees,
    });

    return { success: true, transactionData: tokenTransfer };
  } catch (err) {
    console.log('this si reason', err);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, error: 'Transaction Rejected, Please Try Again', transactionData: false };
    }
    return { success: false, error: 'something went wrong', transactionData: false };
  }
};

// Multiple BNB Sender
const sendBNBFunction = async (addressAry, valueAry, totalAmmount) => {
  try {
    const authorizedUser = await contractData.authorizedusers(walletAddress);
    console.log('is this user authorized', authorizedUser);
    const tokenAddress = await contractData.tokenaddress();
    console.log('tokenAddress', tokenAddress);
    const quantity = (await contractData.quantity()).toString();

    var tokenContract = new ethers.Contract(tokenAddress, tokenABI, signerData);

    var balanceofToken = (await tokenContract.balanceOf(walletAddress)).toString();

    console.log('walletAddress', walletAddress);
    console.log('totalAmmount', totalAmmount);
    console.log('addressAry', addressAry);
    console.log('value ary', valueAry);
    console.log('authorized', authorizedUser);
    console.log('balance from token', balanceofToken);
    console.log('balance from quantity', quantity);

    // contractData

    var fees = (await contractData.fee()).toString();
    fees = ethers.utils.formatUnits(fees);
    console.log('fess', Number(fees));

    console.log('these are number', Number(balanceofToken), Number(quantity));

    if (authorizedUser && Number(balanceofToken) >= Number(quantity)) {
      fees = 0;
      console.log('fess in if condition', fees);
    }

    console.log('After if fee', fees);

    var feesBigNum = BigNumber(fees);

    sumAmount = BigNumber(totalAmmount);

    sumAmount = sumAmount.plus(feesBigNum);
    var totalValue = sumAmount.valueOf();

    console.log('total totalValue', totalValue);

    var totalValue = ethers.utils.parseEther(totalValue.toString()).toString();

    console.log('this is totalValue after parseEther', totalValue);

    // getBalance
    var signerBalance = (await signerData.getBalance()).toString();

    console.log('this is signer Balance', signerBalance);

    var totalValueBigNum = BigNumber(totalValue);

    var checkBlc = totalValueBigNum.comparedTo(signerBalance);
    console.log('check if blance compare', checkBlc);

    if (checkBlc == 1) {
      return { success: false, error: 'not enough balance', response: false };
    }

    // const gasPrice = await ethers.getDefaultProvider().getGasPrice();

    // console.log("gasPrice in string", gasPrice.toString())

    // // getting Estimate fees
    // var estimatedFees = await contractData.estimateGas.BNBmultisender(addressAry,valueAry,{value : totalValue});
    // console.log('this is gas estimate', estimatedFees.toString());

    // const transactionFee = gasPrice.mul(estimatedFees);
    // console.log("transactionFee in wei: " + transactionFee.toString());
    // console.log("transactionFee in ether: " + ethers.utils.formatUnits(transactionFee, "ether"));

    // send BNB

    var sendBNB = await contractData.BNBmultisender(addressAry, valueAry, { value: totalValue });

    console.log('send BNB', sendBNB);

    return { success: true, msg: 'BNB transfered successfully', response: sendBNB };
  } catch (err) {
    console.log('this is Error', err);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, error: 'Transaction Rejected, Please Try Again', response: false };
    }

    return { success: false, error: 'something went wrong', response: false };
  }
};

// const getFees for transactions
const getFeesDetailsForTransactions = async (currentTokenAddress, addressAry, valueAry, totalAmmount, isBNB) => {
  try {
    const authorizedUser = await contractData.authorizedusers(walletAddress);
    console.log('is this user authorized', authorizedUser);
    const tokenAddress = await contractData.tokenaddress();
    console.log('tokenAddress', tokenAddress);
    const quantity = (await contractData.quantity()).toString();

    var tokenContract = new ethers.Contract(tokenAddress, tokenABI, signerData);

    var balanceofToken = (await tokenContract.balanceOf(walletAddress)).toString();

    console.log('walletAddress', walletAddress);
    console.log('totalAmmount', totalAmmount);
    console.log('addressAry', addressAry);
    console.log('value ary', valueAry);
    console.log('authorized', authorizedUser);
    console.log('balance from token', balanceofToken);
    console.log('balance from quantity', quantity);

    // contractData

    var fees = (await contractData.fee()).toString();
    fees = ethers.utils.formatUnits(fees);
    var feesToShow = fees;
    console.log('fess', Number(fees));

    console.log('these are number', Number(balanceofToken), Number(quantity));

    console.log('this is fees to show before checking if condition', feesToShow);
    if (authorizedUser && Number(balanceofToken) >= Number(quantity)) {
      fees = 0;
      feesToShow = 0;
      console.log('fess in if condition', fees);
    }

    console.log('ffes to show after if user is authorize', feesToShow);

    console.log('After if fee', fees);

    var feesBigNum = BigNumber(fees);
    console.log('fees in BIGNUMber', feesBigNum);
    sumAmount = BigNumber(totalAmmount);

    sumAmount = sumAmount.plus(feesBigNum);
    var totalValue = sumAmount.valueOf();

    console.log('total totalValue', totalValue);

    var totalValue = ethers.utils.parseEther(totalValue.toString()).toString();

    console.log('this is totalValue after parseEther', totalValue);

    // getBalance
    var signerBalance = (await signerData.getBalance()).toString();

    console.log('this is signer Balance', signerBalance);

    var totalValueBigNum = BigNumber(totalValue);

    var checkBlc = totalValueBigNum.comparedTo(signerBalance);
    console.log('check if blance compare', checkBlc);

    const gasPrice = await ethers.getDefaultProvider().getGasPrice();

    console.log('gasPrice in string', gasPrice.toString());

    if (isBNB == true) {
      // getting Estimate fees
      var estimatedFees = await contractData.estimateGas.BNBmultisender(addressAry, valueAry, { value: totalValue });
      console.log('this is gas estimate', estimatedFees.toString());

      // // Why we doing multiplaction here??
      // var transactionFee = gasPrice.mul(estimatedFees);
      // var transactionFee = Number(gasPrice) * Number(estimatedFees);
      // // transactionFee = Number(transactionFee) * 4;
      // console.log('transactionFee in wei: ' + transactionFee.toString());
      // console.log('transactionFee in ether: ' + ethers.utils.formatUnits(transactionFee, 'ether'));

      // Why we doing multiplaction here??
      // const transactionFee = gasPrice.mul(estimatedFees);
      const transactionFee = 10 * estimatedFees;
      console.log('transactionFee in wei: ' + transactionFee.toString());
      console.log('transactionFee in ether: ' + ethers.utils.formatUnits(transactionFee, 'ether'));

      var ServiceFees = feesToShow;
      var ChainFees = ethers.utils.formatUnits(transactionFee, 'gwei');

      var totalFees = Number(ServiceFees) + Number(ChainFees);

      return { ServiceFees, ChainFees, totalFees, error: false };
    } else {
      isBNB = false;
      // token transfer GetTransactionPRice of token transfer;

      var fees = (await contractData.fee()).toString();
      var feesToShow = feesToShow;

      if (authorizedUser && Number(balanceofToken) >= Number(quantity)) {
        fees = 0;
        feesToShow = 0;
        console.log('fess in if condition', fees);
      }

      console.log('this is currentTokenAddress', tokenAddress);
      console.log('this is addressAry', addressAry);
      console.log('this is valueAry', valueAry);
      console.log('this is fees', fees);

      var estimatedFees = await contractData.estimateGas.TOKENmultisender(currentTokenAddress, addressAry, valueAry, {
        value: fees,
      });
      console.log('this is gas estimate', estimatedFees.toString());

      const transactionFee = 10 * Number(estimatedFees);
      console.log('transactionFee in wei: ' + transactionFee.toString());
      console.log('transactionFee in ether: ' + ethers.utils.formatUnits(transactionFee, 'ether'));

      var ServiceFees = feesToShow;
      var ChainFees = ethers.utils.formatUnits(transactionFee, 'gwei');

      var totalFees = Number(ServiceFees) + Number(ChainFees);

      return { ServiceFees, ChainFees, totalFees, error: false };
    }
  } catch (err) {
    console.log('this is Error2.0', err);
    if (err.data) {
      if (err.data.code == '-32000') {
        return { ServiceFees: '', ChainFees: '', totalFees: '', error: true, msg: 'insufficient funds for gas' };
      }
    }

    if (err.error.data.code == 3) {
      return { ServiceFees: '', ChainFees: '', totalFees: '', error: true, msg: 'transfer amount exceeds balance' };
    }

    return { ServiceFees: '', ChainFees: '', totalFees: '', error: true, msg: 'invalid Address' };
  }
};

// check If User AuthorizedTo Used THis Services

const checkIfUserAuthorizedToUse = async () => {
  try {
    const authorizedUser = await contractData.authorizedusers(walletAddress);

    console.log('check If User AuthoToUse', authorizedUser);

    return { success: true, isAuth: authorizedUser };
  } catch (err) {
    console.log('erro while checking AuthToUse', err);
    return { success: false, isAuth: false };
  }
};

// Exports functions
export default useMultiSenderContract;

export {
  getContractMultitSender,
  approveTokenWithContract,
  sendBNBFunction,
  getFeesDetailsForTransactions,
  useMultiSenderContractFun,
  checkIfUserAuthorizedToUse,
};

// parseEther for BNB
// parseUnit for token
