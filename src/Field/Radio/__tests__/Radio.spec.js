import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Radio from "../Radio";

configure({ adapter: new Adapter() });

describe("Radio", () => {
  it("Render Radio with default options", () => {
    const component = shallow(<Radio />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
