

var originuUrl = 'https://good-red-mackerel-shoe.cyclic.app/api'
import axios from 'axios';
import {ethers} from 'ethers';


const getGeneratedFees = async()=>{
    try{

        console.log('this is origin URL', originuUrl)

        var responseDate = ""
        await axios({
            method: 'GET',
            url: `${originuUrl}/getGeneratedWalletFee`,
            }).then(function (response) {

                responseDate = response.data
                
                
            }).catch(function (error) {
                console.log("this is erro while fetching api", error)
            });
            

            
            responseDate = responseDate.generatedFee
            console.log('this is response SerViceFee API', responseDate);
            
        return {responseDate : responseDate, success : true}

    }catch(err){
        console.log('this is error while fatching data from API', err)
        return {responseDate : "", success : false}
    }
}



















// export API

export {
    getGeneratedFees
}