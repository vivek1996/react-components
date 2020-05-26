import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import FieldHelpText from "../FieldHelpText";

configure({ adapter: new Adapter() });

describe("FieldHelpText", () => {
  it("Render FieldHelpText with default options", () => {
    const component = shallow(<FieldHelpText error="FieldHelpText" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
