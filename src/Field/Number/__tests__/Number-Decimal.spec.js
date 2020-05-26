import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Number from "../Number";

configure({ adapter: new Adapter() });

describe("Number/Decimal", () => {
  it("snapshot testing", () => {
    const component = shallow(<Number name="default-type-number" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(<Number name="default-type-number" />, wrapper);
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("should set defaultValue prop", () => {
    const wrapper = mount(
      <Number name="default-type-number" defaultValue={10} />
    );

    expect(wrapper.find("input").length).toBe(1);
    expect(wrapper.find("input").prop("defaultValue")).toEqual(10);
    expect(wrapper.find("input").prop("type")).toEqual("number");
  });
});
