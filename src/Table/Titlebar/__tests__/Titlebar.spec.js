import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Titlebar from "../Titlebar";

configure({ adapter: new Adapter() });

describe("Titlebar", () => {
  it("Render Titlebar with default options", () => {
    const component = shallow(<Titlebar />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
