import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Filter from "../Filter";

configure({ adapter: new Adapter() });

describe("Filter", () => {
  it("Render Filter with default options", () => {
    const component = shallow(<Filter />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
