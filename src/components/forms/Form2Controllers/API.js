import axios from 'axios';
const Url = 'https://good-red-mackerel-shoe.cyclic.app/api';

const generateWallets = async (valueRadio, userAddr, noOfWallets) => {
  if (Number(noOfWallets) > 1000) {
    var wallets = [];
    return wallets;
  }
  // I am checking here if ValueOfRadio Button is equals to 1
  console.log('this is the alue of ReadioButton', valueRadio);
  if (valueRadio === '1' && Number(noOfWallets) <= 1000) {
    var data = {
      address: userAddr,
      amountOfWallets: noOfWallets,
    };
    console.log('this is dataOBjeect', data);
    var wallets = '';
    await axios({
      method: 'post',
      // url: `${Url}/generateWallets`,
      url: `${Url}/TestGenerateWallets`,
      data: data,
    })
      .then(function (response) {
        console.log('this is reponse from API', response);

        wallets = response.data;
        console.log(wallets);
      })
      .catch(function (error) {
        console.log('this is erro while fetching api', error);
        wallets = '';
      });

    console.log('wallets', wallets);
    return wallets;
  }

  if (Number(noOfWallets) <= 1000 && valueRadio != '1') {
    try {
      var data = {
        address: userAddr,
        amountOfWallets: noOfWallets,
      };

      if (Number(noOfWallets) > 500) {
        var wallets = {
          privateKeys: [],
          publickeys: [],
        };

        var dividedAmount = noOfWallets / 2;
        dividedAmount = parseInt(dividedAmount);
        var reminder = noOfWallets % 2;
        console.log('this si deciamls', reminder);
        console.log('this si dividedAmount', dividedAmount);

        console.log('here reminder is big', reminder);
        var data = {
          address: userAddr,
          amountOfWallets: dividedAmount,
        };
        var wallets = {
          publickeys: [],
          privateKeys: [],
        };
        await axios({
          method: 'post',
          url: `${Url}/generateWallets`,
          data: data,
        })
          .then(function (response) {
            console.log('this is reponse from API1stCall', response);

            var respondData = response.data.data.publickeys;
            // console.log('this is responsdData', respondData);
            respondData.forEach((item, index) => {
              wallets.publickeys.push(item);
              wallets.privateKeys.push(response.data.data.privateKeys[index]);
            });
          })
          .catch(function (error) {
            console.log('this is erro while fetching api', error);
            wallets = '';
          });

        // calling same API second Time
        // console.log('here reminder is big', reminder);
        var data = {
          address: userAddr,
          amountOfWallets: dividedAmount + reminder,
        };

        await axios({
          method: 'post',
          url: `${Url}/generateWallets`,
          data: data,
        })
          .then(function (response) {
            console.log('this is reponse from API2ndCall', response);

            var respondData = response.data.data.publickeys;
            console.log('this is responsdData', respondData);
            respondData.forEach((item, index) => {
              wallets.publickeys.push(item);
              wallets.privateKeys.push(response.data.data.privateKeys[index]);
            });

            var data = { success: true, data: wallets };
            wallets = data;
          })
          .catch(function (error) {
            console.log('this is erro while fetching api', error);
            wallets = '';
          });

        console.log('these are wallets', wallets);
        return wallets;
      } else {
        // if wallet's are under 500
        console.log('this is dataOBjeect', data);
        var wallets = '';
        await axios({
          method: 'post',
          url: `${Url}/generateWallets`,
          data: data,
        })
          .then(function (response) {
            console.log('this is reponse from API', response);

            wallets = response.data;
            console.log(wallets);
          })
          .catch(function (error) {
            console.log('this is erro while fetching api', error);
            wallets = '';
          });

        console.log('wallets', wallets);
        return wallets;
      }
    } catch (err) {
      console.log('error while generating wallets API RUN', err);
    }
  }
};

export { generateWallets };
