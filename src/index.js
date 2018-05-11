import React from 'react';
import {render} from 'react-dom';
import {Map} from 'immutable';
import {orange, lime, purple} from 'material-ui/colors';
import MultiSelect from './MultiSelect';
import MultiSelectGroup from './MultiSelectGroup';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
  margin: '2em auto',
  padding: '1rem',
  maxWidth: 1200
};

// quick rndom char generator
const randChar = (n = 97) => String.fromCharCode(n + Math.floor(5 * Math.random()));

const indexData = data =>
  Object.entries(data).reduce(
    (acc, [k, arr]) => ({
      ...acc,
      [k]: Map(arr.map(o => [o.id, o])), // index by id
      [`${k}ByName`]: Map(arr.map(o => [o.name, o.id])), // add name => id for name lookups
    }),
    {},
  );

const data = indexData({
  assignee: [
    {id: 'a1', name: 'Jim', avatar: 'https://randomuser.me/api/portraits/men/69.jpg'},
    {id: 'a2', name: 'Jack', avatar: 'https://randomuser.me/api/portraits/women/25.jpg'},
    {id: 'a3', name: 'Jason', avatar: 'https://randomuser.me/api/portraits/men/30.jpg'},
  ],
  tag: [
    {id: 't1', name: 'Foo', color: orange[400]},
    {id: 't2', name: 'Bar', color: lime[300]},
    {id: 't3', name: 'Tup', color: purple[600]},
  ]
})

const App = () => (
  <div style={styles}>
    <MultiSelect
      inputProps={{placeholder: 'MultiSelect: pick your items!'}}
      items={Array.from({length: 9}, (_, i) =>
        `${randChar(65)}${randChar()}${randChar()} ${i}`
      )} />
    <MultiSelectGroup
      data={data}
      inputProps={{placeholder: 'MultiSelectGroup: pick your pairs of key-value!'}}
    />
    <MultiSelectGroup
      data={data}
      search="tag=Foo&assignee=Jason"
    />
    <h2 style={{marginTop: '2em'}}>Start editing to see some magic happen {'\u2728'}</h2>
  </div>
);

render(<App />, document.getElementById('root'));
