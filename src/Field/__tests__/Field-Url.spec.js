import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Url", () => {
  // {name: 'url', type: 'url', label: 'url', placeholder: 'url', required: true},
  it("snapshot testing", () => {
    const component = shallow(<Field name="url" type="url" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="url" type="url" />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("url field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field name="url" type="url" />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
  });
});
