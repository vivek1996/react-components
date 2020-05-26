import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Select from "../Select";

configure({ adapter: new Adapter() });

describe("Select", () => {
  it("Render Select with default options", () => {
    const component = shallow(<Select />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
