import React, { useEffect, useRef, useState } from "react";
import { invoke } from "@forge/bridge";
import "./styles.css";
import {
  TreeList,
  TreeListDraggableRow,
  mapTree,
  moveTreeItem,
  extendDataItem,
  modifySubItems,
  removeItems,
  TreeListTextEditor,
  TreeListToolbar,
} from "@progress/kendo-react-treelist";
import issueData, { findChildByJql } from "./fetchData";
import updateIssueLink, {
  assigneeIssue,
  transitionIssue,
  linkNewIssue,
  createIssue,
  updateIssue,
  bulkCreateIssue,
} from "./service";
import MyCommandCell from "./my-command-cell";
import {
  DropDownButton,
  DropDownButtonItem,
} from "@progress/kendo-react-buttons";
import { issueType } from "./issueType";
import AssigneeDropDown from "./DropDown/AssigneeDropDown";
import TransitionDropDown from "./DropDown/TransitionDropDown";
import { StoryPointDropDown } from "./DropDown/StoryPointDropDown";
import FilterData from "./Filter/FilterData";
import { TestDropDown } from "./DropDown/TestDropdown";

const subItemsField = "issues";
const expandField = "expanded";
const editField = "inEdit";
const loadingPanel = (
  <div className="k-loading-mask">
    <span className="k-loading-text">Loading</span>
    <div className="k-loading-image"></div>
    <div className="k-loading-color"></div>
  </div>
);
function App() {
  let [data, setData] = useState([]);
  let [expanded, setExpanded] = useState([1, 2, 32]);
  let [inEdit, setInEdit] = useState([]);
  let bundleSave = useRef({});
  let [projects, setProjects] = useState([]);
  let [issueLinkType, setIssueLinkType] = useState("");
  let [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    invoke("getContext", { example: "my-invoke-variable" }).then((value) =>
      console.log(value)
    );
  }, []);
  const onRowDrop = (event) => {
    const dropItemIndex = [...event.draggedOver];
    const dropItem = getItemByIndex(data, dropItemIndex);
    const oldParentIndex = [...event.dragged].slice(0, -1);
    const oldParent = getItemByIndex(data, oldParentIndex);
    setData(
      moveTreeItem(data, event.dragged, event.draggedOver, subItemsField)
    );
    updateIssueLink(dropItem, oldParent, event.draggedItem);
  };
  const getItemByIndex = (data, draggedOver) => {
    if (draggedOver.length === 0) return null;
    if (draggedOver.length === 1) return data[draggedOver[0]];
    else {
      let childIndex = [...draggedOver];
      childIndex.shift();
      return getItemByIndex(data[draggedOver[0]].issues, childIndex);
    }
  };
  const onExpandChange = (event) => {
    if (event.value === false) {
      setIsLoading(true);
      let issueParent = event.dataItem;
      Promise.all(
        issueParent.issues.map(async (child) => {
          let childOfChild = await findChildByJql(
            projects,
            issueLinkType,
            child
          );
          await loadChild(data, child.key, childOfChild);
        })
      ).then(() => {
        setIsLoading(false);
        setData(data);
        setExpanded(
          event.value
            ? expanded.filter((id) => id !== event.dataItem.id)
            : [...expanded, event.dataItem.id]
        );
      });
    } else {
      setExpanded(
        event.value
          ? expanded.filter((id) => id !== event.dataItem.id)
          : [...expanded, event.dataItem.id]
      );
    }
  };
  const loadChild = async (source, parentKey, childIssues) => {
    source.forEach((element) => {
      if (element.key === parentKey) {
        element.issues = childIssues;
        return source;
      }
      if (element.issues !== undefined) {
        loadChild(element.issues, parentKey, childIssues);
      }
    });
  };
  const addExpandField = (dataArr) => {
    return mapTree(dataArr, subItemsField, (item) =>
      extendDataItem(item, subItemsField, {
        [expandField]: expanded.includes(item.id),
        [editField]: Boolean(inEdit.find((i) => i.id === item.id)),
      })
    );
  };
  const addChild = (dataItem, issueTypeId) => {
    const newRecord = createNewItem();
    newRecord.parentKey = dataItem.key;
    newRecord.issueType = issueTypeId;
    setInEdit([...inEdit, newRecord]);
    setExpanded([...expanded, dataItem.id]);
    setData(
      modifySubItems(
        data,
        subItemsField,
        (item) => item.id === dataItem.id,
        (subItems) => [newRecord, ...subItems]
      )
    );
  };
  const enterEdit = (dataItem) => {
    setInEdit([...inEdit, extendDataItem(dataItem, subItemsField)]);
  };
  const save = (dataItem) => {
    const { isNew, ...itemToSave } = dataItem;
    console.log(dataItem);
    if (isNew === true) {
      console.log(projects);
      let body = {
        fields: {
          summary: itemToSave.summary,
          project: {
            key: projects[0].key,
          },
          issuetype: {
            id: itemToSave.issueType,
          },
          assignee: {
            id:
              itemToSave["assignee.displayName"] !== undefined
                ? itemToSave["assignee.displayName"].id
                : null,
          },
        },
      };
      if (itemToSave["assignee.displayName"] !== undefined) {
        itemToSave.assignee = {
          displayName: itemToSave["assignee.displayName"].text,
          accountId: itemToSave["assignee.displayName"].id,
        };
      }
      console.log(itemToSave);
      createIssue(JSON.stringify(body)).then((result) => {
        itemToSave.key = result.key;
        setData(
          mapTree(data, subItemsField, (item) =>
            item.id === itemToSave.id ? itemToSave : item
          )
        );
        if (dataItem.parentKey !== undefined) {
          linkNewIssue(result.key, dataItem.parentKey);
        }
      });
      setInEdit(inEdit.filter((i) => i.id !== itemToSave.id));
    } else {
      let body = {
        fields: {
          summary: itemToSave.summary,
          customfield_10033: itemToSave.storyPoint,
        },
      };
      if (itemToSave["status.text"]) {
        itemToSave["status"].text = itemToSave["status.text"].text;
        transitionIssue(itemToSave.key, itemToSave["status.text"].id);
      }
      if (itemToSave["assignee.displayName"]) {
        itemToSave.assignee = {
          displayName: itemToSave["assignee.displayName"].text,
          accountId: itemToSave["assignee.displayName"].id,
        };
        assigneeIssue(itemToSave.key, itemToSave["assignee.displayName"].id);
      }
      // updateIssue(JSON.stringify(body), itemToSave.key).then((result) => {
      //   setData(
      //     mapTree(data, subItemsField, (item) =>
      //       item.id === itemToSave.id ? itemToSave : item
      //     )
      //   );
      // });
      setInEdit(inEdit.filter((i) => i.id !== itemToSave.id));
    }
  };
  const cancel = (editedItem) => {
    if (editedItem.isNew) {
      return remove(editedItem);
    }
    setData(
      mapTree(data, subItemsField, (item) =>
        item.id === editedItem.id ? inEdit.find((i) => i.id === item.id) : item
      )
    );
    setInEdit(inEdit.filter((i) => i.id !== editedItem.id));
  };
  const remove = (dataItem) => {
    setData(removeItems(data, subItemsField, (i) => i.id === dataItem.id));
    setInEdit(inEdit.filter((i) => i.id !== dataItem.id));
  };
  const viewDetails = (dataItem) => {
    setData([dataItem]);
  };
  const onItemChange = (event) => {
    const field = event.field;
    setData(
      mapTree(data, subItemsField, (item) =>
        item.id === event.dataItem.id
          ? extendDataItem(item, subItemsField, {
              [field]: event.value,
            })
          : item
      )
    );
  };
  const addRecord = (issueTypeId) => {
    const newRecord = createNewItem();
    newRecord.issueType = issueTypeId;
    console.log(newRecord);
    setData([newRecord, ...data]);
    setInEdit([...inEdit, { ...newRecord }]);
  };
  const saveAll = async () => {
    setIsLoading(true);
    Promise.all(
      inEdit.map(async (itemEdit) => {
        let issue = findDataItemByID(itemEdit.id, data);

        //Create new issue
        if (issue.isNew) {
          let body = {
            fields: {
              summary: issue.summary,
              project: {
                key: projects[0].key,
              },
              issuetype: {
                id: issue.issueType,
              },
              assignee: {
                id: issue["assignee.displayName"].id || null,
              },
            },
          };
          console.log(body);
          createIssue(JSON.stringify(body)).then((result) => {
            if (issue.parentKey) {
              linkNewIssue(result.key, issue.parentKey);
            }
          });
        } else {
          console.log(issue);
          let body = {
            fields: {
              summary: issue.summary,
            },
          };
          body.fields = {
            ...body.fields,
            ...(issue.storyPoint && { customfield_10033: issue.storyPoint }),
          };
          console.log(body);
          if (issue["status.text"]) {
            issue["status"].text = issue["status.text"].text;
            await transitionIssue(issue.key, issue["status.text"].id);
          }
          if (issue["assignee.displayName"]) {
            issue.assignee = {
              displayName: issue["assignee.displayName"].text,
              accountId: issue["assignee.displayName"].id,
            };
            await assigneeIssue(issue.key, issue["assignee.displayName"].id);
          }
          await updateIssue(JSON.stringify(body), issue.key);
        }
      })
    ).then(async () => {
      await delay(500);
      await reload();
    });
  };
  const delay = (delayInms) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };
  const findDataItemByID = (id, dataSource) => {
    let result = undefined;
    if (dataSource === undefined) return undefined;
    else {
      for (const dataItem of dataSource) {
        if (dataItem.id === id) return dataItem;
        else {
          if (dataItem.issues?.length > 0)
            result = findDataItemByID(id, dataItem.issues);
          if (result) return result;
        }
      }
    }
  };
  const reload = async () => {
    setIsLoading(true);
    let value = await issueData(projects, issueLinkType, "");
    setData(value);
    console.log(value);
    setIsLoading(false);
    setInEdit([]);
  };
  const createNewItem = () => {
    const timestamp = new Date().getTime();
    return {
      id: timestamp,
      isNew: true,
    };
  };
  const CommandCell = MyCommandCell(
    enterEdit,
    remove,
    save,
    cancel,
    addChild,
    editField,
    bundleSave,
    viewDetails
  );
  const columns = [
    {
      field: "key",
      title: "Key",
      expandable: true,
    },
    {
      field: "issueType",
      title: "Type",
    },
    {
      field: "summary",
      title: "Summary",
      editCell: TreeListTextEditor,
    },
    {
      field: "assignee",
      title: "assignee",
      editCell: TestDropDown,
    },
    {
      field: "status.text",
      title: "status",
      editCell: (props) =>
        props.dataItem.isNew ? <td></td> : TransitionDropDown(props),
    },
    {
      field: "storyPoint",
      title: "storyPoint",
      editCell: (props) =>
        props.dataItem.issueType === "Story" ? (
          StoryPointDropDown(props)
        ) : (
          <td></td>
        ),
    },
    {
      cell: CommandCell,
    },
  ];
  const onQuerry = (projects, linkType, issueKey) => {
    setIsLoading(true);
    if (projects.length === 0) {
      alert("Please select at leas one project");
      setIsLoading(false);
      return;
    }
    if (linkType === "") {
      alert("Please select link type of issue");
      setIsLoading(false);
      return;
    }
    setProjects(projects);
    setIssueLinkType(linkType);
    issueData(projects, linkType, issueKey).then((value) => {
      setIsLoading(false);
      if (value.error) {
        alert(value.error);
      } else {
        setData(value);
        setIsLoading(false);
      }
    });
  };
  const debug = () =>{
    console.log(inEdit);
  }
  return (
    <div>
      {isLoading && loadingPanel}
      <FilterData onQuerry={onQuerry} />
      {data.length !== 0 && (
        <TreeList
          style={{
            maxHeight: "100%",
            overflow: "auto",
            width: "100%",
          }}
          expandField={expandField}
          editField={editField}
          subItemsField={subItemsField}
          onExpandChange={onExpandChange}
          onItemChange={onItemChange}
          data={addExpandField(data)}
          columns={columns}
          onRowDrop={onRowDrop}
          row={TreeListDraggableRow}
          resizable={true}
          toolbar={
            <TreeListToolbar>
              <DropDownButton
                themeColor="info"
                text={"Add new"}
                onItemClick={(event) => addRecord(event.item.id)}
              >
                {issueType.map((value) => (
                  <DropDownButtonItem
                    imageUrl={value.icon}
                    text={value.type}
                    id={value.id}
                  ></DropDownButtonItem>
                ))}
              </DropDownButton>
              <button
                title="Reload"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={reload}
              >
                Reload
              </button>
              <button
                title="DEBUG"
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                onClick={debug}
              >
                DEBUG
              </button>
              {inEdit.length > 0 && (
                <button
                  title="Save All"
                  className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  onClick={saveAll}
                >
                  Save All
                </button>
              )}
            </TreeListToolbar>
          }
        />
      )}
    </div>
  );
}

export default App;
