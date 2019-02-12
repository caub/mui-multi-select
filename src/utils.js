import React from 'react';
import {
  Icon, Input as MuiInput,
  IconButton as MuiIconButton, MenuList as MuiMenuList,
  withStyles
} from '@material-ui/core';

const inputStyles = {
  input: {
    '&::placeholder': {
      padding: '0 .5rem'
    }
  },
};
export const Input = withStyles(inputStyles)(props => <MuiInput classes={props.classes} fullWidth disableUnderline {...props} />);

const menuListStyles = {
  menu: {
    overflowY: 'auto',
    maxHeight: 300,
  },
};
export const MenuList = withStyles(menuListStyles)(({ classes, ...props }) => (
  <MuiMenuList component="nav" role="menu" className={classes.menu} {...props} />
));

const iconButtonStyles = {
  root: {
    padding: 4,
    width: 'auto',
    height: 'auto'
  },
};
export const IconButton = withStyles(iconButtonStyles)(({ classes, children, ...props }) => (
  <MuiIconButton
    classes={classes}
    children={typeof children === 'string' ? <Icon>{children}</Icon> : children}
    {...props}
  />
));
