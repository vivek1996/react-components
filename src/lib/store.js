import React, { createContext, useReducer, useContext } from 'react';

function formFieldReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_FIELD':
      return {
        ...state,
        initialFields: [...action.payload],
        updatedFields: [...action.payload]
      };
    case 'FORM_FIELD_UPDATE':
      return { ...state, updatedFields: [...action.payload] };
    default:
      return { ...state, ...action.payload };
  }
}

function formDataReducer(state, action) {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return { ...state, ...action.payload };
    case 'FIELD_VALUE_UPDATE':
      return { ...state, ...action.payload };
    case 'FORM_DATA_UPDATE':
      return { ...state, ...action.payload };
    default:
      return { ...state, ...action.payload };
  }
}

function formReducer(state, action) {
  console.log('formReducer', action);
  switch (action.type) {
    case 'SET_INITIAL_FORM':
      return {
        ...state,
        fields: action.payload.fields,
        values: action.payload.fieldValues,
        errors: action.payload.fieldErrors
      };
    case 'FORM_FIELD_UPDATE':
      return { ...state, fields: action.payload.fields };
    case 'FORM_ERROR_UPDATE':
      return { ...state, errors: action.payload.errors };
    case 'FORM_DATA_UPDATE':
      return {
        ...state,
        values: {...state.values, ...action.payload.fieldValues},
        errors: {...state.errors, ...action.payload.fieldErrors}
      };
    case 'FORM_UPDATE':
      return {
        ...state,
        values: {...state.values, ...action.payload.fieldValues},
        errors: {...state.errors, ...action.payload.fieldErrors},
        fields: [...(action.payload.fields || state.fields)]
      };
    default:
      return { ...state, ...action.payload };
  }
}

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [formData, formDataDispatch] = useReducer(formDataReducer, {});
  const [formField, formFieldDispatch] = useReducer(formFieldReducer, {
    initialFields: [],
    updatedFields: []
  });
  const [form, formDispatch] = useReducer(formReducer, {
    fields: [],
    values: {},
    errors: {}
  });
  const value = { formField, formFieldDispatch, formData, formDataDispatch, form, formDispatch };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
