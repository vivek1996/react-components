import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Date from "./Date";

configure({ adapter: new Adapter() });

describe("Date", () => {
  it("Render Date with default options", () => {
    const component = shallow(<Date name="date" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
