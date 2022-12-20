import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import { useEffect, useState } from "react";
import { requestJira } from "@forge/bridge";
const ProjectFilter = (props) => {
  let [data, setData] = useState([]);
  let [staticData, setStaticData] = useState([]);
  useEffect(() => {
    (async () => {
      let listProject = await getAllProject();
      let projects = listProject.map((element) => {
        return { key: element.key, projectName: element.name };
      });
      setData(projects);
      setStaticData(projects);
    })();
  }, []);

  let filterChange = (event) => {
    setData(filterBy(staticData, event.filter));
  };

  return (
    <MultiSelect
      data={data}
      filterable={true}
      textField="projectName"
      dataItemKey="key"
      onFilterChange={filterChange}
      placeholder="Projects"
      style={{
        width: "300px",
      }}
      onChange={e=>{props.onChangeProject(e.target.value)}}
    />
  );
};
const getAllProject = async () => {
  const response = await requestJira(`/rest/api/3/project/search`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  let result = await response.json();
  return result.values;
};
export default ProjectFilter;
