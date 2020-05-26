import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Form from "./Form";

configure({ adapter: new Adapter() });

describe("Form", () => {
  it("Render Form with default options", () => {
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
});
