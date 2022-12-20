import React, { useEffect, useState } from "react";
import { AutoComplete } from "@progress/kendo-react-dropdowns";
import { requestJira } from "@forge/bridge";

export const TestDropDown = (props) => {
  let [data, setData] = useState([]);
  let [filterData, setFilterData] = useState([]);

  useEffect(() => {
    (async () => {
      let users = await getListUser();
      let atlassianAccount = users.filter(
        (e) => e.accountType === "atlassian" && e.active === true
      );
      setData(
        atlassianAccount.map((e) => {
          return { text: e.displayName, id: e.accountId };
        })
      );
    })();
  }, []);
  const onChange = (event) => {
    let value = event.target.value;
    setFilterData(
      data.filter((e) => e.text.toLowerCase().includes(value.toLowerCase()))
    );
    if (props.onChange)
      props.onChange({
        dataItem: props.dataItem,
        level: props.level,
        field: props.field,
        syntheticEvent: event,
        value: data.find((e) => e.text === value) || value,
      });
  };
  return (
    <td>
      <AutoComplete
        style={{ width: "300px" }}
        data={filterData}
        value={
          props.dataItem["assignee.displayName"]?.text ||
          props.dataItem["assignee.displayName"] ||
          props.dataItem.assignee?.displayName ||
          ""
        }
        textField={"text"}
        onChange={onChange}
      />
    </td>
  );
};
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
