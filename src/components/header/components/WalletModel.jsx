import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  background:"#1e2142"
};

export default function walletModel({open,handleClose}) {
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modalss</Button> */}
      <Button>Open modalss</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{backgroundColor:"#1e2142"}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal walletModel
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}





// import React, { useState } from 'react';

// import {Typography, Box, Button} from '@mui/material'

// import metaMaskImg from 'assets/metamask-icon.png'
// import coinBaseImg from 'assets/coinbase-logo.png'
// import walletConnect from 'assets/walletConnect.png'

// import AddIcon from '@mui/icons-material/Add';
// import { useSSR } from 'react-i18next';




// function ConnetWalletModel(){
        
//     const [isOpen, setOpen ] = useState('block');


//     const connetMetaMask = async ()=>{

//         const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
//         const account = accounts[0];
//         console.log(account)
//         setOpen('none')
//     }


//     return(

//         <>
//             
        
//         </>

//     )
// }



// export default ConnetWalletModel;