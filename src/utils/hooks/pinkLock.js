import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import batchTransferTokenLockABI from '@app/ABIs/pinkLock.json';
import erc20ABI from '@app/ABIs/Erc20TokenABI.json';

import { useMultiSenderContractFun } from './use-MultiSenderContract';

import {
  lockTokenBackendFun,
  deletTokenFromBackend,
  addBNBLock,
  deleteBNb,
  updateLockedToken,
  extendTokenLockAPI,
  transferLockOwnerShipBNBAPI,
  getTokenByID,
  getLockedBNbById,
  extendLockBNBAPI,
} from '../APIs/apis';

BigNumber.config({ EXPONENTIAL_AT: [-300, 300] });
var sumAmount = new BigNumber('0.0');

// const contractAddress = "0xd2ce571c138e000142f8b47EA91a4DC511B7f059";
// const contractAddress = "0x4F59259686604D64b30A01B57408467d8Cbfb4d5";
// const contractAddress = "0x39bd70577d7AcE96b548c5B3C75bD49E2d42b3Fc";

// const contractAddress = "0xa6A5e0AB5aD11DA4e02E15A4478f7261eFBf35d0";
// const contractAddress = "0x53818777dDDD1e295f75CB18417F98425403CF1B";
// const contractAddress = "0xb03e2f2807764b2493e11170c98A8B599d717854";
// const contractAddress = '0xaDD1129A89eeBfDbd5d52575fe5522918f82F467';
const contractAddress = '0xaE4D193c03B85bb1F5A71A4Cb3eF138403C4967e';

const { currentSigner } = require('./instances');

var tokenLockContract;

// this function to use to fetch data from Batch Transfer contract
const useMultiSenderContractFunctions = async (wAddress) => {
  try {
    var batchTransferContract = await useMultiSenderContractFun();

    const authorizedUser = await batchTransferContract.authorizedusers(wAddress);
    const quantity = (await batchTransferContract.quantity()).toString();

    // var tokenContract = new ethers.Contract(
    //     tokenAddress,
    //     tokenABI,
    //     signers
    //     );

    // console.log('this is batch Transfer Contract', authorizedUser)
    // console.log('this is batch Transfer quantity', quantity)

    return { authorizedusers: authorizedUser };
  } catch (err) {
    console.log('this is error in useMultiSenderContractFunctions', err);
  }
};

// getSpecificLock using Backend and Blockhcain contract

async function getSpecificLockIDToken(locksAry, tokenID) {
  try {
    console.log('this is lockAry', locksAry);
    console.log('this is tokenID', tokenID);

    var result = await getTokenByID(tokenID);

    var tokenData = result.data;
    console.log('this is result', result);

    var tokenAddress = tokenData.tokenAddress;
    var decimal = tokenData.tokenDecimal;
    var lockDate = tokenData.Date;

    console.log('date and time timeStampls', lockDate);

    lockDate = new Date(lockDate);
    console.log('utc time', lockDate);
    const dt = Date.parse(lockDate);
    var lockDate = dt / 1000;

    console.log('this is deciaml', decimal);
    var lockedAmountBackend = tokenData.total_Locked_Amount;
    lockedAmountBackend = ethers.utils.parseUnits(lockedAmountBackend.toString(), decimal).toString();
    var unLOckDate = Number(result.unLockDateUnix);

    console.log('this is tokenAddress of lockedTOken', tokenAddress);
    console.log('this is tokenAddress of lockedAmount', lockedAmountBackend);
    console.log('this is tokenAddress of unLOckDate', unLOckDate);

    var currentTokenData = [];
    locksAry.forEach((item, index) => {
      // console.log('item',item[1])
      // if(item[1])
      if (item[1] === tokenAddress) {
        currentTokenData.push(item);
      }
    });

    console.log('currentTokenData', currentTokenData);

    var currenTToken = [];
    currentTokenData.forEach((item, index) => {
      console.log('itemss', item);
      var unLockDateContract = Number(item.tgeDate.toString());
      var amount = Number(item.amount.toString());

      var lockDate2 = Number(item.lockDate.toString());
      var lockDate3 = Number(lockDate2) - Number(lockDate);

      lockDate3 = Math.abs(lockDate3);

      console.log(
        'this is unlockDate',
        unLockDateContract,
        +'' + unLOckDate + ' ' + amount + ' ' + lockedAmountBackend,
      );
      if (unLockDateContract === unLOckDate && Number(amount) == Number(lockedAmountBackend)) {
        console.log('this is lockDate3', lockDate3);

        if (lockDate3 <= 5) {
          var object = {
            Amount: Number(item.amount.toString()),
            id: Number(item.id.toString()),
            unLockDate: Number(item.tgeDate.toString()),
            token: item.token,
            lockDate2: lockDate2,
            lockDate: lockDate,
          };

          currenTToken.push(object);
        }
      }
    });

    //  console.log('this is last final result', currenTToken)

    return currenTToken[0];
  } catch (err) {
    console.log('this err while finding ID', err);
  }
}

// get specified Locked BNB Detials

async function getSpecifiedLockedBNBDetials(locksAry, bnbID) {
  try {
    console.log('this is wltAddr', locksAry);
    console.log('this is tokenID', bnbID);

    var result = await getLockedBNbById(bnbID);

    var bnbData = result.data;
    console.log('this is bnbData', bnbData);
    console.log('this is result', result);
    var unLockDate = Number(result.unLockUnix);
    var lockDate = result.lockDate;
    lockDate = new Date(lockDate);
    console.log('utc time', lockDate);
    const dt = Date.parse(lockDate);
    var lockDate = dt / 1000;

    var walletAddress = result.lockOwner;
    var lockedAmountBackend = result.lockedAmount;
    console.log('this is total LockedAmount', lockedAmountBackend);
    console.log('result from  unLockDate', unLockDate);
    console.log('result from  lockDate', lockDate);
    console.log('result from  walletAddress', walletAddress);

    var currentTokenData = [];
    locksAry.forEach((item, index) => {
      // console.log('this is item', item)
      if (item[1] === walletAddress) {
        currentTokenData.push(item);
      }
    });

    console.log('currentTokenData', currentTokenData);

    var currenTToken = [];
    currentTokenData.forEach((item, index) => {
      console.log('itemss', item);
      var unLockDateContract = Number(item.tgeDate.toString());
      var amount = Number(item.amount.toString());
      var lockDate2 = Number(item.lockDate.toString());
      var lockDate3 = Number(lockDate2) - Number(lockDate);

      lockDate3 = Math.abs(lockDate3);

      console.log(
        'this is unlockDate',
        unLockDateContract,
        +'' + unLockDate + ' ' + amount + ' ' + lockedAmountBackend,
      );
      if (unLockDateContract === unLockDate && Number(amount) == Number(lockedAmountBackend)) {
        console.log('this is lockDate3', lockDate3);

        if (lockDate3 <= 5) {
          var object = {
            Amount: Number(item.amount.toString()),
            id: Number(item.id.toString()),
            unLockDate: Number(item.tgeDate.toString()),
            lockDate2: lockDate2,
            lockDate: lockDate,
          };

          currenTToken.push(object);
        }
      }
    });

    //  console.log("currenTToken",currenTToken)

    return currenTToken[0];
  } catch (err) {
    console.log('this is err', err);
  }
}

// approve token for Lock
const approveToken = async (tokenAddress, totalAmmount) => {
  try {
    var signer = await currentSigner();
    var walletAddress = signer._address;

    console.log('token address', tokenAddress);
    console.log('token totalAmmount007', totalAmmount);

    // getting contract of current token
    var tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

    console.log('this is contract', tokenContract);
    var decimals = await tokenContract.decimals();

    console.log('decimal', decimals);

    console.log('this is total Amount', totalAmmount);

    var totalAmmount = ethers.utils.parseUnits(totalAmmount.toString(), decimals).toString();
    //    var totalAmmount = (ethers.utils.parseUnits((totalAmmount).toString(), "ether")).toString();

    console.log('this is total Amount after parseUnits', totalAmmount);

    console.log('this is the deciamls', decimals);

    // console.log(signerData)
    // console.log("this is token address", tokenAddress)

    var balance = (await tokenContract.balanceOf(walletAddress)).toString();

    console.log('balance of Token', balance);
    //    balance = await ethers.utils.formatUnits(balance,decimals);
    //    balance = (ethers.utils.parseUnits((balance).toString(),decimals)).toString();
    var totalBalanceFOrApprove = balance;

    console.log('balance of Token', totalBalanceFOrApprove);

    var tokenName = (await tokenContract.name()).toString();

    var tokenSymbol = (await tokenContract.symbol()).toString();

    var tokenData = {
      tokenBalance: balance,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
    };

    var error2 = '';

    console.log('this is wallet address', walletAddress);

    var approvedAmount = (await tokenContract.allowance(walletAddress, contractAddress)).toString();

    console.log('approval totalAmmount', totalAmmount);

    console.log(' allowance007', approvedAmount);

    console.log('check totalAmmount ', totalAmmount, ' and check approve Amount ', approvedAmount);
    console.log('check Balance ', balance, ' totalAmmount ', totalAmmount);

    if (Number(balance) < Number(totalAmmount)) {
      return { approval: '', err: 'not enough Balance', tokenData: '', msg: 'not enough Balance' };
    }

    if (Number(approvedAmount) <= Number(totalAmmount)) {
      var approve = await tokenContract.approve(contractAddress, totalBalanceFOrApprove);
      console.log('this is approval', approve);
      return { approval: approve, err: false, tokenData: tokenData, msg: '' };
    } else {
      return { msg: 'already approved', err: false, tokenData: tokenData, approval: false };
    }
  } catch (err) {
    console.log(err);

    return { approval: '', err: true, tokenData: '', msg: '' };
  }
};

// token lock

const lockTOkenBlockChainFun = async (owner, tokenAddress, isLpToken, TotalAmmount, unlockDate, description) => {
  try {
    var signer = await currentSigner();
    var totalAmountWithoutDecimal = TotalAmmount;
    console.log('this is Current Signer', signer);
    var walletAddress = signer._address;
    var chainID = signer.provider._network.chainId;
    var walletAddress2 = signer._address;
    var network = signer.provider._network.name;

    unlockDate = new Date(unlockDate).toUTCString();
    console.log('utc time', unlockDate);
    const dt = Date.parse(unlockDate);
    var unlockDate = dt / 1000;

    console.log('date and time timeStampls', unlockDate);

    var otherOwnser = '';
    if (owner == '') {
      owner = signer._address;
    }

    console.log('tokenAddress', tokenAddress);
    console.log('isLpToken', isLpToken);
    console.log('TotalAmmount', TotalAmmount);
    console.log('unlockDate', unlockDate);
    console.log('description', description);
    console.log('owner', owner);

    console.log('this is signer', signer);
    // contract  of token lock
    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    isLpToken = await pinkLockContract.checkValidLPToken(tokenAddress);

    console.log('is token is LP', isLpToken);

    console.log('this is contract', pinkLockContract);

    // tokenContract
    var tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

    console.log('');
    var decimals = (await tokenContract.decimals()).toString();

    // console.log("this is contract", pinkLockContract)
    var feeforTokenLock = (await pinkLockContract.lockFee()).toString();

    console.log('this is token Deciaml', decimals);
    // var TotalAmmount = (ethers.utils.parseUnits((TotalAmmount).toString(), "ether")).toString();
    var TotalAmmount = ethers.utils.parseUnits(TotalAmmount.toString(), decimals).toString();
    // var amount = ethers.utils.parseEther(amount).toString()

    console.log('this is parseUnits', TotalAmmount);

    //  TotalAmmount = BigNumber(TotalAmmount);
    //  sumAmount = sumAmount.plus(TotalAmmount)
    //  TotalAmmount = sumAmount.valueOf();

    var approvedAmount = (await tokenContract.allowance(walletAddress, contractAddress)).toString();

    console.log('approval approvedAmount', approvedAmount);

    console.log('this is last total Value before lock token', TotalAmmount);

    console.log('this is Owner', owner);

    var { authorizedusers } = await useMultiSenderContractFunctions(owner);

    if (authorizedusers == true) {
      feeforTokenLock = 0;
    }

    console.log('this is feeForTokenLock', feeforTokenLock);

    //  lock token blockchain function
    var lockToken = await pinkLockContract.lock(owner, tokenAddress, isLpToken, TotalAmmount, unlockDate, description, {
      value: feeforTokenLock,
    });

    // console.log('this is lock Data', lockToken)

    // getting TokenData
    var tokenName = await tokenContract.name();
    var tokenSymbol = await tokenContract.symbol();
    var tokenDecimal = await tokenContract.decimals();

    var TGE_Date = '';
    var tGE_Percentage = '';
    var cycle_Days = '';
    var cycle_ReleasePercentage = '';

    var lockID = '';

    await lockTokenBackendFun(
      lockID,
      cycle_ReleasePercentage,
      cycle_Days,
      tGE_Percentage,
      TGE_Date,
      isLpToken,
      walletAddress2,
      tokenAddress,
      description,
      totalAmountWithoutDecimal,
      owner,
      unlockDate,
      network,
      chainID,
      tokenName,
      tokenSymbol,
      tokenDecimal,
    );

    return { success: true };
  } catch (err) {
    console.log('this is error is JSON', err);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }

    if (err.error.data) {
      console.log('this property is also working');
      if (err.error.data.code == 3) {
        var msg = err.error.data.message;
        msg = msg.split(':');
        return { success: false, msg: msg[1] };
      }
    }
  }
};

const lockTokenVestingFun = async (
  owner,
  tokenAddress,
  TotalAmmount,
  tgeDate,
  tgePercent,
  CycleDays,
  CyclePercentage,
  title,
) => {
  try {
    var signer = await currentSigner();
    var totalAmountWithoutDecimal = TotalAmmount;
    var walletAddress = signer._address;
    var chainID = signer.provider._network.chainId;
    var walletAddress2 = signer._address;
    var network = signer.provider._network.name;

    if (owner == '') {
      owner = signer._address;
    }

    const dt = Date.parse(tgeDate);
    var tgeDate = dt / 1000;

    console.log('date and time timeStampls', tgeDate);

    console.log('tokenAddress', tokenAddress);
    console.log('owner', owner);
    console.log('title', title);
    console.log('tgeDate', tgeDate);
    console.log('tgePercent', tgePercent);
    console.log('CycleDays', CycleDays);
    console.log('CyclePercentage', CyclePercentage);

    // fetchToken
    var tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);

    var decimals = await tokenContract.decimals();

    var TotalAmmount = ethers.utils.parseUnits(TotalAmmount.toString(), decimals).toString();

    console.log('TotalAmmount', TotalAmmount);

    // fetch Contract
    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    isLpToken = await pinkLockContract.checkValidLPToken(tokenAddress);

    console.log('is token is LP', isLpToken);

    console.log('this is pinklock Contract', pinkLockContract);

    var feeforTokenLock = (await pinkLockContract.vestFee()).toString();

    console.log('this is value for vesting locking', feeforTokenLock);

    var { authorizedusers } = await useMultiSenderContractFunctions(owner);

    if (authorizedusers == true) {
      feeforTokenLock = 0;
    }

    console.log('this is feeForTokenLock', feeforTokenLock);

    var data = await pinkLockContract.vestingLock(
      owner,
      tokenAddress,
      isLpToken,
      TotalAmmount,
      tgeDate,
      tgePercent,
      CycleDays,
      CyclePercentage,
      title,
      { value: feeforTokenLock },
    );

    var TGE_Date = tgeDate;
    var tGE_Percentage = tgePercent;
    var cycle_Days = CycleDays;
    var cycle_ReleasePercentage = CyclePercentage;
    var description = title;

    // getting TokenData
    var tokenName = await tokenContract.name();
    var tokenSymbol = await tokenContract.symbol();
    var tokenDecimal = await tokenContract.decimals();

    console.log('this is before sending data to backend');
    // lock token backend function

    var lockID = '';
    await lockTokenBackendFun(
      lockID,
      cycle_ReleasePercentage,
      cycle_Days,
      tGE_Percentage,
      TGE_Date,
      isLpToken,
      walletAddress2,
      tokenAddress,
      description,
      totalAmountWithoutDecimal,
      owner,
      tgeDate,
      network,
      chainID,
      tokenName,
      tokenSymbol,
      tokenDecimal,
    );

    return { success: true };
  } catch (err) {
    console.log('this si Error while vesting Lock', err);
    return { success: false, transactionHash: '' };
  }
};

// unlock Tokne
const unLockToken = async (currentTokenID, tokenAddress) => {
  try {
    console.log('this is unlock tokenID', currentTokenID);

    var signer = await currentSigner();

    var walletAddress = signer._address;

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    var isLpToken = await pinkLockContract.checkValidLPToken(tokenAddress);

    console.log('is token is LP', isLpToken);

    var allLocksAry = [];

    if (isLpToken == true) {
      allLocksAry = await pinkLockContract.lpLocksForUser(walletAddress);
    } else {
      allLocksAry = await pinkLockContract.normalLocksForUser(walletAddress);
    }

    var result = await getSpecificLockIDToken(allLocksAry, currentTokenID);

    var lockID = result.id;
    console.log('this is result', result);

    // LockRemoved

    await pinkLockContract.unlock(lockID);

    await deletTokenFromBackend(currentTokenID);

    return {
      success: true,
    };
  } catch (err) {
    console.log('this is err', err);
    return { success: false };
  }
};

// extent token lock
const transferLockOwnerShip = async (currentTokenID, unLockID, newOwner, tokenAddress) => {
  try {
    console.log('this is lock iD', unLockID);
    console.log('this is current token id', currentTokenID);
    console.log('this is current token id', newOwner);

    var signer = await currentSigner();

    var walletAddress = signer._address;

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    console.log('this is pinkLock contract', pinkLockContract);

    var isLpToken = await pinkLockContract.checkValidLPToken(tokenAddress);

    console.log('is token is LP', isLpToken);

    var allLocksAry;

    if (isLpToken == true) {
      console.log('this is LPTOken007');
      allLocksAry = await pinkLockContract.lpLocksForUser(walletAddress);
    } else {
      console.log('this is not LPTOken007');
      allLocksAry = await pinkLockContract.normalLocksForUser(walletAddress);
    }

    var result = await getSpecificLockIDToken(allLocksAry, currentTokenID);

    var lockID = result.id;

    await pinkLockContract.transferLockOwnership(lockID, newOwner);

    var currentTokenID = currentTokenID;

    var lockId = '';
    await updateLockedToken(lockId, newOwner, currentTokenID);

    return { success: true, msg: 'new Owner Added Successfully' };
  } catch (err) {
    console.log('this is error while BNB Lock', err);
    console.log('this is code', err.code);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }

    if (err.error.data) {
      console.log('this property is also working');
      if (err.error.data.code == 3) {
        var msg = err.error.data.message;
        msg = msg.split(':');
        return { success: false, msg: msg[1] };
      }
    }

    return { success: false, msg: '' };
  }
};

// extend token Lock

const extendTokenLock = async (LockID, tokenID, amount, newLockDate, tokenDecimal, tokenAddress) => {
  try {
    var currentTokenID = tokenID;

    console.log('this is token currentTokenID', currentTokenID);

    var signer = await currentSigner();
    var walletAddress = signer._address;

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    console.log('this is pinLock Contract', pinkLockContract);

    var unlockDate = new Date(newLockDate).toUTCString();
    console.log('utc time', unlockDate);
    const dt = Date.parse(unlockDate);
    var unlockDate = dt / 1000;

    console.log('date and time timeStampls', unlockDate);

    var newAmount = amount;

    // var amount = ethers.utils.parseEther(amount,tokenDecimal).toString()
    var amount = ethers.utils.parseUnits(amount.toString(), tokenDecimal).toString();

    console.log('this is amount in Ether', amount);

    var isLpToken = await pinkLockContract.checkValidLPToken(tokenAddress);

    console.log('is token is LP', isLpToken);

    var allLocksAry;

    if (isLpToken == true) {
      console.log('this is LPTOken007');
      allLocksAry = await pinkLockContract.lpLocksForUser(walletAddress);
    } else {
      console.log('this is not LPTOken007');
      allLocksAry = await pinkLockContract.normalLocksForUser(walletAddress);
    }

    var result = await getSpecificLockIDToken(allLocksAry, currentTokenID);

    console.log('this is final Result', result);
    var lockID = result.id;

    var owner = walletAddress;

    var feeforTokenLock = (await pinkLockContract.lockFee()).toString();

    var { authorizedusers } = await useMultiSenderContractFunctions(owner);

    if (authorizedusers == true) {
      feeforTokenLock = 0;
    }

    console.log('this is feeForTokenLock', feeforTokenLock);

    // extend Lock Blockhain functino
    await pinkLockContract.editLock(lockID, amount, unlockDate, { value: feeforTokenLock });

    // API function
    await extendTokenLockAPI(owner, currentTokenID, unlockDate, newAmount);

    return { success: true, msg: 'Lock Updated Successfully' };
  } catch (err) {
    console.log('this is err', err);

    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }

    if (err.error.data.code == 3) {
      var msg = err.error.data.message;
      console.log('this is err MSG', msg);
      var msg = msg.split(':');

      return { success: false, msg: msg[1] };
    }
  }
};

// *************************************
//          bnb Lock functions
// ************************************

// BNb Lock function
const BNBLockFun = async (title, amount, unlockDate) => {
  try {
    var signer = await currentSigner();
    var owner = '';
    var walletAddress = signer._address;

    var chainID = signer.provider._network.chainId;
    var network = signer.provider._network.name;

    if (owner == '') {
      owner = signer._address;
    }

    var unlockDate = Date.parse(unlockDate);
    unlockDate = unlockDate / 1000;
    console.log('owner', owner);
    console.log('amount', amount);
    console.log('unlockDate', unlockDate);
    console.log('title', title);

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    // check if authorized
    var { authorizedusers } = await useMultiSenderContractFunctions(owner);

    console.log('current COntract', pinkLockContract);
    console.log('authorizedusers', authorizedusers);
    var LockfeeValue = (await pinkLockContract.lockFee()).toString();
    console.log('this is lock fee', LockfeeValue);

    if (authorizedusers == true) {
      LockfeeValue = 0;
    }
    console.log('this is fee checking after auth', LockfeeValue);
    // var amount = (ethers.utils.parseUnits(amount,8)).toString()
    // var amount = (ethers.utils.formatEther(amount)).toString();
    var amount = ethers.utils.parseEther(amount).toString();
    console.log('this is amount after parse Ether', amount);

    var totalAmount = (Number(LockfeeValue) + Number(amount)).toString();
    // var totalAmount = amount;

    console.log('this is Total Amount lockFee+Amount', totalAmount);

    var signerBalance = (await signer.getBalance()).toString();

    console.log('this si signerBalance', signerBalance);
    if (Number(signerBalance) < Number(totalAmount)) {
      return { success: false, msg: 'not enough balance to lock' };
    }

    // console.log('this is the balance of Signer', userBalance)

    console.log('this is line1154');
    await pinkLockContract.LockBNB(owner, amount, unlockDate, title, { value: totalAmount });

    // console.log("this is final Data", finalData)

    var totalAmount = amount;

    var tgeDate = '';
    var tgePercentage = '';
    var cycleDays = '';
    var cycleRelease = '';
    var unLockDateStr = unlockDate;

    console.log('this is line1174');
    var lockID = '';
    var owner = walletAddress;
    addBNBLock(
      walletAddress,
      title,
      totalAmount,
      unLockDateStr,
      lockID,
      owner,
      chainID,
      network,
      tgeDate,
      tgePercentage,
      cycleDays,
      cycleRelease,
    );

    return { success: true, msg: 'bnb locked successfully', walletAddress: walletAddress };
  } catch (err) {
    console.log('this is error while BNB Lock', err);
    console.log('this is code', err.code);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }

    if (err.error.data) {
      console.log('this property is also working');
      if (err.error.data.code == 3) {
        var msg = err.error.data.message;
        msg = msg.split(':');
        return { success: false, msg: msg[1] };
      }
    }
  }
};

//  bnb Vestin function

const bnbLockVesting = async (titleBNB, Amount2BNB, bnbTgeDate, BNBtgePercent, BNBCycleDays1, BNBcyclePercentage) => {
  try {
    var signer = await currentSigner();

    var chainID = signer.provider._network.chainId;
    var network = signer.provider._network.name;

    var owner = '';
    var walletAddress = signer._address;
    if (owner == '') {
      owner = signer._address;
    }

    var bnbTgeDate = Date.parse(bnbTgeDate);
    bnbTgeDate = bnbTgeDate / 1000;

    console.log('titleBNB', titleBNB);
    console.log('Amount2BNB', Amount2BNB);
    console.log('bnbTgeDate', bnbTgeDate);
    console.log('bnbTgeDate', bnbTgeDate);
    console.log('BNBtgePercent', BNBtgePercent);
    console.log('BNBCycleDays1', BNBCycleDays1);
    console.log('BNBcyclePercentage', BNBcyclePercentage);

    var signer = await currentSigner();
    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    console.log('this is pinkLockContract', pinkLockContract);

    var { authorizedusers } = await useMultiSenderContractFunctions(owner);

    console.log('authorizedusers', authorizedusers);
    var LockfeeValue = (await pinkLockContract.vestFee()).toString();
    console.log('this is lock fee', LockfeeValue);

    if (authorizedusers == true) {
      LockfeeValue = 0;
    }

    var Amount2BNB = ethers.utils.parseEther(Amount2BNB).toString();
    console.log('this is amount after parse Ether', Amount2BNB);

    var totalAmount = (Number(LockfeeValue) + Number(Amount2BNB)).toString();

    console.log('this is totalAmount', totalAmount);

    var signerBalance = (await signer.getBalance()).toString();

    console.log('this si signerBalance', signerBalance);
    if (Number(signerBalance) < Number(totalAmount)) {
      return { success: false, msg: 'not enough balance to lock' };
    }

    var lockData = await pinkLockContract.VestingLockBNB(
      owner,
      Amount2BNB,
      bnbTgeDate,
      BNBtgePercent,
      BNBCycleDays1,
      BNBcyclePercentage,
      titleBNB,
      { value: totalAmount },
    );

    var title = titleBNB;

    var lockID = '';
    var unlockDate = bnbTgeDate;
    await addBNBLock(
      walletAddress,
      title,
      Amount2BNB,
      unlockDate,
      lockID,
      owner,
      chainID,
      network,
      bnbTgeDate,
      BNBtgePercent,
      BNBCycleDays1,
      BNBcyclePercentage,
    );

    return {
      success: true,
      msg: 'bnb Vested Successfully',
      walletAddress: walletAddress,
    };
  } catch (err) {
    console.log('this is error while BNB Lock', err);
    console.log('this is code', err.code);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }

    if (err.error.data) {
      console.log('this property is also working');
      if (err.error.data.code == 3) {
        var msg = err.error.data.message;
        msg = msg.split(':');
        return { success: false, msg: msg[1] };
      }
    }
  }
};

// unlockSimple BNB

const unLockSimpleBNB = async (currentTokenID) => {
  try {
    console.log('this is simple bNB');
    console.log('and this is currentT ID ', currentTokenID);

    var signer = await currentSigner();

    var walletAddress = signer._address;

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    // unlock the Locked BNB

    console.log('this is contract', pinkLockContract);

    var lockAry = await pinkLockContract.BNBLocksForUser(walletAddress);
    // get specificied LockedDetial of BNB from Contract

    var result = await getSpecifiedLockedBNBDetials(lockAry, currentTokenID);

    console.log('this is finalResul', result);
    var lockID = result.id;

    await pinkLockContract.unlockBNB(lockID);

    // delete Api from baceknd
    await deleteBNb(currentTokenID);

    return { success: true, msg: 'bnb unlocked Successfully' };
  } catch (err) {
    console.log('this is err', err);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }
  }
};

const unLockSimpleBNBVesting = async (unLockID, currentTokenID) => {
  try {
    console.log('ths is unlock ID', unLockID + ' and this is currentT ID  ' + currentTokenID);

    var signer = await currentSigner();

    var walletAddress = signer._address;

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    // unlock the Locked BNB

    var lockAry = await pinkLockContract.BNBLocksForUser(walletAddress);
    // get specificied LockedDetial of BNB from Contract

    var result = await getSpecifiedLockedBNBDetials(lockAry, currentTokenID);

    console.log('this is finalResul', result);
    var lockID = result.id;

    await pinkLockContract.unlockBNB(lockID);

    // delete Api from baceknd
    await deleteBNb(currentTokenID);

    return { success: true, msg: 'bnb unlocked Successfully' };
  } catch (err) {
    console.log('this is err', err);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }
  }
};

// transferLockOwnerShip BNB
const transferLockOwnerShipBNBFun = async (currentBNBID, newOwner) => {
  try {
    console.log('this is current currentBNBID', currentBNBID);
    console.log('this is current newOwner', newOwner);

    var signer = await currentSigner();

    var walletAddress = signer._address;

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    console.log('pinkLockContract', pinkLockContract);

    var lockAry = await pinkLockContract.BNBLocksForUser(walletAddress);
    // get specificied LockedDetial of BNB from Contract

    var result = await getSpecifiedLockedBNBDetials(lockAry, currentBNBID);

    console.log('his is final Result', result);
    var lockID = result.id;

    await pinkLockContract.transferLockOwnershipBNB(lockID, newOwner);

    await transferLockOwnerShipBNBAPI(currentBNBID, newOwner);

    return { success: true };
  } catch (err) {
    console.log('this is err', err);
    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }
  }
};

// edit lock BNB
const extendLockBNB = async (amount, newLockDate, wltAddr, id) => {
  try {
    console.log('amount', amount);
    console.log('newLockDate', newLockDate);
    console.log('wltAddr', wltAddr);
    console.log('id', id);

    var signer = await currentSigner();

    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    var lockAry = await pinkLockContract.BNBLocksForUser(wltAddr);
    // get specificied LockedDetial of BNB from Contract

    var result = await getSpecifiedLockedBNBDetials(lockAry, id);

    console.log('his is final Result', result);

    var lockID = result.id;
    var amount = ethers.utils.parseEther(amount).toString();
    console.log('this si amount after parse', amount);

    var unlockDate = Date.parse(newLockDate);
    unlockDate = unlockDate / 1000;

    console.log('new unLockDate', unlockDate);

    console.log('this is pinkLock pinkLockContract', pinkLockContract);

    var feeforTokenLock = (await pinkLockContract.lockFee()).toString();

    var { authorizedusers } = await useMultiSenderContractFunctions(wltAddr);

    if (authorizedusers == true) {
      feeforTokenLock = 0;
    }

    feeforTokenLock = Number(amount) + Number(feeforTokenLock);

    console.log('this is feeForTokenLock', feeforTokenLock);

    await pinkLockContract.editLockBNB(lockID, amount, unlockDate, { value: feeforTokenLock });

    await extendLockBNBAPI(id, unlockDate, amount);

    return { success: true };
  } catch (err) {
    console.log('this is err', err);

    if (err.code == 'ACTION_REJECTED') {
      return { success: false, msg: 'user rejected transaction' };
    }

    if (err.error.data.code == 3) {
      var msg = err.error.data.message;
      console.log('this is err MSG', msg);
      var msg = msg.split(':');

      return { success: false, msg: msg[1] };
    }
  }
};

// get Lock Fees Detials

const getLockFeeDetails = async (getLockFeeDetails) => {
  try {
    var signer = await currentSigner();
    var pinkLockContract = new ethers.Contract(contractAddress, batchTransferTokenLockABI, signer);

    var LockFee = 0;
    var vestFee = 0;

    console.log('this is contract PInKLock', pinkLockContract);
    LockFee = Number(await pinkLockContract.lockFee());
    LockFee = ethers.utils.formatEther(LockFee.toString());
    vestFee = Number(await pinkLockContract.vestFee());
    vestFee = ethers.utils.formatEther(vestFee.toString());

    console.log('this is Lock Fee Fetched', LockFee);
    console.log('this is Lock Fee Fetched', vestFee);

    return { success: true, LockFee: LockFee, vestFee: vestFee };
  } catch (err) {
    console.log('error while fetching Lockn contract fee detials', err);
    return { success: false, LockFee: '', vestFee: '' };
  }
};

export {
  approveToken,
  lockTOkenBlockChainFun,
  lockTokenVestingFun,
  unLockToken,
  BNBLockFun,
  bnbLockVesting,
  unLockSimpleBNB,
  transferLockOwnerShip,
  unLockSimpleBNBVesting,
  extendTokenLock,
  transferLockOwnerShipBNBFun,
  extendLockBNB,
  getLockFeeDetails,
};
