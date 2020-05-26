import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import FieldError from "../FieldError";

configure({ adapter: new Adapter() });

describe("FieldError", () => {
  it("Render FieldError with default options", () => {
    const component = shallow(<FieldError error="FieldError" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
