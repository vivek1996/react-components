import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Toggle from "../Toggle";

configure({ adapter: new Adapter() });

describe("Toggle", () => {
  it("Render Toggle with default options", () => {
    const component = shallow(<Toggle />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
