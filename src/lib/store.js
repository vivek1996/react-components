import React, { createContext, useReducer, useContext } from "react";

function formReducer(state, action) {
  switch (action.type) {
    case "SET_INITIAL_FORM":
      return {
        ...state,
        fields: action.payload.fields,
        values: action.payload.fieldValues,
        errors: action.payload.fieldErrors,
      };
    case "FORM_FIELD_UPDATE":
      return { ...state, fields: action.payload.fields };
    case "FORM_ERROR_UPDATE":
      return { ...state, errors: action.payload.errors };
    case "FORM_DATA_UPDATE":
      return {
        ...state,
        values: { ...state.values, ...action.payload.fieldValues },
        errors: { ...state.errors, ...action.payload.fieldErrors },
      };
    case "FORM_FIELD_VALUE_UPDATE":
      return {
        ...state,
        values: { ...state.values, ...action.payload.fieldValues },
        errors: { ...state.errors, ...action.payload.fieldErrors },
        fields: [...(action.payload.fields || state.fields)],
      };
    default:
      return { ...state, ...action.payload };
  }
}

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [form, formDispatch] = useReducer(formReducer, {
    fields: [],
    values: {},
    errors: {},
  });
  const value = { form, formDispatch };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
