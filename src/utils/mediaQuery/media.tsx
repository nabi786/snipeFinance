
import * as React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';



export function tabletMediaQuerry() {
  const matches = useMediaQuery('(min-width:767px)');

  return <span>{`(min-width:767px) matches: ${matches}`}</span>;
}



export function mediumMeidQuery() {
  const matches = useMediaQuery('(min-width:500px)');

  return <span>{`(min-width:500px) matches: ${matches}`}</span>;
}



export function mobileMediaQuery() {
  const matches = useMediaQuery('(min-width:370px)');

  return <span>{`(min-width:370px) matches: ${matches}`}</span>;
}