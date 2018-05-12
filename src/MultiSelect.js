import React from 'react';
import {Set} from 'immutable';
import {withStyles} from 'material-ui/styles';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import {MenuItem, MenuList} from 'material-ui/Menu';
import Dropdown from './Dropdown';
import {Input, IconButton} from './utils';

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

class MultiSelect extends React.Component {
	state = {
		inputValue: '',
		selectedItems: Set(),
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
			const {selectedItems} = this.state;
			this.setState({
				selectedItems: selectedItems.delete(
					selectedItems
						.reverse()
						.keys()
						.next().value,
				),
			});
		}
		const li =
			document.activeElement.tagName === 'li' ? document.activeElement : document.activeElement.closest('li');
		if (!li) return;
		if (e.key === 'Delete' && li.dataset.key) {
			const {selectedItems} = this.state;
			this.setState({
				selectedItems: selectedItems.delete(li.dataset.key),
			});
		}
		if (e.key === 'ArrowLeft' && li.previousElementSibling) {
			li.previousElementSibling.focus();
		}
		if (e.key === 'ArrowRight' && li.nextElementSibling) {
			li.nextElementSibling.focus();
		}
	};

	// data: {inputValue: String, selectedItems: Set}
	update(data, shouldFocus) {
		this.setState(data, shouldFocus && this.refocus);
	}

	refocus() {
		if (this.inputEl) {
			this.inputEl.focus();
		}
	}

	render() {
		const {classes, items, inputProps: {placeholder, ...inputProps}, ...rest} = this.props;
		const {inputValue = '', selectedItems} = this.state;
		const filteredItems = filterItems(items, inputValue, selectedItems);
		return (
			<ul
				className={classes.root}
				{...rest}
				ref={el => {
					this.rootEl = el;
				}}
			>
				{selectedItems.map(text => (
					<Chip
						component="li"
						role="button"
						tabIndex={0}
						data-key={text}
						label={text}
						key={text}
						onDelete={() => this.update({inputValue: '', selectedItems: selectedItems.delete(text)})}
						style={{marginRight: 4, height: 25, borderRadius: 2}}
					/>
				))}

				<Dropdown
					component="li"
					style={{flex: 1}}
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
							onChange={e => this.update({inputValue: e.target.value})}
						/>
					}
				>
					<MenuList component="nav" role="menu" className={classes.menu}>
						{filteredItems.map(name => (
							<MenuItem
								key={name}
								component={Button}
								disableGutters
								onClick={() => this.update({inputValue: '', selectedItems: selectedItems.add(name)})}
							>
								{name}
							</MenuItem>
						))}
					</MenuList>
				</Dropdown>
				{selectedItems.size || inputValue ? (
					<li>
						<IconButton
							onClick={e => this.update({inputValue: '', selectedItems: Set()})}
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
