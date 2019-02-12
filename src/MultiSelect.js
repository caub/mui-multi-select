import React from 'react';
import { Button, Chip, MenuItem, MenuList, withStyles } from '@material-ui/core';
import Dropdown from './Dropdown';
import { Input, IconButton } from './utils';

const styles = {
	root: {
		listStyle: 'none',
		display: 'flex',
		padding: 0,
		alignItems: 'center',
		flexWrap: 'wrap',
		width: '100%',
		border: '1px solid black',
		borderRadius: 2,
	},
	chip: {
		marginRight: 4,
		height: 25,
		borderRadius: 2,
	},
	menu: {
		overflowY: 'auto',
		maxHeight: 300,
	},
};

/**
 * handle the logic to filter listed items
 * @param items {Array}
 * @param input {String}
 * @param selected {Set}
 * @returns {Array}
 */
const filterItems = (items, input, selected) =>
	items.filter(name => name.toLowerCase().includes(input.toLowerCase()) && !selected.has(name));

class MultiSelect extends React.PureComponent {
	state = {
		inputValue: '',
		inputOpen: false,
		selectedItems: new Set(),
	};

	componentDidMount() {
		document.addEventListener('keydown', this.keyDown);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.keyDown);
	}

	keyDown = e => {
		if (!this.rootEl || !this.rootEl.contains(document.activeElement)) return;

		if (!this.state.inputValue && this.state.selectedItems.size && e.key === 'Backspace') {
			// pop latest select item
			const { selectedItems } = this.state;
			this.setState({
				selectedItems: new Set([...selectedItems].slice(0, -1)),
			});
		}
		const li =
			document.activeElement.tagName === 'li' ? document.activeElement : document.activeElement.closest('li');
		if (!li) return;
		if (e.key === 'Delete' && li.dataset.key) {
			const selectedItems = new Set(this.state.selectedItems);
			selectedItems.delete(li.dataset.key);
			this.setState({ selectedItems });
		}
		if (e.key === 'ArrowLeft' && li.previousElementSibling) {
			li.previousElementSibling.focus();
		}
		if (e.key === 'ArrowRight' && li.nextElementSibling) {
			li.nextElementSibling.focus();
		}
		// if (e.key === 'ArrowDown') TODO focus dropdown items
	};

	render() {
		const { classes, items, inputProps: { placeholder, ...inputProps }, ...rest } = this.props;
		const { inputValue = '', inputOpen, selectedItems } = this.state;
		const filteredItems = filterItems(items, inputValue, selectedItems);

		return (
			<ul
				className={classes.root}
				{...rest}
				ref={el => {
					this.rootEl = el;
				}}
			>
				{[...selectedItems].map(text => (
					<Chip
						component="li"
						role="button"
						tabIndex={0}
						data-key={text}
						label={text}
						key={text}
						onDelete={() => {
							const selectedItems = new Set(this.state.selectedItems);
							selectedItems.delete(text);
							this.setState({ inputValue: '', selectedItems })
						}}
						style={{ marginRight: 4, height: 25, borderRadius: 2 }}
					/>
				))}

				<Dropdown
					component="li"
					style={{ flex: 1 }}
					onClose={() => this.setState({ inputOpen: false })}
					open={inputOpen}
					input={
						<Input
							value={inputValue}
							fullWidth
							placeholder={selectedItems.size ? undefined : placeholder}
							{...inputProps}
							inputRef={el => {
								this.inputEl = el;
							}}
							disableUnderline
							onFocus={() => this.setState({ inputOpen: true })}
							onChange={e => this.setState({ inputValue: e.target.value, inputOpen: true })}
						/>
					}
				>
					<MenuList component="nav" role="menu" className={classes.menu}>
						{filteredItems.map(name => (
							<MenuItem
								key={name}
								component={Button}
								disableGutters
								onClick={() => this.setState({ inputValue: '', selectedItems: new Set(selectedItems).add(name) }, () => this.inputEl && this.inputEl.focus())}
							>
								{name}
							</MenuItem>
						))}
					</MenuList>
				</Dropdown>
				{selectedItems.size || inputValue ? (
					<li>
						<IconButton
							onClick={() => this.setState({ inputValue: '', selectedItems: new Set() })}
						>
							clear
						</IconButton>
					</li>
				) : null}
			</ul>
		);
	}
}

export default withStyles(styles)(MultiSelect);
