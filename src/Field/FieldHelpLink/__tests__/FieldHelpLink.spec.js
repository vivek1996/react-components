import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import FieldHelpLink from "../FieldHelpLink";

configure({ adapter: new Adapter() });

describe("FieldHelpLink", () => {
  it("Render FieldHelpLink with default options", () => {
    const component = shallow(<FieldHelpLink error="FieldHelpLink" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
