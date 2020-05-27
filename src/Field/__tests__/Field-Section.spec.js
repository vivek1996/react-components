import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Section", () => {
  // {
  //   name: 'address',
  //   type: 'section',
  //   label: 'Address',
  //   required: true,
  //   fields: [
  //     {
  //       name: 'line_1',
  //       type: 'text',
  //       label: 'Address Line 1',
  //       placeholder: 'Address Line 1',
  //       required: true
  //     },
  //     {
  //       name: 'line_2',
  //       type: 'text',
  //       label: 'Address Line 2',
  //       placeholder: 'Address Line 2',
  //       required: true
  //     },
  //     {
  //       name: 'city',
  //       type: 'text',
  //       label: 'City',
  //       placeholder: 'City',
  //       required: true
  //     },
  //     {
  //       name: 'state',
  //       type: 'text',
  //       label: 'State',
  //       placeholder: 'State',
  //       required: true
  //     },
  //     {
  //       name: 'country',
  //       type: 'select',
  //       label: 'Country',
  //       placeholder: 'Country',
  //       required: true,
  //       options: ['India', 'Australia']
  //     },
  //   ]
  // },
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
        name="section"
        type="section"
        fields={[
          {
            name: "text",
            type: "text",
          },
        ]}
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
        <Field
          name="section"
          type="section"
          fields={[
            {
              name: "text",
              type: "text",
            },
          ]}
          defaultValue={{
            text: "Text 1",
          }}
        />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("section field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="section"
          type="section"
          fields={[
            {
              name: "text",
              type: "text",
            },
          ]}
          defaultValue={{
            text: "Text 1",
          }}
        />
      </StoreProvider>
    );

    expect(wrapper.find("input").length).toBe(1);
    expect(wrapper.find("input").at(0).prop("defaultValue")).toEqual("Text 1");
    expect(wrapper.find("input").at(0).prop("type")).toEqual("text");
    expect(wrapper.find("input").at(0).prop("name")).toEqual("section.text");
  });
});
