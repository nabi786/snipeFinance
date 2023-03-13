import React from 'react';
// import * as S from './References.styles';
// import { FacebookOutlined, GithubOutlined, LinkedinOutlined, TwitterOutlined } from '@ant-design/icons';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { Box, Typography } from '@mui/material';
import './style.css';
export const References: React.FC = () => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px' }}
      className="footerReferences"
    >
      <Typography>
        Made by{' '}
        <a href="https://altence.com" target="_blank" rel="noreferrer">
          Altence{' '}
        </a>
        in 2022 &copy;. Based on{' '}
        <a href="https://ant.design/" target="_blank" rel="noreferrer">
          Ant-design.
        </a>
      </Typography>
      <Box>
        <a href="https://twitter.com/altence_team" target="_blank" rel="noreferrer">
          <TwitterIcon sx={{ width: '35px', height: '35px' }} />
        </a>

        <a href="https://linkedin.com/company/altence" target="_blank" rel="noreferrer" style={{ margin: '0px 10px' }}>
          <LinkedInIcon sx={{ width: '35px', height: '35px' }} />
        </a>
        <a href="https://linkedin.com/company/altence" target="_blank" rel="noreferrer">
          <TelegramIcon sx={{ width: '35px', height: '35px' }} />
        </a>
      </Box>
    </Box>
  );
};
