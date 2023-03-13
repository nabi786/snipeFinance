import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { RightOutlined,MenuOutlined } from '@ant-design/icons';
import { useResponsive } from 'hooks/useResponsive';

import logo from 'assets/logo.png';
import logoDark from 'assets/logo-dark.png';

import { useAppSelector } from '@app/hooks/reduxHooks';

interface SiderLogoProps {
  isSiderCollapsed: boolean;
  toggleSider: () => void;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ isSiderCollapsed, toggleSider }) => {
  const { tabletOnly,isDesktop,isBigScreen } = useResponsive();

  const theme = useAppSelector((state) => state.theme.theme);

  const img = theme === 'dark' ? logoDark : logo;

  return (

    <S.SiderLogoDiv style={{position:"relative"}}>
      <S.SiderLogoLink to="/">
        
          <img src={img} alt="Lightence" width={48} height={48} />
      
        <S.BrandSpan style={{fontSize:"14px"}}>SnipeFinance.com</S.BrandSpan>
      </S.SiderLogoLink>
      
      {/* {(tabletOnly || isDesktop || isBigScreen) && ( */}
        <S.CollapseButton
          shape="circle"
          size="small"
          $isCollapsed={isSiderCollapsed}
          icon={<MenuOutlined rotate={isSiderCollapsed ? 0 : 180} />}
          onClick={toggleSider}
        />
      {/* )} */}
    </S.SiderLogoDiv>
  );
};
