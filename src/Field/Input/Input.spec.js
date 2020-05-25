import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Input from "./Input";

configure({ adapter: new Adapter() });

describe("Input", () => {
  it("Render Input with default options", () => {
    const component = shallow(<Input />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
