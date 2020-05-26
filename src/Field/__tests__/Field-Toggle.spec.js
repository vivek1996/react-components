import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Toggle", () => {
  // {name: 'toggle', type: 'toggle', label: 'toggle', placeholder: 'toggle', required: true, options: [{value: 'toggle1', label: 'toggle 1'}, {value: 'toggle2', label: 'toggle 2'}, {value: 'toggle3', label: 'toggle 3'}]},
  it("snapshot testing", () => {
    const component = shallow(
      <Field name="toggle" type="toggle" options={["Toggle 1", "Toggle 2"]} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="toggle" type="toggle" options={["Toggle 1", "Toggle 2"]} />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("toggle field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field name="toggle" type="toggle" options={["Toggle 1", "Toggle 2"]} />
      </StoreProvider>
    );
    expect(wrapper.find("p").length).toBe(2);
  });
});
