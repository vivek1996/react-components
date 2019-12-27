import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Form as FormComponent} from 'react-component-stack';

const fields = [
  {name: 'text', type: 'text', label: 'Text', placeholder: 'Text', required: true},
  {name: 'date', type: 'date', label: 'Date', placeholder: 'Date', required: true},
  {name: 'number', type: 'number', label: 'Number', placeholder: 'Number', required: true},
  {name: 'tel', type: 'tel', label: 'Tel', placeholder: 'Tel', required: true},
  {name: 'checkbox', type: 'checkbox', label: 'checkbox', placeholder: 'checkbox', required: true},
  {name: 'hidden', type: 'hidden', label: 'hidden', placeholder: 'hidden', required: true},
  {name: 'richtext', type: 'richtext', label: 'richtext', placeholder: 'richtext', required: true},
  {name: 'image', type: 'image', label: 'image', placeholder: 'image', required: true},
  {name: 'file', type: 'file', label: 'file', placeholder: 'file', required: true},
  {name: 'toggle', type: 'toggle', label: 'toggle', placeholder: 'toggle', required: true},
  {name: 'switch', type: 'switch', label: 'switch', placeholder: 'switch', required: true},
  {name: 'boolean', type: 'boolean', label: 'boolean', placeholder: 'boolean', required: true},
  {name: 'radio', type: 'radio', label: 'radio', placeholder: 'radio', required: true},
  {name: 'multiselect', type: 'multiselect', label: 'multiselect', required: true},
  {name: 'select', type: 'select', label: 'select', placeholder: 'select', required: true},
  {name: 'range', type: 'range', label: 'range', placeholder: 'range', required: true, min: 0, max: 10},
  {name: 'richtext', type: 'richtext', label: 'richtext'}
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
        />
      </header>
    </div>
  );
}

export default App;
