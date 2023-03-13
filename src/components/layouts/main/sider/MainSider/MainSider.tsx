import React, { useEffect, useMemo, useState } from 'react';
import Overlay from '../../../../common/Overlay';
import { useResponsive } from 'hooks/useResponsive';
import * as S from './MainSider.styles';
import { SiderLogo } from '../SiderLogo';
import SiderMenu from '../SiderMenu/SiderMenu';
import { Col, Row } from 'antd';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
interface MainSiderProps {
  isCollapsed: boolean;
  setCollapsed: (isCollapsed: boolean) => void;
}

const MainSider: React.FC<MainSiderProps> = ({ isCollapsed, setCollapsed, ...props }) => {
  const { isDesktop, isBigScreen, mobileOnly, tabletOnly } = useResponsive();
  const useContextAPI = useContext(AppCtx);

  // const isCollapsible = useMemo(() => mobileOnly && tabletOnly, [mobileOnly, tabletOnly]);
  const isCollapsible = useMemo(() => mobileOnly && tabletOnly && isDesktop, [mobileOnly, tabletOnly, isDesktop]);

  const toggleSider = () => setCollapsed(!isCollapsed);

  var [tokenPrice, setTokenPrice] = useState('1920');
  var [tokenBalace, setTokenBalance] = useState('0');

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
      if (tokenBalance != null) {
        tokenBalance = tokenBalance.replace(/"/g, '');
        // var intTOkBlc = parseInt(tokenBalance)
        setTokenBalance(tokenBalance);
      } else {
        setTokenBalance('0');
      }
    }
    getTokenBlance();
  });

  return (
    <>
      <S.Sider
        trigger={null}
        // collapsed={!isDesktop && isCollapsed}
        collapsed={isCollapsed}
        // collapsed={!isDesktop && isCollapsed}
        collapsedWidth={tabletOnly || isDesktop ? 90 : 0}
        // collapsedWidth={tabletOnly ? 80 : 0}
        collapsible={isCollapsible}
        width={260}
        {...props}
      >
        <SiderLogo isSiderCollapsed={isCollapsed} toggleSider={toggleSider} />

        {mobileOnly && (
          <>
            <div>
              <Row justify="space-between" align="middle" className="headerRow2" style={{ paddingLeft: '24px' }}>
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
                            <Col style={{ marginRight: 'auto', marginLeft: '30px' }}>UnAuthorized</Col>
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
                <Col>
                  <Button sx={{ color: 'white', fontFamily: 'Montserrat,sans-serif' }} className="buyHeaderTokenBtn2">
                    ${tokenPrice} CAKE
                  </Button>
                </Col>

                <Col>
                  <Button sx={{ color: 'white', fontFamily: 'Montserrat,sans-serif' }} className="buyHeaderTokenBtn2">
                    ${tokenBalace} CAKE
                  </Button>
                </Col>
              </Row>
            </div>
          </>
        )}

        <S.SiderContent>
          <SiderMenu setCollapsed={setCollapsed} />
        </S.SiderContent>
      </S.Sider>
      {mobileOnly && <Overlay onClick={toggleSider} show={!isCollapsed} />}
    </>
  );
};

export default MainSider;

{
  /* <S.Sider
trigger={null}
collapsed={!isDesktop && isCollapsed}
// collapsed={!isDesktop && isCollapsed}
collapsedWidth={ tabletOnly || isDesktop ? 80 : 0}
// collapsedWidth={tabletOnly ? 80 : 0}
collapsible={isCollapsible}
width={260}
{...props}>
<SiderLogo isSiderCollapsed={isCollapsed} toggleSider={toggleSider} /> */
}
