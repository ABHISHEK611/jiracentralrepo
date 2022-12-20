import { TextBox } from "@progress/kendo-react-inputs";
import { useEffect, useState } from "react";
const SummaryEditor = (props) => {
  let [summary, setSumarry] = useState("");
  useEffect(() => {
    if (!props.dataItem.isNew) setSumarry(props.dataItem.summary);
    console.log("use efffect");
    console.log(props);
  }, []);
  const onChange = (event) => {
    setSumarry(event.target.value);
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
      <TextBox onChange={onChange} value={summary} />
    </td>
  );
};
export default SummaryEditor;
