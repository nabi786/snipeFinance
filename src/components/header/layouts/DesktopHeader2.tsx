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

interface DesktopHeaderProps {
  isTwoColumnsLayout: boolean;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ isTwoColumnsLayout }) => {
  var [tokenPrice, setTokenPrice] = useState(0);
  var [tokenBalance, setTokenBalance] = useState(0);

  useEffect(() => {
    async function getTokenPrice() {
      fetch('https://api.binance.com/api/v3/ticker/price?symbol=CAKEUSDT')
        .then((response) => response.json())
        .then((data) => {
          setTokenPrice(data.price);
        });
    }

    getTokenPrice();

    function getTokenBlance() {
      var tokenBalance = localStorage.getItem('tokenBalance');

      if (tokenBalance) {
        tokenBalance = tokenBalance.replace(/"/g, '');
        setTokenBalance(parseInt(tokenBalance));
      } else {
        setTokenBalance(0);
      }
    }
    setInterval(() => {
      getTokenBlance();
    }, 1000);
  });

  const location = useLocation();
  const leftSide = isTwoColumnsLayout ? (
    // <S.SearchColumn xl={16} xxl={17}>
    //   <Row justify="space-between">
    //     <Col xl={15} xxl={12}>
    // <S.SearchColumn>
    <Row>
      {/* <Col> */}

      {/* <HeaderSearch /> */}

      {/* </Col> */}
    </Row>
  ) : (
    // </S.SearchColumn>
    <>
      <Col lg={10} xxl={8}>
        {/* <HeaderSearch /> */}
      </Col>
      <Col></Col>
    </>
  );

  return (
    // {leftSide}
    // isTwoColumnsLayout ? (
    <>
      <Row className="headerButtonsWrapper">
        <Col>
          <a
            href="https://pancakeswap.finance/swap?outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
            target="_blank"
          >
            <Button sx={{ color: 'white' }} className="buyHeaderTokenBtn buyHeaderTokenBtnBuyBtn">
              Buy
            </Button>
          </a>
        </Col>
        <Col>
          <Button sx={{ color: 'white' }} className="buyHeaderTokenBtn">
            ${tokenPrice}
          </Button>
        </Col>

        <Col>
          <Button sx={{ color: 'white' }} className="buyHeaderTokenBtn">
            ${tokenBalance}
          </Button>
        </Col>

        <Col>
          <ProfileDropdown />
        </Col>
      </Row>
    </>
    // ) : (
    //   <>
    //     <Col lg={10} xxl={8}>
    //       {/* <HeaderSearch /> */}
    //     </Col>
    //     <Col>

    //     </Col>
    //   </>
    // )
  );
};
