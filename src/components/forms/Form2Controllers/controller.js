import { walletGeneratorInstance, tokenContractInstance, provider, signeraddr } from './web3Instance';
import { generateWallets } from './API';
import { ethers } from 'ethers';

// check if  user bought a lplan
const checkIfUserBoughtPlan = async (isWltConnected) => {
  try {
    console.log('this is walletGeneratorInstance', isWltConnected);
    if (isWltConnected == true) {
      const signer_ = await signeraddr();
      console.log('this is signer ', signer_);
      const walletGeneratorInstance_ = await walletGeneratorInstance();
      var isBoughtPlan = await walletGeneratorInstance_.checkPlan(signer_);

      if (isBoughtPlan == true) {
        const checkExpiray = (await walletGeneratorInstance_.getPlanExpiry(signer_)).toString();
        // return { success: true, isBoughtPlan: isBoughtPlan, checkExpiray: checkExpiray };
        return { success: true, isBoughtPlan: isBoughtPlan, checkExpiray: checkExpiray };
      } else {
        return { success: true, isBoughtPlan: isBoughtPlan, checkExpiray: '' };
      }
    } else {
      return { success: false, isBoughtPlan: false, checkExpiray: '' };
    }
  } catch (err) {
    // console.log('err while checking if User Bought Plan', err);
    return { success: false, isBoughtPlan: false, checkExpiray: '' };
  }
};

// check Selected Plan from frontEND;
async function CheckSelectedPlan(valueRadio, numberOfWallet) {
  const signer_ = await signeraddr();

  var plan = '';
  switch (valueRadio) {
    case '1':
      plan = 'payperuse';
      break;
    case '2':
      plan = '1month';
      break;
    case '3':
      plan = 'year';
      break;
    default:
      plan = '';
  }

  // const signer_ = await signeraddr();
  var tokenContract = await tokenContractInstance();
  const tokeBalance = (await tokenContract.balanceOf(signer_)).toString();
  console.log('this is token Balance', tokeBalance);

  const walletGeneratorInstance_ = await walletGeneratorInstance();

  // if value of Radio Button is 1
  console.log('thie value of of Radio Button', valueRadio);
  if (valueRadio == '1') {
    console.log('This is PyaPerUse');

    // console.log('this is walletGenerator Contract aDDRESS', );
    console.log('this is walletGeneratorInstance', walletGeneratorInstance_);

    var variableFee = await walletGeneratorInstance_.variableFee();

    console.log('this is variable Fee', Number(variableFee));

    const fee = Number(variableFee) * Number(numberOfWallet);

    console.log('this is fee', fee);

    // console.log('this is Fee for Tokens', )
    if (Number(tokeBalance) < fee) {
      return { success: false, msg: 'not enought balance' };
    }
    await approveTokens(fee, signer_);
    return { success: true, msg: '' };
  } else {
    const planPrice = await getPlanPrice(plan);
    console.log('this is plan price', Number(planPrice.price));
    console.log('this is plan price', planPrice.price.toString());

    console.log('this is signer_', signer_);
    if (Number(tokeBalance) < Number(planPrice.price)) {
      return { success: false, msg: 'not enought balance' };
    }
    await approveTokens(Number(planPrice.price), signer_);
    return { success: true, msg: '' };
  }
}

// approve Wallets
const approveWallets = async (valueRadio, numberOfWallet) => {
  try {
    console.log('working here outSIde', numberOfWallet);
    if (Number(numberOfWallet) > 1000) {
      console.log('working here inSide');
      return { success: false, msg: 'MAX 1000 WALLETS AT ONCE' };
    }
    console.log('this is value of Radio', valueRadio);
    console.log('this is value of Wallets', numberOfWallet);

    var result = await CheckSelectedPlan(valueRadio, numberOfWallet);

    console.log('this is approval token result', result);
    if (result.success == false) {
      return { success: false, msg: result.msg };
    } else {
      return { success: true };
    }
  } catch (err) {
    console.log('this is error while approve', err);
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

    return { success: false, msg: 'not enought balance' };
  }
};

// check plain of user
const checkPlan = async (valueRadio, numberOfWallet) => {
  try {
    if (numberOfWallet > 1000) {
      return { success: false, msg: 'MAX 1000 WALLETS AT ONCE' };
    }

    console.log('numberOfWallet ', numberOfWallet);
    console.log('this is signer', signer_);
    const signer_ = await signeraddr();

    console.log('this is tokenContractInstance', await tokenContractInstance());

    const walletGeneratorInstance_ = await walletGeneratorInstance();

    var isUserAthorized = await walletGeneratorInstance_.readAuthorizedUsers(signer_);
    console.log('checing Here if User AuthorizedXYZ', isUserAthorized);
    if (isUserAthorized == true) {
      valueRadio = '007';
    }

    console.log('walletGeneratior Instance', walletGeneratorInstance_);
    var userBoughtPlan = (await walletGeneratorInstance_.userPlan(signer_)).toString();
    console.log('this is userBoughtPlan', userBoughtPlan);

    console.log('radioButton You Selectd', valueRadio);

    var plan = '';
    switch (valueRadio) {
      case '1':
        plan = 'payperuse';
        break;
      case '2':
        plan = '1month';
        break;
      case '3':
        plan = 'year';
        break;
      default:
        plan = '';
    }

    console.log('check Plan of user', await walletGeneratorInstance_.checkPlan(signer_));

    // if value of Radio Button is 1
    if (valueRadio == '1') {
      console.log('This is PyaPerUse');
      const walletGeneratorInstance_ = await walletGeneratorInstance();

      console.log('this is walletGeneratorInstance', walletGeneratorInstance_);

      var variableFee = (await walletGeneratorInstance_.variableFee()).toString();
      console.log('this is variable Fee', variableFee);

      const fee = Number(variableFee) * Number(numberOfWallet);

      console.log('this is fee', fee);

      // await approveTokens(fee, signer_);
      // await new Promise((resolve) => {
      //   return setTimeout(resolve, 10000);
      // });

      await payForUse(numberOfWallet);
      await new Promise((resolve) => {
        return setTimeout(resolve, 15000);
      });
      console.log('this is signer', signer_);
      console.log('this is number of Wallets', numberOfWallet);

      return await generateWallets(valueRadio, signer_, Number(numberOfWallet));
    } else if (valueRadio == '') {
      return { success: false, msg: 'select Plan First' };
    } else if (valueRadio == '007') {
      console.log('this is signer', signer_);
      console.log('this is numberOfWallet', numberOfWallet);
      return await generateWallets(valueRadio, signer_, Number(numberOfWallet)); // call this if already have plan
    } else {
      const planPrice = await getPlanPrice(plan);
      console.log('this is plan Price', Number(planPrice.price));
      console.log('this is signer_', signer_);
      // await approveTokens(Number(planPrice.price), signer_);

      await buyPlan(plan);
      await new Promise((resolve) => {
        return setTimeout(resolve, 15000);
      });
      return await generateWallets(valueRadio, signer_, Number(numberOfWallet)); // call this if already have plan
    }
  } catch (err) {
    console.log('this is error', err);
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

    return { success: false };
  }
};

// Pay PerUse function
const payForUse = async (numberOfWallet) => {
  const walletGeneratorInstance_ = await walletGeneratorInstance();
  // console.log(walletGeneratorInstance_);

  await walletGeneratorInstance_.payFee(numberOfWallet);
};

// Approve Token
const approveTokens = async (amount, signer_) => {
  const tokenContractInstance_ = await tokenContractInstance();
  const walletGeneratorInstance_ = await walletGeneratorInstance();
  console.log('this is walletGenerator Instance', walletGeneratorInstance_);

  console.log('this is signerAddr007', signer_);
  var allowance = (await tokenContractInstance_.allowance(signer_, walletGeneratorInstance_.address)).toString();

  console.log('this is allowance', allowance);
  console.log('this is ammount', Number(amount));
  // amount = ethers.utils.formatEther(amount.toString(), 18);
  // console.log('this is ammount', amount);

  if (Number(amount) > Number(allowance)) {
    console.log('approvale is Working', walletGeneratorInstance_.address);
    await tokenContractInstance_.approve(walletGeneratorInstance_.address, amount.toString());
  }

  // console.log('lastFeePaid Detials', await walletGeneratorInstance_.getLastFeePaid(signer_));
};

// Buy Other Plan
const buyPlan = async (plan) => {
  // console.log(plan);
  const walletGeneratorInstance_ = await walletGeneratorInstance();
  // console.log(walletGeneratorInstance_);
  await walletGeneratorInstance_.buyPlan(plan);
  // console.log('this is signer in buy Plan', signer_);
  // console.log('check Plan of user', await walletGeneratorInstance_.checkPlan(signer_));
};

// Get Plan Price
const getPlanPrice = async (plan) => {
  // console.log(plan);
  const walletGeneratorInstance_ = await walletGeneratorInstance();
  // console.log(walletGeneratorInstance_);
  return await walletGeneratorInstance_.planDetails(plan);
  // console.log(await walletGeneratorInstance_.checkPlan(signer_[0]));
};

// this function is used to get Expire
const getExpiry = async (expiray) => {
  try {
    console.log('this is expiray', expiray);
    if (expiray != '') {
      // var expiry = '1675446360';
      // var expiry = expiray;

      return { success: true, remainTime: dateObj };
    } else {
      return { success: false, remainTime: '' };
    }
  } catch (err) {
    console.log('this is error in exprire function', err);
    return { success: false, remainTime: '' };
  }
};
//
//
//
//
//
//
// ===================================

//  Extend Plan of user

// ===================================
//   This function i used for Extend Plan of User
const extendPlan = async (valueRadio) => {
  try {
    console.log('you have sleected this plan -', valueRadio);

    const signer_ = await signeraddr();

    var tokenContract = await tokenContractInstance();
    const tokeBalance = (await tokenContract.balanceOf(signer_)).toString();
    console.log('this is token Balance', tokeBalance);

    var plan = '';
    switch (valueRadio) {
      case '2':
        plan = '1month';
        break;
      case '3':
        plan = 'year';
        break;
      default:
        plan = '';
    }

    console.log('this is Play', plan);
    const planPrice = await getPlanPrice(plan);
    console.log('this is plan Price', Number(planPrice.price));
    // console.log('this is signer_', signer_);

    console.log('this is plan price', Number(planPrice.price));
    console.log('this is plan price', planPrice.price.toString());

    console.log('this is signer_', signer_);
    if (Number(tokeBalance) < Number(planPrice.price)) {
      return { success: false, msg: 'not enought balance' };
    }
    await approveTokens(Number(planPrice.price), signer_);
    await new Promise((resolve) => {
      return setTimeout(resolve, 15000);
    });

    await buyPlan(plan);
    await new Promise((resolve) => {
      return setTimeout(resolve, 15000);
    });

    return { success: true, msg: 'Plan Extend Successfully' };
  } catch (err) {
    console.log('this is error', err);
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

    return { success: false };
  }
};

// check if User is Authorized to Use
const checkIfUserAuthorizedToUse = async () => {
  try {
    const walletGeneratorInstance_ = await walletGeneratorInstance();
    var signerAddr = await signeraddr();
    console.log('SignerAddre', signerAddr);
    console.log('this is contract', walletGeneratorInstance_);
    var isAUthorized = await walletGeneratorInstance_.readAuthorizedUsers(signerAddr);
    console.log('this is User AuthoOrNot', isAUthorized);
    return { success: true, isAuth: isAUthorized };
  } catch (err) {
    console.log('erro while checking AuthToUse', err);
    return { success: false, isAuth: false };
  }
};

// generate wallets using BNB Fees

const checkIfFees_In_BNB = async (radioValue) => {
  try {
    if (radioValue != '') {
      if (radioValue == '1') {
        var walletGeneratorInstanceInstance = await walletGeneratorInstance();
        console.log('this si vlaue', walletGeneratorInstanceInstance);
        // var isPeyPerUseBNbFee = await walletGeneratorInstanceInstance.nativeFee();
      }
    }
  } catch (err) {}
};

// Export Module
export {
  checkPlan,
  approveWallets,
  checkIfUserBoughtPlan,
  getExpiry,
  extendPlan,
  checkIfUserAuthorizedToUse,
  checkIfFees_In_BNB,
};
