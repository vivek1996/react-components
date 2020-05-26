import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Autocomplete from "../Autocomplete";

configure({ adapter: new Adapter() });

describe("Autocomplete", () => {
  it("snapshot testing", () => {
    const component = shallow(<Autocomplete name="autocomplete" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(<Autocomplete name="autocomplete" />, wrapper);
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("should set defaultValue prop", () => {
    const wrapper = mount(
      <Autocomplete name="autocomplete" defaultValue="defaultAutocomplete" />
    );

    expect(wrapper.find("input").length).toBe(1);
  });
});
