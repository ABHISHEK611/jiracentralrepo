import { requestJira } from "@forge/bridge";
import { useEffect, useState } from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
const getIssueLinkType = async (props) => {
  const response = await requestJira(`/rest/api/3/issueLinkType`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  let result = await response.json();
  return result.issueLinkTypes;
};
const findFilter = async (filterName) => {
  const response = await requestJira(
    `/rest/api/3/filter/search?filterName=${filterName}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  let result = await response.json();
  return result.values.find((element) => element.name === filterName);
};
const createFilter = async (filterName, inward) => {
  let bodyData = {
    jql: `issueLinkType ="${inward}"`,
    name: filterName,
    sharePermissions: [{ type: "authenticated" }],
  };
  const response = await requestJira(`/rest/api/3/filter`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyData),
  });
  console.log(`Response: ${response.status} ${response.statusText}`);
  console.log(await response.json());
};
const checkFilter = async (linktypes) => {
  linktypes.map(async (element) => {
    let exist = await findFilter(element.id);
    if (exist === undefined) {
      await createFilter(element.id, element.inward);
    }
  });
};
const LinkedIssueType = (props) => {
  let [data, setData] = useState([]);
  useEffect(() => {
    (async () => {
      let linktypes = await getIssueLinkType();
      setData(
        linktypes.map((ele) => {
          ele.text = `${ele.inward}\\${ele.outward}`;
          return ele;
        })
      );
      checkFilter(linktypes);
    })();
  }, []);
  return (
    <DropDownList
      style={{
        width: "300px",
      }}
      data={data}
      textField="text"
      dataItemKey="id"
      onChange={(e) => {
        props.onChangeLinkIssueType(e.target.value);
      }}
    />
  );
};
export default LinkedIssueType;
