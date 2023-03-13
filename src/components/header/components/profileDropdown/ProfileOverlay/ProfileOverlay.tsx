import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import * as S from './ProfileOverlay.styles';
// import { Box } from '@mui/material';
// import { DropdownMenu } from '@app/components/header/Header.styles';

export const ProfileOverlay: React.FC = ({ ...props }) => {
  const { t } = useTranslation();

  return (
    // <DropdownMenu selectable={false} {...props}>
    <>
      {/* <MenuItem key={0}> */}
      {/* <Text> */}
      <Link to="/profile">{t('profile.title')}</Link>
      {/* </Text> */}
      {/* </MenuItem> */}
      {/* <ItemsDivider /> */}
      {/* <MenuItem key={1}> */}
      {/* <Text> */}
      <Link to="/logout">{t('header.logout')}</Link>
      {/* </Text> */}
      {/* </MenuItem> */}
    </>
  );
};
