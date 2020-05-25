import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Autocomplete from "./Autocomplete";

configure({ adapter: new Adapter() });

describe("Autocomplete", () => {
  it("Render Autocomplete with default options", () => {
    const component = shallow(<Autocomplete name="autocomplete" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
