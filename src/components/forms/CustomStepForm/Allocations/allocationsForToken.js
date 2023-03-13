import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

BigNumber.config({ EXPONENTIAL_AT: [-300, 300] });

const AllocationsFieldsForToken = async (allocatiosn, contractToken) => {
  // delete matching addresses;
  var deleteAddresses = localStorage.getItem('deleteAddress');
  var keepAddress = localStorage.getItem('keepAddress');
  console.log('in allocations field');
  try {
    console.log('this is allocations files', allocatiosn);

    console.log('this is contractToken', contractToken);

    var spaceToCheck = [];
    var isSpaceError = false;
    var addressAry = [];
    var valueAry = [];
    var PriceesAry = [];
    var totalAmmount = 0.0;
    var sumAmount = new BigNumber('0.0');
    var totalOutPutAmount = 0;
    var isAddreseseMatch = false;
    var addressesMatchedMsg = '';
    var allocatiosn = allocatiosn.trim();

    var AllocationAddressAry = allocatiosn.split('\n');

    console.log('this is otuside if condition', AllocationAddressAry.length);

    if (AllocationAddressAry[0] === '' || AllocationAddressAry[0] === 'undefined') {
      console.log('this is inside if condition', AllocationAddressAry);

      return {
        isSpaceError: false,
        addressAry: '',
        valueAry: '',
        totalAmmount: '',
        isInvalidTokenAddress: false,
        isAddreseseMatch,
        isAllocations: false,
        outOfLimit: '',
      };
    } else {
      if (AllocationAddressAry.length > 2000) {
        return {
          isSpaceError: false,
          addressAry: '',
          valueAry: '',
          totalAmmount: '',
          isInvalidTokenAddress: false,
          isAddreseseMatch,
          isAllocations: false,
          outOfLimit: 'MAXIMUM 2000 WALLETS PER BATCH',
        };
      } else {
        // getting contract token decimals
        var decimals = await contractToken.decimals();

        console.log('this is Decimals in allocations fun', decimals);

        AllocationAddressAry.forEach((item, index) => {
          console.log('this is item before split', item);
          var item = item.split(',');
          console.log('items in array', item[1]);

          addressAry.push(item[0]);

          var input = item[1]; // Note: this is a string, e.g. user input;
          PriceesAry.push(input);

          // checking formate is wroing or if there is space
          spaceToCheck.push(input);
          console.log('this is input', input);
        });

        addressAry.reverse();
        PriceesAry.reverse();

        // checking and filtering the matching indexes value
        function getAmmount(isTimeToDeleteItem, value) {
          console.log('this is value', value);

          if (isTimeToDeleteItem === true) {
            console.log('this is value inside Loop', value);

            value.forEach((item, index) => {
              valueAry = [];
              sumAmount = new BigNumber('0.0');
              PriceesAry.splice(item, 1);
            });
          }

          console.log('new Price Length', PriceesAry.length);
          console.log('new price arrys', PriceesAry);

          PriceesAry.forEach((item, index) => {
            var input = item;
            try {
              // console.log("this is DEciaml001",decimals)
              var amount = ethers.utils.parseUnits(item.replace('\r', '').toString(), decimals).toString();
              // var amount = (ethers.utils.parseUnits((input).toString(),decimals)).toString();
            } catch (err) {
              console.log('err010', err);
              if (err) {
                var amount = '0';
                input = '0';
              }
            }
            var inputBig = BigNumber(input);
            console.log(inputBig);
            sumAmount = sumAmount.plus(inputBig); // total ammount should be approve
            console.log('this si sumAmount', sumAmount, sumAmount.valueOf());

            valueAry.push(amount);
            console.log('this is amount', amount);
          });
          totalAmmount = 0;
          totalAmmount = sumAmount.valueOf();
          console.log('this is Total Amount', totalAmmount);
        }

        var isTimeToDeleteItem = false;
        var value = '';
        getAmmount(isTimeToDeleteItem, value);

        // console.log('these are spaces',spaceToCheck)

        spaceToCheck.forEach((item, index) => {
          var array = item.split(' ');
          console.log('items that contain space', array);
          if (array.length > 1) {
            isSpaceError = true;
          }
        });

        // keep matching addresses;
        var isAddreseseMatch = containsDuplicates(addressAry);

        if (keepAddress == 'true') {
          localStorage.setItem('keepAddress', 'false');
          isAddreseseMatch = false;
        }

        // detlete the matching address with value
        if (deleteAddresses == 'true') {
          localStorage.setItem('deleteAddress', 'false');
          var { uniqueArray, indexOfDeletedAddreses } = getUnique(addressAry);
          console.log('this is unique Array adress', uniqueArray);
          isAddreseseMatch = false;
          addressAry = uniqueArray;

          var isTimeToDeleteItem = true;
          var value = indexOfDeletedAddreses;
          getAmmount(isTimeToDeleteItem, value);
          console.log('mathinc addreses index', indexOfDeletedAddreses);
        }

        console.log('this is invalid space betten allocation ', isSpaceError);

        console.log('this is value Array, before sending', valueAry);
        return {
          isSpaceError,
          addressAry,
          valueAry,
          totalAmmount,
          isInvalidTokenAddress: false,
          isAddreseseMatch,
          isAllocations: true,
          outOfLimit: '',
        };
      }
    }
  } catch (err) {
    console.log('this is Erro in allocation', err);
    return {
      isSpaceError: false,
      addressAry: '',
      valueAry: '',
      totalAmmount: '',
      isInvalidTokenAddress: true,
      isAddreseseMatch,
      isAllocations: true,
      outOfLimit: '',
    };
  }
};

// checking if address are matching
function containsDuplicates(array) {
  if (array.length !== new Set(array).size) {
    return true;
  }

  return false;
}

// get unique value from address
function getUnique(array) {
  var uniqueArray = [];
  var indexOfDeletedAddreses = [];

  // Loop through array values
  for (var value of array) {
    if (uniqueArray.indexOf(value) === -1) {
      uniqueArray.push(value);
    } else {
      console.log('theese are values', value);
      indexOfDeletedAddreses.push(array.indexOf(value));
    }
  }
  return { uniqueArray, indexOfDeletedAddreses };
}

export default AllocationsFieldsForToken;
