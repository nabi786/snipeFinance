import React from 'react';
import { Col, Row } from 'antd';
import { NotificationsDropdown } from '../components/notificationsDropdown/NotificationsDropdown';
import { ProfileDropdown } from '../components/profileDropdown/ProfileDropdown/ProfileDropdown';
import { HeaderSearch } from '../components/HeaderSearch/HeaderSearch';
import { SettingsDropdown } from '../components/settingsDropdown/SettingsDropdown';
import * as S from '../Header.styles';
import Button from '@mui/material/Button';
import ConnetWalletModel from '../components/WalletModel'


interface MobileHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ toggleSider, isSiderOpened }) => {
  return (
    <Row justify="space-between" align="middle">
      <Col>
        {/* <ProfileDropdown /> */}
      </Col>

      <Col>
        <Row align="middle">
          <Col>
            {/* <NotificationsDropdown /> */}
            <a href="https://pancakeswap.finance/swap?outputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" target="_blank">
                  <Button sx={{color : "white",}} className="buyHeaderTokenBtn buyHeaderTokenBtnBuyBtn">
                            Buy
                  </Button>  
            </a> 
          </Col>

          <Col>
            {/* <HeaderSearch /> */}
          </Col>

          <Col>
            <ProfileDropdown />
            {/* <ConnetWalletModel /> */}
          </Col>
        </Row>
      </Col>

      <S.BurgerCol>
        <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
      </S.BurgerCol>
    </Row>
  );
};
