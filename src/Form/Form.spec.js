import React from "react";
import { shallow, configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Form from "./Form";

configure({ adapter: new Adapter() });

describe("Form", () => {
  it("Render Form with default options", () => {
    const component = shallow(
      <Form fields={[{ name: "text", type: "text" }]} />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });
});
