import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import FieldDescription from "../FieldDescription";

configure({ adapter: new Adapter() });

describe("FieldDescription", () => {
  it("Render FieldDescription with default options", () => {
    const component = shallow(<FieldDescription html="FieldDescription" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
