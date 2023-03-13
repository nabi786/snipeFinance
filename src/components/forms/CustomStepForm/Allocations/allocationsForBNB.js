import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

BigNumber.config({ EXPONENTIAL_AT: [-300, 300] });

var addressAry;
var valueAry;
var totalAmmount;

const AllocationsFields = async (allocatiosn) => {
  // delete matching addresses;
  var deleteAddresses = localStorage.getItem('deleteAddress');
  var keepAddress = localStorage.getItem('keepAddress');

  var spaceToCheck = [];
  var isSpaceError = false;
  var addressAry = [];
  var PriceesAry = [];
  var valueAry = [];
  var totalAmmount = 0.0;
  var sumAmount = new BigNumber('0.0');

  var decimalError = false;
  var isAddreseseMatch = false;
  var addressesMatchedMsg = '';
  var allocatiosn = allocatiosn.trim();
  var AllocationAddressAry = allocatiosn.split('\n');
  console.log('these are allocatiosnLength', AllocationAddressAry.length);

  if (AllocationAddressAry[0] === '' || AllocationAddressAry[0] === 'undefined') {
    // converting value to BIG NUmbers

    return {
      isSpaceError,
      addressAry: '',
      valueAry: '',
      totalAmmount: '',
      isAddreseseMatch,
      isAllocations: false,
      outOfLimit: '',
    };
  } else {
    if (AllocationAddressAry.length > 2000) {
      return {
        isSpaceError,
        addressAry: '',
        valueAry: '',
        totalAmmount: '',
        isAddreseseMatch,
        isAllocations: true,
        outOfLimit: 'MAXIMUM 2000 WALLETS PER BATCH',
      };
    } else {
      AllocationAddressAry.forEach((item, index) => {
        console.log('this is item before split', item);
        var item = item.split(',');

        // console.log("items in array", item);
        console.log('items in array', item[1]);
        addressAry.push(item[0]);
        var input = item[1]; // Note: this is a string, e.g. user input;
        PriceesAry.push(input);

        // checking formate is wroing or if there is space
        spaceToCheck.push(input);
        console.log('this is input', input);

        // totalAmmount += Number(ethers.utils.parseUnits(input, 8));// total ammount should be approve
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
          var inputBig = BigNumber(item);
          console.log(inputBig);
          sumAmount = sumAmount.plus(inputBig); // total ammount should be approve
          console.log('this si sumAmount', sumAmount.toString());

          const amount = ethers.utils.parseEther(item.replace('\r', '').toString()).toString();

          valueAry.push(amount);
        });
        totalAmmount = 0;
        totalAmmount = sumAmount.valueOf();
        console.log('this is Total Amount', totalAmmount);
      }

      var isTimeToDeleteItem = false;
      var value = '';
      getAmmount(isTimeToDeleteItem, value);

      spaceToCheck.forEach((item, index) => {
        var array = item.split(' ');
        console.log('items that contain space', array);
        if (array.length > 1) {
          isSpaceError = true;
        }
      });

      console.log('space detect in values', isSpaceError);

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

      return {
        isSpaceError,
        addressAry,
        valueAry,
        totalAmmount,
        isAddreseseMatch,
        isAllocations: true,
        outOfLimit: '',
      };
    }
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

export default AllocationsFields;
