import React from 'react';
import { ClickAwayListener, Paper, Grow, withStyles } from '@material-ui/core';

const styles = {
	root: {
		position: 'relative',
	},
	open: {
		'& $paper': {
			zIndex: 10
		}
	},
	paper: {
		position: 'absolute',
		top: '100%',
		left: 0,
		'& [role=menu]': {
			display: 'flex',
			flexDirection: 'column',
		},
	}
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

	componentDidMount() {
		document.addEventListener('keydown', this.close);
	}
	componentWillUnmount() {
		document.removeEventListener('keydown', this.close);
	}

	isControlled = () => this.props.open !== undefined;
	isOpen = () => (this.props.open !== undefined ? this.props.open : this.state.open);

	close = e => {
		if (e.type === 'keydown' && e.key !== 'Escape' || e.type !== 'keydown' && this.inputEl && this.inputEl.contains(e.target)) {
			return; // ignore button interactions
		}
		if (typeof this.props.onClose === 'function') {
			return this.props.onClose(e);
		}
		this.setState({ open: false });
	};

	// only for non-controlled (=non-props-open) dropdowns
	toggle = () => this.setState({ open: !this.state.open });
	open = () => this.setState({ open: true });

	render() {
		const {
			className,
			classes,
			component: Component = 'div',
			input,
			button = input,
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
			<Component {...props} className={`${className} ${open ? classes.open : ''}`}>
				<div className={`${classes.root}`}>
					{Btn}
					<ClickAwayListener onClickAway={this.close}>
						<Grow in={open} style={{ transformOrigin: '0 0 0' }}>
							<Paper className={classes.paper}>
								{children}
							</Paper>
						</Grow>
					</ClickAwayListener>
				</div>
			</Component>
		);
	}
}

export default withStyles(styles)(Dropdown);
