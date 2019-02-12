import React from 'react';
import { Manager, Target, Popper } from 'react-popper';
import { ClickAwayListener, Paper, Grow, withStyles } from '@material-ui/core';

const styles = {
	paper: {
		'& [role=menu]': {
			display: 'flex',
			flexDirection: 'column',
		},
	},
	popper: {
		zIndex: 2,
	},
	popperClose: {
		pointerEvents: 'none',
	},
};

class Dropdown extends React.PureComponent {
	// static propTypes = { // will use TS instead
	// 	open: PropTypes.bool, // for controlled dropdowns
	// 	onClose: PropTypes.func, // for controlled dropdowns
	// 	// pass either input or button, button has precedence:
	// 	input: PropTypes.node, // for autocomplete dropdowns
	// 	button: PropTypes.node, // for dropdown triggered with a button
	// };
	state = {};

	isControlled = () => this.props.open !== undefined;
	isOpen = () => (this.props.open !== undefined ? this.props.open : this.state.open);

	close = e => {
		if (this.inputEl && this.inputEl.contains(e.target)) {
			return; // ignore button interactions
		}
		this.setState({ open: false });
	};

	// only for non-controlled (=non-props-open) dropdowns
	toggle = () => this.setState({ open: !this.state.open });
	open = () => this.setState({ open: true });

	render() {
		const {
			classes,
			component: Component = 'div',
			button = this.props.input,
			children,
			open = this.state.open,
			...props
		} = this.props;
		// Input should have an explicit type to differentiate them, else assume it's a Button
		const refProp = this.props.button ? 'buttonRef' : 'inputRef';
		const Btn = React.cloneElement(button, {
			'aria-haspopup': 'true',
			[refProp]: el => {
				this.inputEl = el;
				if (typeof button.props[refProp] === 'function') {
					button.props[refProp](el);
				}
			},
			...(!this.isControlled() && { onClick: this.open, onFocus: this.open }),
		});
		return (
			<Component {...props}>
				<Manager>
					<Target>{Btn}</Target>
					<Popper
						placement="bottom-start"
						eventsEnabled={open}
						className={`${classes.popper} ${!open ? classes.popperClose : ''}`}
					>
						<ClickAwayListener onClickAway={this.close}>
							<Grow in={open} style={{ transformOrigin: '0 0 0' }}>
								<Paper className={classes.paper}>
									{typeof children === 'function' ? children({ onClose: this.close }) : children}
								</Paper>
							</Grow>
						</ClickAwayListener>
					</Popper>
				</Manager>
			</Component>
		);
	}
}

export default withStyles(styles)(Dropdown);
