import React from "react";
import ReactDOM from "react-dom";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Input from "../Input";

Enzyme.configure({ adapter: new Adapter() });

describe("Input/Email", () => {
  it("snapshot testing", () => {
    const component = shallow(
      <Input
        type="text"
        name="text"
        key="text"
        defaultValue="textDefaultValue"
      />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <Input
        type="text"
        name="text"
        key="text"
        defaultValue="textDefaultValue"
      />,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("should call onChange prop", () => {
    const wrapper = mount(
      <Input name="text" type="text" defaultValue="textDefaultValue" />
    );

    expect(wrapper.find("input").length).toBe(1);
    expect(wrapper.find("input").prop("defaultValue")).toEqual(
      "textDefaultValue"
    );
  });
});
