var originuUrl = 'https://good-red-mackerel-shoe.cyclic.app/api';
import axios from 'axios';
import moment from 'moment';
import { ethers } from 'ethers';
// moment(timestamp).utc().toString()

const { currentSigner } = require('../hooks/instances');

// test
import batchTransferTokenLockABI from '@app/ABIs/pinkLock.json';
const contractAddress = '0x53818777dDDD1e295f75CB18417F98425403CF1B';

// get all tokens by chain iD
const getAllTokensByChainID = async (pageNum) => {
  try {
    const signer = await currentSigner();
    var chainID;
    if (signer.provider == undefined) {
      chainID = 97;
    } else {
      chainID = signer.provider._network.chainId;
    }

    var data = {
      chainID: chainID,
      pageNum: pageNum,
      itemPerPage: '10',
    };

    let responseData = [];
    let totalPages;
    let itemLength;
    await axios({
      method: 'POST',
      url: `${originuUrl}/getTokensForListingPage`,
      data: data,
    })
      .then(function (response) {
        console.log('this is reponse from API', response);
        console.log('this is totalPages', response.data.totalPages);
        responseData = response.data.Data;

        totalPages = response.data.totalPages;
        itemLength = response.data.length;
        console.log(responseData);
      })
      .catch(function (error) {
        console.log('this is erro while fetching api', error);
      });

    return { success: true, data: responseData, totalPages: totalPages, itemLength: itemLength };
  } catch (err) {
    console.log('this is error', err);
    return { success: false, data: [], msg: 'something went wrong', totalPages: 0, itemLength: 0 };
    // console.log('ths erro', err)
  }
};

// get tokens locked by specific Address and chain
const getMyLockedTokens = async (pageNum) => {
  try {
    const signer = await currentSigner();
    console.log('this is currentSigner', signer);

    var chainID = signer.provider._network.chainId;
    var walletAddress = signer._address;

    var data = {
      walletAddress: walletAddress,
      chainID: chainID,
      pageNum: pageNum,
      itemPerPage: '10',
    };
    let responseData;
    let itemLength;
    let totalPages;

    console.log('this is data that I want to send', data);
    await axios({
      method: 'POST',
      url: `${originuUrl}/getLockedSingleTokenDataByAddress`,
      data: data,
    })
      .then(function (response) {
        console.log('this is response', response);
        responseData = response.data.data;

        itemLength = response.data.itemLength;
        totalPages = response.data.totalPages;
      })
      .catch(function (error) {
        console.log('this is erro while fetching api', error);
      });

    // get data that has same token Address
    return { success: true, data: responseData, itemLength: itemLength, totalPages: totalPages };
  } catch (err) {
    console.log('this is error', err);
    return { success: false, data: [], msg: 'something went wrong while Fetching data' };
  }
};

// lock token

const lockTokenBackendFun = async (
  lockID,
  cycle_ReleasePercentage,
  cycle_Days,
  tGE_Percentage,
  TGE_Date,
  isLpToken,
  walletAddress2,
  tokenAddress,
  description,
  TotalAmmount,
  owner,
  unlockDate,
  network,
  chainID,
  tokenName,
  tokenSymbol,
  tokenDecimal,
) => {
  try {
    var now = new Date(); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time)
    var isoDate = new Date();
    var currentData = isoDate;

    // console.log('this is current Date and Time', currentData)

    // var lockID = await sessionStorage.getItem("lockID");
    // console.log('this is lock ID, getting in API post', lockID)

    var data = {
      walletAddress: owner,
      tokenAddress: tokenAddress,
      title: description,
      total_Locked_Amount: TotalAmmount,
      total_Locked_Value: '',
      owner: owner,
      Lock_Date: currentData,
      unLock_Date: unlockDate,
      TGE_Date: TGE_Date,
      tGE_Percentage: tGE_Percentage,
      cycle_Days: cycle_Days,
      cycle_ReleasePercentage: cycle_ReleasePercentage,
      network: network,
      chainID: chainID,
      tokenName: tokenName,
      tokenSymbol: tokenSymbol,
      tokenDecimal: tokenDecimal,
      isLpToken: isLpToken,
      lockID: lockID,
    };

    console.log('this is data from API token Lock ', data);
    var dataResponse = '';
    await axios({
      method: 'POST',
      url: `${originuUrl}/LockedToken`,
      data: data,
    })
      .then(function (response) {
        console.log('this is response after token Lock', response);
        dataResponse = 'token added successfully';
      })
      .catch(function (error) {
        console.log('this is erro while token Lock', error);
      });

    return { success: true, msg: dataResponse };
  } catch (error) {
    console.log('err while token Lock', error);
    return { success: false };
  }
};

// get token by token ID
const getTokenByTokenID = async (tokenAddress) => {
  try {
    var data = {
      tokenAddress: tokenAddress,
    };

    var currentTokenData;
    await axios({
      method: 'POST',
      url: `${originuUrl}/getAllTokenAddressUsingAddress`,
      data: data,
    })
      .then(function (response) {
        console.log('current Token Fetched', response);
        currentTokenData = response.data.Data;
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });

    console.log('these are current Tokens', currentTokenData);

    var totalAmount = 0;
    var totalLockedValue = 0;
    var newItemAry = [];
    currentTokenData.forEach((item, index) => {
      totalAmount += Number(item.total_Locked_Amount);

      console.log('this is item  unlockDate', item.unlockDate);
      item.unLock_Date = formateDateAndTime(item.unLock_Date, true);

      var wltAddrress = item.walletAddress.split('');
      item.walletAddress = `${wltAddrress[0]}${wltAddrress[1]}${wltAddrress[2]}${wltAddrress[3]}...${
        wltAddrress[wltAddrress.length - 3]
      }${wltAddrress[wltAddrress.length - 2]}${wltAddrress[wltAddrress.length - 1]}`;

      newItemAry.push(item);
    });

    currentTokenData = newItemAry;

    console.log('working007', currentTokenData[0].tokenAddress);

    var TokenSummary = [
      { name: 'totalAmount', value: totalAmount },
      { name: 'totalLockedValue', value: totalLockedValue },
      { name: 'tokenAddress', value: currentTokenData[0].tokenAddress },
      { name: 'tokenName', value: currentTokenData[0].tokenName },
      { name: 'tokenSymbol', value: currentTokenData[0].tokenSymbol },
      { name: 'tokenDecimal', value: currentTokenData[0].tokenDecimal },
    ];

    return { success: true, tokenData: currentTokenData, tokenSummary: TokenSummary };
  } catch (err) {
    console.log('this is erro wile get token By TokenID', err);
    return { success: false, tokenData: '' };
  }
};

// get tokenn by ID

const getTokenByID = async (currentTokenID) => {
  try {
    console.log('this is currentTOkenID', currentTokenID);
    var data = {
      id: currentTokenID,
    };

    var currentTokenData;
    var unLockDateUnix;
    var currentTokenAddress;
    await axios({
      method: 'POST',
      url: `${originuUrl}/getTokenByID`,
      data: data,
    })
      .then(function (response) {
        console.log('current Token Fetched', response);
        currentTokenData = response.data.Data[0];
        currentTokenAddress = currentTokenData.tokenAddress;
        unLockDateUnix = currentTokenData.unLock_Date;

        //    working Here
        var date = new Date(Number(currentTokenData.unLock_Date) * 1000);

        //    Lock Date  convert to readAble
        currentTokenData.unLock_Date = formateDateAndTime(currentTokenData.unLock_Date, true);

        currentTokenData.Lock_Date = formateDateAndTime(currentTokenData.Lock_Date, false);
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });

    var now = new Date(); // Fri Feb 20 2015 19:29:31 GMT+0530 (India Standard Time)
    var isoDate = new Date();

    console.log(isoDate);

    return {
      success: true,
      data: currentTokenData,
      unLockDateUnix: unLockDateUnix,
      currentTokenID: currentTokenID,
      currentTokenAddress: currentTokenAddress,
    };
  } catch (err) {
    console.log('this is err while fetching CT', err);
    return { success: false, data: [], unLockDateUnix: '', currentTokenID: '', currentTokenAddress: '' };
  }
};

// delete token from backend after lockout

// this function not used for delete token from backend
// now it will only upldate token from baceknd
// that token is Unlocked == true

const deletTokenFromBackend = async (id) => {
  try {
    var newDate = new Date();
    var unLockedAtTimeStamp = Date.parse(newDate);
    unLockedAtTimeStamp = unLockedAtTimeStamp / 1000;

    console.log('this is new DateTimeStamp', unLockedAtTimeStamp);
    var data = {
      id: id,
      isTokenUnlocked: true,
      unLock_Date: unLockedAtTimeStamp,
    };
    console.log('this is token ID you want to delet', id);

    var isTokenUnLocked = false;
    await axios({
      method: 'PATCH',
      url: `${originuUrl}/updateLockeToken`,
      data: data,
    })
      .then(function (response) {
        console.log('this is response while TokenUnlock', response);
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });

    return { success: true };
  } catch (err) {
    console.log('this is error while deleteing Item from APi', err);
  }
};

// updated version

const updateLockedToken = async (lockId, newOwner, currentTokenID) => {
  try {
    var data = {
      id: currentTokenID,
      lockID: lockId,
      Owner: newOwner,
      walletAddress: newOwner,
    };
    // updateLockeToken
    await axios({
      method: 'PATCH',
      url: `${originuUrl}/updateLockeToken`,
      data: data,
    })
      .then(function (response) {
        console.log('response data', response);
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });
  } catch (err) {
    console.log('this err comes to updated token locked infro', err);
  }
};

const extendTokenLockAPI = async (newOwner, currentTokenID, NewunlockDate, newAmount) => {
  try {
    console.log('this is new Lock Date', NewunlockDate);
    console.log('this is new Lock Date', newAmount);

    var data = {
      id: currentTokenID,
      Owner: newOwner,
      walletAddress: newOwner,
      unLock_Date: NewunlockDate,
      total_Locked_Amount: newAmount,
    };
    // updateLockeToken
    await axios({
      method: 'PATCH',
      url: `${originuUrl}/updateLockeToken`,
      data: data,
    })
      .then(function (response) {
        console.log('response data', response);
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });
  } catch (err) {
    console.log('this err comes to updated token locked infro', err);
  }
};

const filterTokenByTokenAddress = async (tokenAddress) => {
  try {
    console.log('you want to search this address', tokenAddress);
    const signer = await currentSigner();

    var chainID;
    if (signer.provider == undefined) {
      chainID = 97;
    } else {
      chainID = signer.provider._network.chainId;
    }

    console.log('chainID ', chainID);

    var data = {
      tokenAddress: tokenAddress,
      chainID: chainID,
    };

    var responseData;
    await axios({
      method: 'POST',
      url: `${originuUrl}/filterTokenByTokenAddress`,
      data: data,
    })
      .then(function (response) {
        console.log('response data', response);
        responseData = response.data.data;
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });

    return { success: true, data: responseData };
  } catch (err) {
    console.log('this is error', err);
    return { success: false };
  }
};

// -----------------------------
//  GET BNB LOCKED DATA
// ------------------------------

const addBNBLock = async (
  walletAddress,
  title,
  totalAmount,
  unlockDate,
  lockID,
  owner,
  chainID,
  network,
  tgeDate,
  tgePercentage,
  cycleDays,
  cycleRelease,
) => {
  try {
    const dateNow = new Date().toISOString();
    var currentData = dateNow;

    var data = {
      walletAddress: walletAddress,
      title: title,
      totalLockedAmount: totalAmount,
      owner: owner,
      lockDate: currentData,
      unLockDate: unlockDate,
      TgeDate: tgeDate,
      tgePercentage: tgePercentage,
      cycleDays: cycleDays,
      cycleRelease: cycleRelease,
      newtork: network,
      chainID: chainID,
      lockID: lockID,
    };

    console.log('this is whole data you want to save', data);

    await axios({
      method: 'POST',
      url: `${originuUrl}/lockBNB`,
      data: data,
    })
      .then(function (response) {
        console.log('this is response', response);
      })
      .catch(function (error) {
        console.log('this is erro while BNBLocked add to Backend', error);
      });

    return { success: true, msg: 'BNB Locked added to backend' };
  } catch (err) {
    console.lo('this si serro ', err);
  }
};

const getAllLockedBNB = async (pageNum) => {
  try {
    var data = {
      chainID: '97',
      itemPerPage: '10',
      pageNum: pageNum,
    };

    var responseData;
    var totalPages;
    var itemLength;
    var isSuccess = false;
    await axios({
      method: 'POST',
      url: `${originuUrl}/getlockedBNBforListing`,
      data: data,
    })
      .then(function (response) {
        console.log('this is response from api', response);
        responseData = response.data.Data;
        totalPages = response.data.totalPages;
        itemLength = response.data.length;
        isSuccess = true;

        if (responseData.length > 0) {
          var dataAry = [];
          responseData.forEach(async (item, index) => {
            console.log('these are items', item.total_Locked_Amount);

            var walletAddress = item.walletAddress;
            var wlt = walletAddress.split('');
            var firstChar = `${wlt[0]}${wlt[1]}${wlt[2]}${wlt[3]}`;
            var secondChar = `${wlt[wlt.length - 3]}${wlt[wlt.length - 2]}${wlt[wlt.length - 1]}`;
            // console.log('this is walletAddress ary', walletAddress)
            item.walletAddress = `${firstChar}...${secondChar}`;
            item.fullAddress = walletAddress;
            item.total_Locked_Amount = (await ethers.utils.formatEther(item.total_Locked_Amount.toString())).toString();
            dataAry.push(item);
          });

          responseData = dataAry;
        }

        console.log('this is api response', response);
      })
      .catch(function (error) {
        isSuccess = false;
        console.log('this is erro while token Fetched', error);
      });

    if (isSuccess == false) {
      return { success: false, data: [], totalPages: 0, itemLength: 0 };
    } else {
      return { success: true, data: responseData, totalPages: totalPages, itemLength: itemLength };
    }
  } catch (err) {
    console.log(err);
    return { success: false, data: [], totalPages: 0, itemLength: 0 };
  }
};

// get my locked BNB
const getMyLockedBNB = async (pageNum) => {
  try {
    const signer = await currentSigner();
    console.log('this is currentSigner', signer);

    var chainID = signer.provider._network.chainId;
    var walletAddress = signer._address;

    var data = {
      chainID: chainID,
      walletAddress: walletAddress,
      itemPerPage: '10',
      pageNum: pageNum,
    };

    var responseData;
    var totalPages;
    var itemLength;
    await axios({
      method: 'POST',
      url: `${originuUrl}/getLockedBNBByWalletAddressAndChainID`,
      data: data,
    })
      .then(function (response) {
        responseData = response.data.Data;

        var dataAry = [];
        responseData.forEach(async (item, index) => {
          var walletAddress = item.walletAddress;

          var wlt = walletAddress.split('');
          var firstChar = `${wlt[0]}${wlt[1]}${wlt[2]}${wlt[3]}`;
          var secondChar = `${wlt[wlt.length - 3]}${wlt[wlt.length - 2]}${wlt[wlt.length - 1]}`;
          // console.log('this is walletAddress ary', walletAddress)
          item.walletAddress = `${firstChar}...${secondChar}`;
          item.fullAddress = walletAddress;
          item.total_Locked_Amount = (await ethers.utils.formatEther(item.total_Locked_Amount.toString())).toString();
          dataAry.push(item);
        });

        responseData = dataAry;

        totalPages = response.data.totalPages;
        itemLength = response.data.itemLength;

        console.log('this is api response', response);
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });

    return { success: true, data: responseData, totalPages: totalPages, itemLength: itemLength };
  } catch (err) {
    console.log('this is error while fetching my lock BNB data', err);
    return { success: false, data: [], totalPages: [], itemLength: [] };
  }
};

// get all Locked BNB for BNB Detials

const getLockdBNBForBNBDetialPage = async (walletAddress) => {
  try {
    var data = {
      walletAddress: walletAddress,
    };

    var responseData;
    var totalLockedAmount = 0;
    var fullWalletAddress = '';

    await axios({
      method: 'POST',
      url: `${originuUrl}/getAllLockedBNBBYWalletAddres`,
      data: data,
    })
      .then(function async(response) {
        console.log('this is respons Data007', response);
        responseData = response.data.data;
        var newAry = [];
        fullWalletAddress = responseData[0].walletAddress;
        responseData.forEach(async (item, index) => {
          totalLockedAmount += Number(item.total_Locked_Amount);

          item.total_Locked_Amount = (await ethers.utils.formatEther(item.total_Locked_Amount.toString())).toString();

          var wltAdr = item.walletAddress.split('');
          var firstLtr = `${wltAdr[0]}${wltAdr[1]}${wltAdr[2]}${wltAdr[3]}`;
          var lastLtr = `${wltAdr[wltAdr.length - 3]}${wltAdr[wltAdr.length - 2]}${wltAdr[wltAdr.length - 1]}`;
          item.walletAddress = `${firstLtr}...${lastLtr}`;

          var unLockDateUnderstandABle = await formateDateAndTime(item.unLock_Date, true);

          item.unLock_Date = unLockDateUnderstandABle;
          newAry.push(item);
        });

        responseData = newAry;
      })
      .catch(function (error) {
        console.log('error while fetching data from API', error);
      });

    var ethAmount = (await ethers.utils.formatEther(totalLockedAmount.toString())).toString();

    console.log('ethAmount', totalLockedAmount);

    var owner = responseData[0].Owner;

    var tokenSummary = [
      { name: 'WalletAddress', value: fullWalletAddress },
      { name: 'Locked Amount', value: ethAmount },
      // {name : "Owner", value : owner}
    ];

    console.log('this is token Summary', tokenSummary);

    return { success: true, data: responseData, tokenSummary: tokenSummary };
  } catch (err) {
    console.log('this is error while fetching my lock BNB data', err);

    return { success: false, data: [], tokenSummary: [] };
  }
};

// get single Locked BNB by id
const getLockedBNbById = async (id) => {
  try {
    var data = { id: id };

    var responseData = '';
    var tgeDate = '';
    var currentID = id;
    await axios({
      method: 'POST',
      url: `${originuUrl}/getLockedBNbById`,
      data: data,
    })
      .then(function async(response) {
        console.log('this is response', response);
        responseData = response.data.data[0];
        tgeDate = response.data.data[0].TGE_Date;
      })
      .catch(function (error) {
        console.log('error while fetching data from API', error);
      });

    var total_Locked_Amount = (await ethers.utils.formatEther(responseData.total_Locked_Amount.toString())).toString();

    var isUnix = true;
    var tegeDate = await formateDateAndTime(responseData.TGE_Date, isUnix);
    var unLockDateTime = await formateDateAndTime(responseData.unLock_Date, isUnix);
    isUnix = false;
    var lockTime = await formateDateAndTime(responseData.Lock_Date, isUnix);

    var isBnbUnLocked = responseData.isBNBUnLocked;
    var lockedBNBData = [];
    if (isBnbUnLocked == false) {
      lockedBNBData = [
        { name: 'Title', value: responseData.lockTitle },
        // {name : "WalletAddress", value : responseData.walletAddress},
        { name: 'owner', value: responseData.Owner },
        { name: 'Locked Amount', value: total_Locked_Amount },
        { name: 'Lock Date', value: lockTime },
        { name: 'unLock Date', value: unLockDateTime },
        { name: 'Cycle Days', value: responseData.cycle_Days },
        { name: 'Cycle Percentage', value: responseData.cycle_ReleasePercentage },
        { name: 'TGE Date', value: tegeDate },
        { name: 'TGE Percentage', value: responseData.tGE_Percentage },
      ];
    } else {
      lockedBNBData = [
        { name: 'Title', value: responseData.lockTitle },
        // {name : "WalletAddress", value : responseData.walletAddress},
        { name: 'owner', value: responseData.Owner },
        { name: 'Locked Amount', value: total_Locked_Amount },
        { name: 'Lock Date', value: lockTime },
        { name: 'unLocked at', value: unLockDateTime },
      ];
    }

    var lockOwner = responseData.Owner;

    var unLockUnix = responseData.unLock_Date;
    var lockDate = responseData.Date;
    var lockID = responseData.lockID;
    var lockedAmount = responseData.total_Locked_Amount;
    var lockedAmountETH = lockedBNBData[2].value;
    console.log('this is value', lockedBNBData[2]);

    return {
      success: true,
      lockedAmountETH: lockedAmountETH,
      lockedAmount: lockedAmount,
      lockDate: lockDate,
      currentID: currentID,
      data: lockedBNBData,
      lockOwner: lockOwner,
      unLockUnix: unLockUnix,
      lockID: lockID,
      tgeDate: tgeDate,
      isBnbUnLocked: isBnbUnLocked,
    };
  } catch (err) {
    console.log('error while fetching api', err);
    return { success: false, data: [], tgeDate: '', lockOwner: '' };
  }
};

// convert Date to CorrectFromate
const formateDateAndTime = (dateStr, isUnix) => {
  if (dateStr == '') {
    return '';
  }
  var date = '';
  if (isUnix == true) {
    date = new Date(Number(dateStr) * 1000);
  } else {
    date = new Date(dateStr);
  }

  var FullYear = date.getFullYear();
  var month = date.getMonth();
  month = month + 1;
  var date007 = date.getDate();
  var time = date.getHours();
  var Minutes = date.getMinutes();

  var AmOrPm = 'am';
  if (time > 11) {
    AmOrPm = 'pm';
  }

  if (month < 10) {
    month = `0${month}`;
  }

  if (time < 10) {
    time = `0${time}`;
  }
  if (Minutes < 10) {
    Minutes = `0${Minutes}`;
  }

  var unLockDateTime = `${month}/${date007}/${FullYear} ${time}.${Minutes} ${AmOrPm}`;

  return unLockDateTime;
};

// delete Locked BNB from Backend
const deleteBNb = async (id) => {
  try {
    var newDate = new Date();
    var unLockedAtTimeStamp = Date.parse(newDate);
    unLockedAtTimeStamp = unLockedAtTimeStamp / 1000;

    console.log('this is new DateTimeStamp', unLockedAtTimeStamp);

    var data = {
      id: id,
      isBNBUnLocked: true,
      unLock_Date: unLockedAtTimeStamp,
    };

    await axios({
      method: 'PATCH',
      url: `${originuUrl}/updatedLockedBNB`,
      data: data,
    })
      .then(function async(response) {
        console.log('this delete Data from backend', response);
      })
      .catch(function (error) {
        console.log('error while fetching data from API', error);
      });
  } catch (err) {
    console.log('erer wihile deleting BNB suing PAI', err);
  }
};

// filtere locked BNB

const filterLockedBNB = async (inputValue) => {
  try {
    console.log('you want to search this address', inputValue);
    const signer = await currentSigner();

    var chainID;
    if (signer.provider == undefined) {
      chainID = 97;
    } else {
      chainID = signer.provider._network.chainId;
    }

    console.log('chainID ', chainID);

    var data = {
      walletAddress: inputValue,
      chainID: chainID,
    };

    var responseData;
    await axios({
      method: 'POST',
      url: `${originuUrl}/filtereLockedBNB`,
      data: data,
    })
      .then(function async(response) {
        responseData = response.data.data;

        var dataAry = [];
        responseData.forEach(async (item, index) => {
          var walletAddress = item.walletAddress;

          var wlt = walletAddress.split('');
          var firstChar = `${wlt[0]}${wlt[1]}${wlt[2]}${wlt[3]}`;
          var secondChar = `${wlt[wlt.length - 3]}${wlt[wlt.length - 2]}${wlt[wlt.length - 1]}`;
          // console.log('this is walletAddress ary', walletAddress)
          item.walletAddress = `${firstChar}...${secondChar}`;
          item.fullAddress = walletAddress;
          item.total_Locked_Amount = (await ethers.utils.formatEther(item.total_Locked_Amount.toString())).toString();
          dataAry.push(item);
        });

        responseData = dataAry;
      })
      .catch(function (error) {
        console.log('error while fetching data from API', error);
      });

    console.log('this is final Response', responseData);
    return { success: true, data: responseData };
  } catch (err) {
    console.log('err', err);
    return { success: false };
  }
};

// updated BNB transdfer lock ownerShip

const transferLockOwnerShipBNBAPI = async (bnbID, newOwner) => {
  try {
    var data = {
      id: bnbID,
      Owner: newOwner,
      walletAddress: newOwner,
    };

    // updateLockeToken
    await axios({
      method: 'PATCH',
      url: `${originuUrl}/updatedLockedBNB`,
      data: data,
    })
      .then(function (response) {
        console.log('response data', response);
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });
  } catch (err) {
    console.log('this is erro', err);
  }
};

const extendLockBNBAPI = async (id, unlockDate, amount) => {
  try {
    var data = {
      id: id,
      unLock_Date: unlockDate,
      total_Locked_Amount: amount,
    };

    // updateLockeToken
    await axios({
      method: 'PATCH',
      url: `${originuUrl}/updatedLockedBNB`,
      data: data,
    })
      .then(function (response) {
        console.log('response data', response);
      })
      .catch(function (error) {
        console.log('this is erro while token Fetched', error);
      });
  } catch (err) {
    console.log('this is erro', err);
  }
};

// exporting data
export {
  getAllTokensByChainID,
  getMyLockedTokens,
  lockTokenBackendFun,
  getTokenByTokenID,
  getTokenByID,
  deletTokenFromBackend,
  getAllLockedBNB,
  addBNBLock,
  getMyLockedBNB,
  getLockdBNBForBNBDetialPage,
  getLockedBNbById,
  deleteBNb,
  updateLockedToken,
  extendTokenLockAPI,
  filterTokenByTokenAddress,
  filterLockedBNB,
  transferLockOwnerShipBNBAPI,
  extendLockBNBAPI,
};
