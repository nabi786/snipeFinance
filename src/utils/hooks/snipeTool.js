

import {ethers} from 'ethers';

const {currentSigner} = require('./instances');

import {getGeneratedFees} from '../APIs/servicesFeeApi'


const generateMultipleWallets = async(numOfWlts)=>{
    try{

        console.log("thi is num of wlts", numOfWlts)
        // console.log("thi is fee", fee)

        var serviceFees = await getGeneratedFees();
        serviceFees = serviceFees.responseDate
        console.log('these are services fees', serviceFees)

        var feeToUse = 0;

        // if(fee == "1"){
        //     feeToUse= serviceFees.payPerUse
        // }else if(fee == "2"){
        //     feeToUse= serviceFees.monthly
        // }else if(fee == "3"){
        //     feeToUse= serviceFees.yearly
        // }else{
        //     feeToUse = "invalid Fee"
        // }


        console.log('this is Fee', feeToUse)


        var wltsAry = []
        for(var x=0; x<numOfWlts; x++){

            let createWallet = ethers.Wallet.createRandom();
            console.log('address:', createWallet.address);
            console.log('mnemonic:', createWallet.mnemonic.phrase);
            console.log('privateKey:', createWallet.privateKey);
            
            var wlt = {
                        "address" : createWallet.address, 
                        "mnemonic" : createWallet.mnemonic.phrase, 
                        "privateKey" : createWallet.privateKey
                    }

            wltsAry.push(wlt)         
        }



        return {success : true, wallts : wltsAry}

    }catch(err){

        console.log('this is an err', err)
        return {success : false}
    }
}







// exporting functions

export{
    generateMultipleWallets
}





