import React from 'react';
import {withStyles} from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import {ListItemIcon, ListItemText} from 'material-ui/List';
import {MenuItem} from 'material-ui/Menu';
import Icon from 'material-ui/Icon';
import Dropdown from './Dropdown';
import {Input, MenuList, IconButton} from './utils';
import ITEMS from './items';

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
	item: {
		display: 'inline-flex',
		marginRight: 4,
		'& > div': {
			borderRadius: 1,
			height: 28,
		},
		'& > div:first-child': {
			background: 'rgba(200,200,200,.3)',
		},
		'& > div + div': {
			marginLeft: 1,
			background: 'rgba(200,200,200,.7)',
		},
	},
	search: {
		borderBottom: '2px solid rgba(200,200,200,.5)'
	}
};

/**
 * handle the logic to filter items keys (Regulator, Applicant ..)
 * @param keys {Array of keys}
 * @param input {String}
 * @param selected {Set}
 * @returns {Array}
 */
const filterKeys = (keys, input, selected) =>
	keys.filter(key => key.toLowerCase().includes(input.toLowerCase()) && !selected.has(key));


class MultiSelectGroup extends React.Component {
	// static propTypes = { // will use TS instead
	// 	data: PropTypes.object.isRequired,
	// 	search: PropTypes.string,
	// };
	state = {
		inputValue: '',
		inputKey: '',
		inputColon: false, // boolean separator between key and value (':')
		selectedItems: typeof this.props.search === 'string' ?
			[...new URLSearchParams(this.props.search)].map(([k, v]) => {
				const item = this.props.data[k] && this.props.data[k].find(o => o.name === v);
				return [k, v, item ? item.id : undefined];
			}) :
			[], // ArrayOf([key: String, value: String, id?: String]) // optional id for an existing item in data (todo clean that)
	};

	componentDidMount() {
		document.addEventListener('keydown', this.keyDown);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.keyDown);
	}

	// ref callback passed to either input key and input value, only one of them exist at a time
	setInputEl = el => {
		if (el) {
			this.inputEl = el;
		}
	};

	refocus() {
		if (this.inputEl) {
			this.inputEl.focus();
			this.inputEl.selectionStart = this.inputEl.value.length;
		}
	}

	// data: {inputKey: String, inputColon: Boolean, inputValue: String, selectedItems: Array}
	update = (data, shouldFocus) => {
		this.setState(data, shouldFocus && this.refocus);
	};

	keyDown = e => {
		if (!this.rootEl || !this.rootEl.contains(document.activeElement)) return;
		// todo: if we press : or tab during fieldSelection, move to value, same for value -> fields
		if (e.key === 'Backspace') {
			// pop latest select item
			const {selectedItems, inputColon, inputKey, inputValue} = this.state;
			if ((!inputColon && inputKey) || (inputColon && inputValue)) return;

			const lastItem = selectedItems[selectedItems.length - 1];
			if (!lastItem) {
				return;
			}
			if (inputColon) {
				this.update(
					{
						inputKey: '',
						inputColon: false,
						inputValue: '',
						selectedItems: selectedItems.slice(0, -1),
					},
					true,
				);
			} else {
				this.update(
					{
						inputColon: true,
						inputKey: lastItem[0],
						inputValue: '',
						selectedItems: [...selectedItems.slice(0, -1), [lastItem[0]]],
					},
					true,
				);
			}
		}
		const li =
			document.activeElement.tagName === 'li' ? document.activeElement : document.activeElement.closest('li');
		if (!li) return;
		if (e.key === 'Delete' && li.dataset.key) {
			const {selectedItems} = this.state;
			const i = +li.dataset.key;
			this.setState({
				selectedItems: [...selectedItems.slice(0, i), ...selectedItems.slice(i + 1)],
			});
		}
		if (e.key === 'ArrowLeft' && li.previousElementSibling) {
			li.previousElementSibling.focus();
		}
		if (e.key === 'ArrowRight' && li.nextElementSibling) {
			li.nextElementSibling.focus();
		}
		// todo handle keydown/up like gitlab issues
	};

	renderInput() {
		const {inputValue, inputColon, inputKey, selectedItems} = this.state;

		if (inputColon && ITEMS[inputKey] !== undefined) {
			const {menu: MenuComp} = ITEMS[inputKey];
			return (
				<MenuComp
					data={this.props.data[inputKey] && this.props.data[inputKey].valueSeq()}
					value={inputValue}
					style={{flex: 1}}
					setInputEl={this.setInputEl}
					setValue={v => this.update({inputValue: v})}
					addValue={(name, id) =>
						this.update({
							inputColon: false,
							inputKey: '',
							inputValue: '',
							selectedItems: [...selectedItems.slice(0, -1), [inputKey, name, id]],
						})
					}
				/>
			);
		}

		const filteredKeys = filterKeys(
			Object.keys(ITEMS),
			inputKey,
			new Set(selectedItems.filter(([key]) => !ITEMS[key].multi).map(([key]) => key)),
		);

		return (
			<Dropdown
				component="li"
				style={{flex: 1}}
				input={
					<Input
						key="input"
						value={inputKey}
						inputRef={this.setInputEl}
						onChange={e => this.update({inputKey: e.target.value})}
						inputProps={{...this.props.inputProps, ...selectedItems.length ? {placeholder: undefined} : undefined}}
					/>
				}
			>
				<MenuList>
					<MenuItem className={this.props.classes.search} onClick={console.log}>
						<ListItemIcon>
							<Icon style={{marginRight: 0}}>search</Icon>
						</ListItemIcon>
						<ListItemText inset primary="Press enter or click to search" />
					</MenuItem>
					{filteredKeys.map(key => ({...ITEMS[key], key})).map(({key, label, icon}) => (
						<MenuItem
							key={key}
							onClick={() =>
								this.update(
									{inputKey: key, inputColon: true, selectedItems: [...selectedItems, [key]]},
									true,
								)
							}
						>
							<ListItemIcon>
								<Icon style={{marginRight: 0}}>{icon}</Icon>
							</ListItemIcon>
							<ListItemText inset primary={label} />
						</MenuItem>
					))}
				</MenuList>
			</Dropdown>
		);
	}

	render() {
		const {classes, theme, inputProps, ...rest} = this.props;
		const {inputValue = '', selectedItems} = this.state;

		return (
			<ul
				className={classes.root}
				{...rest}
				ref={el => {
					this.rootEl = el;
				}}
			>
				{selectedItems.map(([key, name, id], i) => {
					const item = ITEMS[key];
					if (!item) return null; // normally it never happens, if no typos

					const {avatar, color} = id && this.props.data[key].get(id) || {};
					return (
						item && (
							<li key={i} role="button" tabIndex={0} data-key={i} className={classes.item} onClick={e => e.currentTarget.focus()}>
								<Chip label={item.label} />
								{name && (
									<Chip
										avatar={avatar && <Avatar src={avatar} />}
										label={name}
										style={color && {background: color, color: theme.palette.getContrastText(color)}}
										onDelete={() =>
											this.update({
												selectedItems: [...selectedItems.slice(0, i), ...selectedItems.slice(i + 1)],
											})
										}
										onClick={() => console.log('todo edit')}
									/>
								)}
							</li>
						)
					);
				})}
				{this.renderInput()}
				{selectedItems.length || inputValue ? (
					<li>
						<IconButton
							onClick={e =>
								this.update({inputValue: '', inputKey: '', inputColon: false, selectedItems: []})
							}
						>
							clear
						</IconButton>
					</li>
				) : null}
			</ul>
		);
	}
}

export default withStyles(styles, {withTheme: true})(MultiSelectGroup);
