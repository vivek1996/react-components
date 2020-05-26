import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Checkbox", () => {
  // {name: 'checkbox1', type: 'checkbox', label: 'checkbox 1', placeholder: 'checkbox 1', required: true},
  // {
  //   name: 'checkbox2',
  //   type: 'checkbox',
  //   label: 'checkbox 2',
  //   placeholder: 'checkbox 2',
  //   required: true,
  //   options: [{value: 'chk1', label: 'Checkbox 1'}, {value: 'chk2', label: 'Checkbox 2'}],
  //   dependencies: {
  //     'chk1': [
  //       {
  //         name: 'chk1-text',
  //         type: 'text',
  //         label: 'chk1-text',
  //         required: true
  //       }
  //     ],
  //     'chk2': [
  //       {
  //         name: 'chk2-text',
  //         type: 'text',
  //         label: 'chk2-text',
  //         required: true
  //       }
  //     ],
  //     '*': [
  //       {
  //         name: 'checkbox-all-text',
  //         type: 'text',
  //         label: 'checkbox-all-text',
  //         required: true
  //       }
  //     ]
  //   }
  // },
  it("snapshot testing", () => {
    const component = shallow(<Field name="text" type="text" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="text" type="text" />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("checkbox field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field
          name="checkbox"
          type="checkbox"
          options={["Checkbox 1", "Checkbox 2"]}
        />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(2);
  });
});
