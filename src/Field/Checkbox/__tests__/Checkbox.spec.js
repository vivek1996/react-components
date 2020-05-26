import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Checkbox from "../Checkbox";

configure({ adapter: new Adapter() });

describe("Checkbox", () => {
  it("Render Checkbox with default options", () => {
    const component = shallow(<Checkbox name="checkbox" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
