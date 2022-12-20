import { ComboBox } from "@progress/kendo-react-dropdowns";

export const StoryPointDropDown = (props) => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 25, 50, 100];
  const onChange = (event) => {
    if (props.onChange) {
      props.onChange({
        dataItem: props.dataItem,
        level: props.level,
        field: props.field,
        syntheticEvent: event,
        value: event.target.value,
      });
    }
  };
  return (
    <td>
      <ComboBox
        data={data}
        onChange={onChange}
        value={props.dataItem.storyPoint}
      />
    </td>
  );
};
