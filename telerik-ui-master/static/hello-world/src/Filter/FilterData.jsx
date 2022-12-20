import LinkedIssueType from "./LinkedIssueTypeFilter";
import ProjectFilter from "./ProjectFilter";
import IssueKeyFilter from "./IssueKeyFilter";
import { useState } from "react";
const FilterData = (props) => {
  let [projects, setProjects] = useState([]);
  let [issueLinkType, setIssueLinkType] = useState("");
  let [issueKey, setIssueKey] = useState("");
  const onChangeProject = (value) => {
    setProjects(value);
  };
  const onChangeLinkIssueType = (value) => {
    setIssueLinkType(value);
  };
  const onChangeIssueKey = (value) => {
    setIssueKey(value);
  };
  const search = () => {
    props.onQuerry(projects,issueLinkType,issueKey)
  };
  return (
    <>
      <ProjectFilter onChangeProject={onChangeProject} />
      <LinkedIssueType onChangeLinkIssueType={onChangeLinkIssueType} />
      <IssueKeyFilter onChangeIssueKey={onChangeIssueKey} />
      <button
        title="Search"
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
        onClick={search}
      >
        Search
      </button>
    </>
  );
};
export default FilterData;
