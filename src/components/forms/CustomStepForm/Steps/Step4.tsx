import * as S from '../StepForm.styles';
import { useState,useEffect } from 'react';

interface Field {
  name?: string;
  value: string;
}

interface Step4Props {
  formValues: Field[];
  sendBNBandTokenConfirmData:any
  successTransaction:any;
  successTransactionLink:any;
  errors:any;
  feesData:any;
}

export const Step4: React.FC<Step4Props> = ({formValues,sendBNBandTokenConfirmData, successTransaction,successTransactionLink,errors,feesData}) => {


  // const [BlockError , setBlockErr]= useState("");

  console.log("inside ste4 sendBNBConfirmData", sendBNBandTokenConfirmData);

  console.log('success transaction data on step4', successTransaction)
  console.log('success transaction data on step4', feesData)

// useEffect(() => {

//      if(errors.success == false){
//     console.log('not Enough Balance Error',errors)
//     // setBlockErr("Not Enough Balance")
//   }

// },[])
  

  return (
    <S.Details>
      {(() => {
        
  
          
          if(sendBNBandTokenConfirmData){
              return (
                  sendBNBandTokenConfirmData.map((item: Field, index: number) => {
                         return (
                            <S.DetailsRow key={index}>
                              <S.DetailsTitle key={index+1}>{item.name}</S.DetailsTitle>
                              <S.DetailsValue key={index+2}>{item.value}</S.DetailsValue>
                            </S.DetailsRow>
                        );
                      })  
                )    
          }
          
      })()}

    {(() => {
            
      
              console.log('above second if condition')
            if(feesData.length > 0){
                return (
                  feesData.map((item: Field, index: number) => {
                          return (
                              <S.DetailsRow key={index}>
                                <S.DetailsTitle key={index+1}>{item.name}</S.DetailsTitle>
                                <S.DetailsValue key={index+2}>{item.value}</S.DetailsValue>
                              </S.DetailsRow>
                          );
                        })  
                  )    
            }
            
        })()}

    <p style={{textAlign : "center", color : "red"}}>{errors?.error?.data ? errors?.error?.data?.message : ""}</p>
    <p style={{textAlign : "center", color : "red"}}>{errors?.error? errors?.error: ""}</p>

    <p style={{textAlign : "center", color : "white"}}>
        {
          successTransaction?
          <>  
              SNIPE sent successfully your bulk transaction<br/>
              <a href={successTransactionLink} target="_blank">
              {successTransaction.hash}
              </a>
          </>
          :
          <>
          </>
        }
        
      
      </p>
{/* <p style={{textAlign : "center"}}>{BlockError}</p> */}
      
      {/* <p style={{textAlign : "center"}}>{BlockError}</p> */}
     

    

    </S.Details>
  );
};
