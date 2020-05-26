import React from "react";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Input from "./Input";

Enzyme.configure({ adapter: new Adapter() });

describe("Input", () => {
  it("Render Input with default options", () => {
    const component = shallow(
      <Input
        type="text"
        name="text"
        key="text"
        defaultValue="textDefaultValue"
      />
    );
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  it("should call onChange prop", () => {
    const handleChange = jest.fn();
    const event = {
      target: { value: "the-value" },
    };
    const component = mount(
      <>
        <Input
          type="text"
          name="text"
          key="text"
          defaultValue="textDefaultValue"
          handleChange={handleChange}
        />
      </>
    );

    expect(component.find(Input).at(0).prop("value")).toEqual(
      "textDefaultValue"
    );
    component
      .find("input")
      .at(0)
      .simulate("change", { target: { name: "text", value: "newText" } });
    expect(component.find("input").at(0).prop("value")).toEqual("newText");
  });

  // test('Input changes the text', () => {
  //   const input = shallow(
  //     <Input
  //       type="text"
  //       name="text"
  //       key="text"
  //       defaultValue="textDefaultValue"
  //     />
  //   );

  //   console.log('input ->> 1', input);
  //   console.log('input ->> 2', input.find('input'));
  //   expect(input.find('input').val()).toEqual('textDefaultValue');

  //   input.find('input').value('change');

  //   expect(input.find('input').value()).toEqual('change');
  // });
});
