import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field", () => {
  // {name: 'text-multiple', type: 'text', label: 'Text', placeholder: 'Text', required: true, multiple: true},
  // {
  //   name: 'list',
  //   type: 'section',
  //   label: 'List',
  //   required: true,
  //   multiple: true,
  //   fields: [
  //     {
  //       name: 'name',
  //       type: 'text',
  //       label: 'List Name',
  //       placeholder: 'List Name',
  //       required: true
  //     },
  //     {
  //       name: 'content',
  //       type: 'text',
  //       label: 'Content',
  //       placeholder: 'Content',
  //       required: true
  //     },
  //   ]
  // }
  it("snapshot testing", () => {
    const component = shallow(
      <Field
        name="text-multiple"
        type="text"
        multiple={true}
        defaultValue={["Text 1", "Text 2"]}
      />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="text-multiple" type="text" multiple={true} />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("array field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="text-multiple"
          type="text"
          multiple={true}
          defaultValue={["Text 1", "Text 2"]}
        />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(2);
    expect(wrapper.find("input").at(0).prop("name")).toEqual("text-multiple.0");
    // expect(wrapper.find("input").at(0).prop("defaultValue")).toEqual("Text 1");
    expect(wrapper.find("input").at(0).prop("type")).toEqual("text");
    expect(wrapper.find("input").at(1).prop("name")).toEqual("text-multiple.1");
    // expect(wrapper.find("input").at(1).prop("defaultValue")).toEqual("Text 2");
    expect(wrapper.find("input").at(1).prop("type")).toEqual("text");
  });
});
