import React from 'react';
import { Avatar, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';
import Dropdown from './Dropdown';
import { Input, MenuList } from './utils';

const filterByName = (items, input) =>
	items.filter(({ name }) => name.toLowerCase().includes(input.toLowerCase()));

export default {
	assignee: {
		label: 'Assignee',
		icon: 'person',
		menu: ({ value, setInputEl, setValue, addValue, data, ...props }) => (
			<Dropdown
				component="li"
				input={
					<Input key="input" value={value} inputRef={setInputEl} onChange={e => setValue(e.target.value)} />
				}
				{...props}
			>
				<MenuList>
					{filterByName(data, value).map(item => (
						<MenuItem key={item.name} onClick={() => addValue(item.name, item.id)}>
							<ListItemIcon>
								<Avatar src={item.avatar} />
							</ListItemIcon>
							<ListItemText primary={item.name} />
						</MenuItem>
					))}
				</MenuList>
			</Dropdown>
		),
	},
	isClosed: {
		label: 'Issue Closed',
		icon: 'speaker_notes_off',
		menu: ({ value, setInputEl, setValue, addValue, ...props }) => (
			<Dropdown
				component="li"
				input={
					<Input key="input" value={value} inputRef={setInputEl} onChange={e => setValue(e.target.value)} />
				}
				{...props}
			>
				<MenuList>
					{filterByName([{ name: 'Yes' }, { name: 'No' }], value).map(({ name }) => (
						<MenuItem key={name} onClick={() => addValue(name)}>{name}</MenuItem>
					))}
				</MenuList>
			</Dropdown>
		),
	},
	tag: {
		label: 'Tag',
		icon: 'label',
		multi: true,
		menu: ({ value, setInputEl, setValue, addValue, data, ...props }) => (
			<Dropdown
				component="li"
				input={
					<Input key="input" value={value} inputRef={setInputEl} onChange={e => setValue(e.target.value)} />
				}
				{...props}
			>
				<MenuList>
					{filterByName(data, value).map(item => (
						<MenuItem key={item.name} onClick={() => addValue(item.name, item.id)}>
							<ListItemIcon>
								<span style={{ height: 16, width: 16, background: item.color }} />
							</ListItemIcon>
							<ListItemText primary={item.name} />
						</MenuItem>
					))}
				</MenuList>
			</Dropdown>
		),
	},
};
