import {
  TextBox,
} from "@progress/kendo-react-inputs";
const IssueKeyFilter = (props) => {
  return (
    <TextBox
      onChange={e => props.onChangeIssueKey(e.target.value)}
      placeholder="Issue key (can be blank)"
      style={{
        width: 400,
      }}
    />
  );
};
export default IssueKeyFilter;
