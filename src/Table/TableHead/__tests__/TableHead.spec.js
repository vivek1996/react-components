import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import TableHead from "../TableHead";

configure({ adapter: new Adapter() });

describe("TableHead", () => {
  it("Render TableHead with default options", () => {
    const component = shallow(<TableHead />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
