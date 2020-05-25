import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Table from "./Table";

configure({ adapter: new Adapter() });

describe("Table", () => {
  it("Render Table with default options", () => {
    const component = shallow(<Table />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
