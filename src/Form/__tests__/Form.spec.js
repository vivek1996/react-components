import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Form from "../Form";

configure({ adapter: new Adapter() });

describe("Form", () => {
  it("snapshot testing", () => {
    const component = shallow(
      <Form
        fields={[
          {
            name: "text-multiple",
            type: "text",
            label: "Text",
            placeholder: "Text",
            required: true,
            multiple: true,
          },
        ]}
        initialValues={{
          "text-multiple": ["Text 1", "Text 2"],
        }}
      />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <Form
        fields={[
          {
            name: "text-multiple",
            type: "text",
            label: "Text",
            placeholder: "Text",
            required: true,
            multiple: true,
          },
        ]}
        initialValues={{
          "text-multiple": ["Text 1", "Text 2"],
        }}
      />,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("should set form", () => {
    const wrapper = mount(
      <Form
        fields={[
          {
            name: "text-multiple",
            type: "text",
            label: "Text",
            placeholder: "Text",
            required: true,
            multiple: true,
          },
        ]}
      />
    );

    expect(wrapper.find("input").length).toBe(1);
  });

  it("should set initialValues prop", () => {
    const wrapper = mount(
      <Form
        fields={[
          {
            name: "text-multiple",
            type: "text",
            label: "Text",
            placeholder: "Text",
            required: true,
            multiple: true,
          },
        ]}
        initialValues={{
          "text-multiple": ["Text 1", "Text 2"],
        }}
      />
    );

    expect(wrapper.find("input").length).toBe(2);
    expect(wrapper.find("input").at(0).prop("defaultValue")).toEqual("Text 1");
    expect(wrapper.find("input").at(0).prop("type")).toEqual("text");
    expect(wrapper.find("input").at(1).prop("defaultValue")).toEqual("Text 2");
    expect(wrapper.find("input").at(1).prop("type")).toEqual("text");
  });
});
