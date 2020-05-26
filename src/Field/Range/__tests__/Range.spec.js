import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Range from "../Range";

configure({ adapter: new Adapter() });

describe("Range", () => {
  it("Render Range with default options", () => {
    const component = shallow(<Range />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
