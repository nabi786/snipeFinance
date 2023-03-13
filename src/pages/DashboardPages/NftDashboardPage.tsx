import React, { useEffect } from 'react';
import { Col, Row } from 'antd';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import { References } from '@app/components/common/References/References';
import { useResponsive } from '@app/hooks/useResponsive';
import { TrendingCreators } from '@app/components/nft-dashboard/trending-creators/TrendingCreators';
import { RecentlyAddedNft } from '@app/components/nft-dashboard/recently-added/RecentlyAddedNft';
import { TrendingCollections } from '@app/components/nft-dashboard/trending-collections/TrendingCollections';
import { Balance } from '@app/components/nft-dashboard/Balance/Balance';
// import { TotalEarning } from '@app/components/nft-dashboard/totalEarning/TotalEarning';
import { ActivityStory } from '@app/components/nft-dashboard/activityStory/ActivityStory';
import { RecentActivity } from '@app/components/nft-dashboard/recentActivity/RecentActivity';
import Services from '@app/components/common/services/servies';
import { useContext } from 'react';
import AppCtx from '@app/components/context/MyContext';
import { checkIfUserAuthorizedToUse } from '@app/utils/hooks/use-MultiSenderContract';

// import {Services} from '@app/'
import * as S from './DashboardPage.styles';

const MedicalDashboardPage: React.FC = () => {
  const { isDesktop } = useResponsive();

  const useContextAPI = useContext(AppCtx);
  useEffect(() => {
    var isUserAuthorized = async () => {
      useContextAPI?.setIsTimeToShowAuth(false);
    };
    setTimeout(() => {
      isUserAuthorized();
    }, 1000);
  }, [useContextAPI?.isWalletConnected == true]);

  const desktopLayout = (
    <Row>
      {/* <S.LeftSideCol xl={16} xxl={17} id="desktop-content"> */}

      <S.LeftSideCol id="desktop-content">
        <Row className="mainContentinBody007">
          <Col style={{ width: '100%' }}>
            <Services></Services>
          </Col>
        </Row>
        <References />
      </S.LeftSideCol>

      {/* <Services>working</Services> */}
      {/* Rigth sideBar of MainContainer */}
      {/* <S.RightSideCol xl={8} xxl={7}> */}
      {/* <div id="balance"> */}
      {/* <Balance /> */}
      {/* </div> */}
      {/* <S.Space /> */}
      {/* <div id="total-earning"> */}
      {/* <TotalEarning /> */}
      {/* </div> */}
      {/* // <S.Space /> */}
      {/* <S.ScrollWrapper id="activity-story">
          {/* <ActivityStory /> */}
      {/* </S.ScrollWrapper>  */}
      {/* </S.RightSideCol> */}
    </Row>
  );

  const mobileAndTabletLayout = <Row gutter={[20, 24]}></Row>;

  return (
    <>
      <PageTitle>NFT Dashboard</PageTitle>
      {isDesktop ? desktopLayout : mobileAndTabletLayout}
    </>
  );
};

export default MedicalDashboardPage;
