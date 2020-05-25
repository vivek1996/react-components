import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "./Field";

configure({ adapter: new Adapter() });

describe("Field", () => {
  it("Render Field with default options", () => {
    const component = shallow(<Field name="text" type="text" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
