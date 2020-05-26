import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import FormField from "../FormField";

configure({ adapter: new Adapter() });

describe("FormField", () => {
  it("Render FormField with default options", () => {
    const component = shallow(<FormField name="form-field" type="text" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
