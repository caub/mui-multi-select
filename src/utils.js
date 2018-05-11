import React from 'react';
import {withStyles} from 'material-ui/styles';
import MuiInput from 'material-ui/Input';
import {MenuList as MuiMenuList} from 'material-ui/Menu';

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
export const MenuList = withStyles(menuListStyles)(({classes, ...props}) => (
  <MuiMenuList component="nav" role="menu" className={classes.menu} {...props} />
));
