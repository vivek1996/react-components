import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Default", () => {
  // {name: 'text', label: 'Text', placeholder: 'Text', required: true},
  it("snapshot testing", () => {
    const component = shallow(<Field name="default" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="default" />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("default field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field name="default" description="This is default field" />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
  });

  it("default field with defaultValue as function", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="default"
          description="This is default field"
          defaultValue={(fieldValues) => {
            return "Hello Default Value Function";
          }}
        />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
    expect(wrapper.find("input").prop("defaultValue")).toEqual(
      "Hello Default Value Function"
    );
  });

  it("default field with options & without type", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="default"
          description="This is default field"
          options={["Option 1", "Option 2"]}
        />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(2);
  });

  it("default field with options & without type & multiple set to true", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="default"
          description="This is default field"
          options={["Option 1", "Option 2"]}
          multiple={true}
        />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(2);
  });

  it("default field with fields to check section type field", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="default"
          description="This is default field"
          fields={[
            {
              name: "text",
            },
          ]}
        />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(1);
  });

  it("default field with multiple true", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="default"
          description="This is default field"
          defaultValue={["Text 1", "Text 2"]}
          multiple={true}
        />
      </StoreProvider>
    );

    expect(wrapper.find("input").length).toBe(2);
    expect(wrapper.find("input").at(0).prop("defaultValue")).toEqual("Text 1");
    expect(wrapper.find("input").at(0).prop("type")).toEqual("text");
    expect(wrapper.find("input").at(1).prop("defaultValue")).toEqual("Text 2");
    expect(wrapper.find("input").at(1).prop("type")).toEqual("text");
  });
});
