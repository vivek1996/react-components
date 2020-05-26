import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Default", () => {
  // {name: 'text', label: 'Text', placeholder: 'Text', required: true},
  it("snapshot testing", () => {
    const component = shallow(<Field name="default" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="default" />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("default field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field name="default" />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
  });
});
