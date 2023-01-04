import React, { useEffect, useState } from 'react';
import { TreeGridComponent, ColumnsDirective, ColumnDirective, DataStateChangeEventArgs, Selection, RowDD, Inject, Edit, CommandColumn } from "@syncfusion/ej2-react-treegrid";
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { getIssueData, updateIssueLink } from "./data/ManageData";
import { handleExpand } from "./service/TreeGridHandler";
import './App.css';

function App() {
  let projects = "TEST";
  let issueLinkType = {
    id: "10008",
    name: "Track/Contributes",
    inward: "Contributes To",
    outward: "Tracks"
  }
  let treegridIssue;
  const [dataSource, setDataSource] = useState(null);
  const commands = [
    {
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-edit e-icons' },
      type: 'Edit',
    },
    {
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-delete e-icons' },
      type: 'Delete'
    },
    {
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-update e-icons' },
      type: 'Save'
    },
    {
      buttonOption: { cssClass: 'e-flat', iconCss: 'e-cancel-icon e-icons' },
      type: 'Cancel'
    }
  ];
  
  const editOptions = {
    allowAdding: true,
    allowDeleting: true,
    allowEditing: true,
    mode: 'Row'
  };

  const commandClick = (args) => {
      if (grid) {
          alert(JSON.stringify(args.rowData));
      }
  };

  const handleClickSearch = async () => {
    console.log("aaa")
    if (treegridIssue) {
      treegridIssue.showSpinner(); // show the spinner
      let value = await getIssueData(projects, issueLinkType, "");
      treegridIssue.hideSpinner(); // hide the spinner  
      setDataSource(value);
    }
  };

  const handleDataStateChange = (dataState) => {
    console.log("dataState");
    console.log(dataState);
    if (dataState.requestType === 'expand') {
      handleExpand(projects, issueLinkType, treegridIssue, dataState).then((childData) => {
        dataState.childData = childData;
        dataState.childDataBind();
      });
    } else {
      console.log("else");
      getIssueData(projects, issueLinkType, "").then((data) => {
        treegridIssue && setDataSource(data);
      });
    }
  }

  const handleRowDrop = (rowDragEventArgs) => {
    if (rowDragEventArgs.dropPosition === "middleSegment") { // drop on row
      let currentViewRecords = treegridIssue.getCurrentViewRecords();
      let source = currentViewRecords[rowDragEventArgs.fromIndex];
      let target = currentViewRecords[rowDragEventArgs.dropIndex];
      console.log(rowDragEventArgs);
      console.log(source);
      console.log(target);
      updateIssueLink(target.key, source.parentId, source.key, issueLinkType);
    } else { // cancel drop on other position
      rowDragEventArgs.cancel = false;
    }
  }

  return (
    <div>
      <div>
        <ButtonComponent cssClass='e-info' onClick={handleClickSearch}>Search</ButtonComponent>
      </div>
      <div className="control-pane">
        <div className="control-section">
          <TreeGridComponent
            ref={g => treegridIssue = g}
            dataSource={dataSource}
            dataStateChange={handleDataStateChange}
            treeColumnIndex={0}
            enableCollapseAll="true"
            idMapping='id'
            parentIdMapping="parentId"
            hasChildMapping="isParent"
            allowRowDragAndDrop={true}
            childMapping="childIssues"
            rowDrop={handleRowDrop}
            editSettings={editOptions}
            commandClick={commandClick}
          >
            <ColumnsDirective>
              <ColumnDirective field="key" headerText="Issue Key" />
              <ColumnDirective field="summary" headerText="Summary" />
              <ColumnDirective field="issueType" headerText="Issue Type" />
              <ColumnDirective field="assignee" headerText="Assignee" />
              <ColumnDirective field="storyPoint" headerText="Story Point" />
              <ColumnDirective headerText='Commands' width='130' commands={commands} />
            </ColumnsDirective>
            <Inject services={[RowDD, Selection, Edit, CommandColumn]} />
          </TreeGridComponent>
        </div>
      </div>
    </div>
  );
}

export default App;
