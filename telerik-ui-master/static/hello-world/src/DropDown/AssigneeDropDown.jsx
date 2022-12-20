import { AutoComplete } from "@progress/kendo-react-dropdowns";
import React, { useEffect, useState } from "react";
import { requestJira } from "@forge/bridge";

export const AssigneeDropDown = (props) => {
  console.log(props);
  const [users, setUsers] = useState([]);
  const [state, setState] = React.useState({
    data: users,
    value: "",
    opened: false,
  });

  useEffect(() => {
    (async () => {
      setState({
        value: props.dataItem['assignee'],
        ...state
      })
      let result = await getListUser();
      let atlassianAccount = result.filter(
        (e) => e.accountType === "atlassian" && e.active === true
      );
      setUsers(atlassianAccount.map((e) => e.displayName));
    })();
  }, []);

  const onChange = (event) => {
    const value = event.target.value;
    const filterData = (value) => {
      return users.filter((e) =>
        e.toLowerCase().includes(value.toLowerCase())
      );
    };
    const stateData =
      value.length < 3
        ? {
            data: users,
            opened: false,
          }
        : {
            data: filterData(value),
            opened: true,
          };
    const eventType = event.nativeEvent.type;
    const nativeEvent = event.nativeEvent;
    const valueSelected =
      eventType === "click" ||
      (eventType === "keydown" && nativeEvent.keyCode === 13);
    if (valueSelected && stateData.data.includes(value)) {
      stateData.opened = false;
    }
    setState({
      value: value,
      ...stateData,
    });
    if (props.onChange) {
      setState({
        value: value,
        ...stateData,
      });
      props.onChange({
        dataItem: props.dataItem,
        level: props.level,
        field: props.field,
        syntheticEvent: event,
        value: users.find((e) => e === value),
      });
    }
  };
  return (
    <td
      aria-colindex={props.ariaColumnIndex}
      aria-selected={props.isSelected}
      data-grid-col-index={props.colIndex}
      role="gridcell"
    >
      <AutoComplete
        style={{
          width: "300px",
        }}
        data={state.data}
        value={ props.isNew ? "" :props.dataItem['assignee']}
        onChange={onChange}
        opened={state.opened}
      />
    </td>
  );
};
export default AssigneeDropDown;

const getListUser = async () => {
  const response = await requestJira(`/rest/api/3/users/search`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  console.log(`Response: ${response.status} ${response.statusText}`);
  const result = await response.json();
  return result;
};
