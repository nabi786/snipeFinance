import React from 'react';
import { Col, Row } from 'antd';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import { HeaderFullscreen } from '../components/HeaderFullscreen/HeaderFullscreen';
import AddIcon from '@mui/icons-material/Add';
import ConnetWalletModel from '../components/WalletModel';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import * as S from '../Header.styles';
import { useResponsive } from '@app/hooks/useResponsive';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';

// import React from 'react';
// import { Col, Row } from 'antd';
// import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
// import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
// import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
// import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
// import * as S from '../Header.styles';
// import Button from '@mui/material/Button';
// import ConnetWalletModel from '../components/WalletModel'

interface DesktopHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
  isTwoColumnsLayout: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ toggleSider, isSiderOpened }) => {
  const useContextAPI = useContext(AppCtx);
  const { isTablet } = useResponsive();

  var [tokenPrice, setTokenPrice] = useState();
  var [tokenBalance, setTokenBalance] = useState('0');

  useEffect(() => {
    async function getTokenPrice() {
      fetch('https://api.binance.com/api/v3/ticker/price?symbol=CAKEUSDT')
        .then((response) => response.json())
        .then((data) => {
          setTokenPrice(data.price);
        });
    }

    function getTokenBlance() {
      var tokenBalance = localStorage.getItem('tokenBalance');
      if (tokenBalance != null) {
        tokenBalance = tokenBalance.replace(/"/g, '');
        // var intTOkBlc = parseInt(tokenBalance)
        setTokenBalance(tokenBalance);
      } else {
        setTokenBalance('0');
      }
    }

    getTokenBlance();
    getTokenPrice();
  });

  const location = useLocation();
  // const leftSide = isTwoColumnsLayout ? (
  //   // <S.SearchColumn xl={16} xxl={17}>
  //   //   <Row justify="space-between">
  //   //     <Col xl={15} xxl={12}>
  //   // <S.SearchColumn>
  //     <Row>
  //       {/* <Col> */}

  //         {/* <HeaderSearch /> */}

  //       {/* </Col> */}

  //     </Row>
  //   // </S.SearchColumn>
  // ) : (
  //   <>
  //     <Col lg={10} xxl={8}>
  //       {/* <HeaderSearch /> */}
  //     </Col>
  //     <Col>

  //     </Col>
  //   </>
  // );

  // console.log('this is Use ContextApi', );

  return isTablet ? (
    <>
      <div className="headerButtonsWrapperContainer">
        <Row className="headerButtonsWrapper">
          {useContextAPI?.isWalletConnected ? (
            <>
              {useContextAPI?.isTimeToShowAuth ? (
                <>
                  {useContextAPI?.isAuthorizedUser ? (
                    <>
                      <Col style={{ marginRight: 'auto', marginLeft: '30px' }}>Authorized</Col>
                    </>
                  ) : (
                    <>
                      <Col style={{ marginRight: 'auto', marginLeft: '30px' }} title="You can be authorized if...">
                        UnAuthorized
                      </Col>
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
            </>
          ) : (
            <></>
          )}

          <Col className="headerButtonsCol">
            <a
              href="https://pancakeswap.finance/swap?outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
              target="_blank"
            >
              <Button sx={{ color: 'white' }} className="buyHeaderTokenBtn buyHeaderTokenBtnBuyBtn headerConnetEthBtn">
                Buy
              </Button>
            </a>
          </Col>

          <Col className="headerButtonsCol">
            <Button
              sx={{ color: 'white', fontFamily: 'Montserrat,sans-serif' }}
              className="buyHeaderTokenBtn headerConnetEthBtn"
            >
              ${tokenPrice} CAKE
            </Button>
          </Col>

          <Col className="headerButtonsCol">
            <Button
              sx={{ color: 'white', fontFamily: 'Montserrat,sans-serif' }}
              className="buyHeaderTokenBtn headerConnetEthBtn"
            >
              ${tokenBalance} CAKE
            </Button>
          </Col>

          <Col className="headerButtonsCol">
            <ProfileDropdown />
          </Col>
        </Row>
      </div>
    </>
  ) : (
    <>
      <Row justify="space-between" align="middle" className="headerRow1">
        <S.BurgerCol>
          <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
        </S.BurgerCol>

        <Col>
          <Row align="middle">
            <Col style={{ marginRight: '20px' }}>
              <a
                href="https://pancakeswap.finance/swap?outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
                target="_blank"
              >
                <Button
                  sx={{
                    color: 'white',
                    backgroundColor: '#282e6a',
                    padding: '7px 20px',
                    borderRadius: '12px',
                    fontFamily: 'Montserrat,sans-serif',
                    fontSize: '12px',
                  }}
                >
                  Buy
                </Button>
              </a>
            </Col>

            <Col>
              <ProfileDropdown />
            </Col>
          </Row>
        </Col>
      </Row>
      {/* <Row justify="space-between" align="middle" className='headerRow2'>
      <Col>
            <Button sx={{ color: "white", fontFamily: "Montserrat,sans-serif" }} className="buyHeaderTokenBtn2">
              ${tokenPrice} CAKE 
            </Button> 
      </Col>

      <Col> 
            <Button sx={{ color: "white", fontFamily: "Montserrat,sans-serif" }} className="buyHeaderTokenBtn2">
              ${tokenBalance} CAKE 
            </Button>  
      </Col>
    </Row> */}
    </>
  );

  // return (
  //   // {leftSide}
  //   // isTwoColumnsLayout ? (
  //   <>
  //     <Row className='headerButtonsWrapper'>
  //       <Col>
  //           <Link to='/apps/feed'>
  //                 <Button sx={{color : "white",}} className="buyHeaderTokenBtn buyHeaderTokenBtnBuyBtn">
  //                           Buy
  //                 </Button>
  //           </Link>

  //         </Col>
  //         <Col>

  //           <Button sx={{color : "white"}} className="buyHeaderTokenBtn">
  //                       $ETH {tokenPrice}
  //           </Button>

  //         </Col>

  //         <Col>
  //           <Button sx={{color : "white"}} className="buyHeaderTokenBtn">
  //                   $ETH 340.51
  //           </Button>
  //         </Col>

  //         <Col>
  //             <ProfileDropdown />
  //         </Col>
  //     </Row>
  //   </>
  //   // ) : (
  //   //   <>
  //   //     <Col lg={10} xxl={8}>
  //   //       {/* <HeaderSearch /> */}
  //   //     </Col>
  //   //     <Col>

  //   //     </Col>
  //   //   </>
  //   // )

  // );
};

// import React from 'react';
// import { Col, Row } from 'antd';
// import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
// import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
// import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
// import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
// import { HeaderFullscreen } from '../components/HeaderFullscreen/HeaderFullscreen';
// import AddIcon from '@mui/icons-material/Add';
// import ConnetWalletModel from '../components/WalletModel'
// import { Link, useLocation } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import Button from '@mui/material/Button';

// import * as S from '../Header.styles';

// interface DesktopHeaderProps {
//   isTwoColumnsLayout: boolean;
// }

// export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ isTwoColumnsLayout }) => {

//   const location = useLocation();
//   const leftSide = isTwoColumnsLayout ? (
//     // <S.SearchColumn xl={16} xxl={17}>
//     //   <Row justify="space-between">
//     //     <Col xl={15} xxl={12}>
//     // <S.SearchColumn>
//       <Row>
//         {/* <Col> */}

//           {/* <HeaderSearch /> */}

//         {/* </Col> */}

//       </Row>
//     // </S.SearchColumn>
//   ) : (
//     <>
//       <Col lg={10} xxl={8}>
//         {/* <HeaderSearch /> */}
//       </Col>
//       <Col>

//       </Col>
//     </>
//   );

//   return (
//     // {leftSide}
//     // isTwoColumnsLayout ? (
//     <>
//       <Row className='headerButtonsWrapper'>
//         <Col>
//             <Link to='/apps/feed'>
//                   <Button sx={{color : "white",}} className="buyHeaderTokenBtn buyHeaderTokenBtnBuyBtn">
//                             Buy
//                   </Button>
//             </Link>

//           </Col>
//           <Col>

//             <Button sx={{color : "white"}} className="buyHeaderTokenBtn">
//                         $ETH {tokenPrice}
//             </Button>

//           </Col>

//           <Col>
//             <Button sx={{color : "white"}} className="buyHeaderTokenBtn">
//                     $ETH 340.51
//             </Button>
//           </Col>

//           <Col>
//               <ProfileDropdown />
//           </Col>
//       </Row>
//     </>
//     // ) : (
//     //   <>
//     //     <Col lg={10} xxl={8}>
//     //       {/* <HeaderSearch /> */}
//     //     </Col>
//     //     <Col>

//     //     </Col>
//     //   </>
//     // )

//   );
// };
