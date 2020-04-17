import React from 'react';

// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import fetch from 'cross-fetch';

import logo from './logo.svg';
import './App.css';
import { Form as FormComponent } from 'react-component-stack';

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

// const fields = [
//   {
//     name: 'country1', type: 'autocomplete', label: 'Auto complete with static list', required: true, options: [
//       {
//         key: 'ind',
//         value: 'India'
//       },
//       {
//         key: 'aus',
//         value: 'Australia'
//       },
//       {
//         key: 'uk',
//         value: 'United Kingdom'
//       }
//     ]
//   },
//   {name: 'multitext', type: 'text', label: 'Text', placeholder: 'Text', required: true, multiple: true},
//   {name: 'object', type: 'nested', label: 'Object', placeholder: 'Text', required: true, fields: [
//     {name: 'nested-1', type: 'text', label: 'Nested 1', placeholder: 'Nested 1', required: true},
//     {name: 'nested-2', type: 'text', label: 'Nested 2', placeholder: 'Nested 2', required: true}
//   ]},
//   {name: 'multiobject', type: 'nested', label: 'Array Object', placeholder: 'Text', required: true, multiple: true, fields: [
//     {name: 'nested-1', type: 'text', label: 'Nested 1', placeholder: 'Nested 1', required: true},
//     {name: 'nested-2', type: 'text', label: 'Nested 2', placeholder: 'Nested 2', required: true}
//   ]},
//   {name: 'percentage', type: 'number', label: 'Percentage', placeholder: 'Percentage', required: true, min: -200, max: 100, step: 0.1, suffix: '%'},
//   {name: 'tel', type: 'tel', label: 'Tel', placeholder: 'Tel', required: true},
//   {name: 'hidden', type: 'hidden', label: 'hidden', placeholder: 'hidden', required: true},
//   {name: 'toggle', type: 'toggle', label: 'toggle', placeholder: 'toggle', required: true},
//   {name: 'switch', type: 'switch', label: 'switch', placeholder: 'switch', required: true},
//   {name: 'boolean', type: 'boolean', label: 'boolean', placeholder: 'boolean', required: true},
//   {name: 'multiselect', type: 'multiselect', label: 'multiselect', required: true},

//   {name: 'richtext', type: 'richtext', label: 'richtext', placeholder: 'richtext', required: true}
// ];

const fields = [
  // {name: 'text', type: 'text', label: 'Text', placeholder: 'Text', required: true, minlength: 10, maxlength: 10},
  {
    name: 'country2', type: 'autocomplete', label: 'Autocomplete with dynamic list', required: true, options: (async (brandData) => {
      if (brandData) {
        const response = await fetch('https://country.register.gov.uk/records.json?page-size=5000');
        await sleep(1e3); // For demo purposes.
        const countries = await response.json();
        const formattedResponse = Object.keys(countries).map((key) => countries[key].item[0]);
        const results = formattedResponse.filter((obj) => {
          return Object.keys(obj).reduce((acc, curr) => {
            return acc || obj[curr].toLowerCase().includes(brandData);
          }, false);
        });
        return results;
      }

      return [];
    }), optionKey: 'country', optionValue: 'name'
  },
  // {name: 'date', type: 'date', label: 'Date', placeholder: 'Date', required: true},
  {name: 'number', type: 'number', label: 'Number', placeholder: 'Number', required: true},
  {name: 'range', type: 'range', label: 'range', placeholder: 'range', required: true, min: 0, max: 10},
  {name: 'select', type: 'select', label: 'select', placeholder: 'select', required: true, options: ['India', 'Australia']},
  {name: 'checkbox', type: 'checkbox', label: 'checkbox', placeholder: 'checkbox', required: true, options: [{value: 'chk1', label: 'Checkbox 1'}, {value: 'chk2', label: 'Checkbox 2'}]},
  {name: 'radio', type: 'radio', label: 'radio', placeholder: 'radio', required: true, options: [{value: 'opt1', label: 'Option 1'}, {value: 'opt2', label: 'Option 2'}]}
];

const buttons = [{ type: 'submit', label: 'Create', color: 'secondary' }];

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <FormComponent
        novalidate={true}
        fields={fields}
        buttons={buttons}
        onSubmit={(formData) => {
          console.log('Form onSubmit', formData);
        }}
      />
    </div>
  );
}

export default App;
