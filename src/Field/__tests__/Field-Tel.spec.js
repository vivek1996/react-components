import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Tel", () => {
  // {name: 'tel', type: 'tel', label: 'Tel', placeholder: 'Tel', required: true},
  it("snapshot testing", () => {
    const component = shallow(<Field name="tel" type="tel" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="tel" type="tel" />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("tel field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field name="tel" type="tel" />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
  });
});
