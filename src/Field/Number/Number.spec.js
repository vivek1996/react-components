import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Number from "./Number";

configure({ adapter: new Adapter() });

describe("Number", () => {
  it("Render Number with default options", () => {
    const component = shallow(<Number />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
