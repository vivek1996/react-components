import React from "react";
import ReactDOM from "react-dom";
import { shallow, configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallowToJson } from "enzyme-to-json";
import Field from "../Field";
import { StoreProvider } from "../../lib";

configure({ adapter: new Adapter() });

describe("Field/Radio", () => {
  // {
  //   name: 'radio', type: 'radio', label: 'radio', placeholder: 'radio', required: true, options: [{value: 'opt1', label: 'Option 1'}, {value: 'opt2', label: 'Option 2'}],
  //   dependencies: {
  //     'opt1': [
  //       {
  //         name: 'opt1-text',
  //         type: 'text',
  //         label: 'opt1-text',
  //         required: true
  //       }
  //     ],
  //     'opt2': [
  //       {
  //         name: 'opt2-text',
  //         type: 'text',
  //         label: 'opt2-text',
  //         required: true
  //       }
  //     ],
  //     '*': [
  //       {
  //         name: 'radio-all-text',
  //         type: 'text',
  //         label: 'radio-all-text',
  //         required: true
  //       }
  //     ]
  //   }
  // },
  it("snapshot testing", () => {
    const component = shallow(<Field name="radio" type="radio" />);
    const tree = shallowToJson(component);
    expect(tree).toMatchSnapshot();
  });

  // eslint-disable-next-line no-undef
  it("renders without crashing", () => {
    const wrapper = document.createElement("div");
    ReactDOM.render(
      <StoreProvider>
        <Field name="radio" type="radio" />
      </StoreProvider>,
      wrapper
    );
    ReactDOM.unmountComponentAtNode(wrapper);
  });

  it("radio field should render without throwing an error", function () {
    const wrapper = mount(
      <StoreProvider>
        <Field name="radio" type="radio" options={["Radio 1", "Radio 2"]} />
      </StoreProvider>
    );
    expect(wrapper.find("input").length).toBe(2);
  });
});
