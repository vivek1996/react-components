import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Form as FormComponent} from './components';

const fields = [
  {name: 'text', type: 'text', label: 'Text', placeholder: 'Text', required: true},
  {name: 'multitext', type: 'text', label: 'Text', placeholder: 'Text', required: true, multiple: true},
  {name: 'object', type: 'nested', label: 'Object', placeholder: 'Text', required: true, fields: [
    {name: 'nested-1', type: 'text', label: 'Nested 1', placeholder: 'Nested 1', required: true},
    {name: 'nested-2', type: 'text', label: 'Nested 2', placeholder: 'Nested 2', required: true}
  ]},
  {name: 'multiobject', type: 'nested', label: 'Array Object', placeholder: 'Text', required: true, multiple: true, fields: [
    {name: 'nested-1', type: 'text', label: 'Nested 1', placeholder: 'Nested 1', required: true},
    {name: 'nested-2', type: 'text', label: 'Nested 2', placeholder: 'Nested 2', required: true}
  ]},
  {name: 'date', type: 'date', label: 'Date', placeholder: 'Date', required: true},
  {name: 'number', type: 'number', label: 'Number', placeholder: 'Number', required: true},
  {name: 'percentage', type: 'number', label: 'Percentage', placeholder: 'Percentage', required: true, min: -200, max: 100, step: 0.1, suffix: '%'},
  {name: 'tel', type: 'tel', label: 'Tel', placeholder: 'Tel', required: true},
  {name: 'checkbox', type: 'checkbox', label: 'checkbox', placeholder: 'checkbox', required: true, options: [{value: 'chk1', label: 'Checkbox 1'}, {value: 'chk2', label: 'Checkbox 2'}]},
  {name: 'hidden', type: 'hidden', label: 'hidden', placeholder: 'hidden', required: true},
  {name: 'file', type: 'file', label: 'file', placeholder: 'file', required: true},
  {name: 'toggle', type: 'toggle', label: 'toggle', placeholder: 'toggle', required: true},
  {name: 'switch', type: 'switch', label: 'switch', placeholder: 'switch', required: true},
  {name: 'boolean', type: 'boolean', label: 'boolean', placeholder: 'boolean', required: true},
  {name: 'radio', type: 'radio', label: 'radio', placeholder: 'radio', required: true, options: [{value: 'opt1', label: 'Option 1'}, {value: 'opt2', label: 'Option 2'}]},
  {name: 'multiselect', type: 'multiselect', label: 'multiselect', required: true},
  {name: 'select', type: 'select', label: 'select', placeholder: 'select', required: true},
  {name: 'range', type: 'range', label: 'range', placeholder: 'range', required: true, min: 0, max: 10},
  {name: 'richtext', type: 'richtext', label: 'richtext', placeholder: 'richtext', required: true}
];

const buttons = [{ type: 'submit', label: 'Create', color: 'secondary' }];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <FormComponent
          novalidate={true}
          fields={fields}
          buttons={buttons}
          onSubmit={(formData) => {
            console.log('Form onSubmit', formData);
          }}
        />
      </header>
    </div>
  );
}

export default App;
