import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Select", () => {
  // {
  //   name: 'select',
  //   type: 'select',
  //   label: 'Country',
  //   placeholder: 'Country',
  //   required: true,
  //   options: ['India', 'Australia']
  // },
  // {
  //   name: 'multiselect',
  //   type: 'select',
  //   label: 'Multiselect',
  //   placeholder: 'Multiselect',
  //   required: true,
  //   options: ['India', 'Australia'],
  //   multiple: true
  // },
  it("snapshot testing", () => {
    const component = shallow(
      <Field name="select" type="select" options={["Select 1", "Select 2"]} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="select" type="select" options={["Select 1", "Select 2"]} />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("select field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field name="select" type="select" options={["Select 1", "Select 2"]} />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
  });

  it("select field with options as function", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="select"
          type="select"
          options={() => ["Select 1", "Select 2"]}
        />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
  });
});
