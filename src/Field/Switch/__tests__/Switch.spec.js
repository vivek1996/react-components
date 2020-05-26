import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Switch from "../Switch";

configure({ adapter: new Adapter() });

describe("Switch", () => {
  it("Render Switch with default options", () => {
    const component = shallow(<Switch />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
