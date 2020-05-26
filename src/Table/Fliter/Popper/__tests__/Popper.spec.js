import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Popper from "../Popper";

configure({ adapter: new Adapter() });

describe("Popper", () => {
  it("Render Popper with default options", () => {
    const component = shallow(<Popper />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
