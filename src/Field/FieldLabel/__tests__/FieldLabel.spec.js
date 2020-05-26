import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import FieldLabel from "../FieldLabel";

configure({ adapter: new Adapter() });

describe("FieldLabel", () => {
  it("Render FieldLabel with default options", () => {
    const component = shallow(<FieldLabel error="FieldLabel" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
