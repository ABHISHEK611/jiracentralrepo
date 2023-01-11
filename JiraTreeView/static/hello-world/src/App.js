import React, { useEffect, useRef, useState }  from 'react';
import { TreeList, Column, RowDragging, ColumnChooser, Editing, RequiredRule, Lookup, Button, } 
from 'devextreme-react/tree-list';
import api, { fetch, route } from '@forge/api';
import ForgeUI, { useProductContext } from '@forge/ui';
import { requestJira } from '@forge/bridge';
import { fetchIssueList } from './data';
//import {issues as issueList} from './data';

const expandedRowKeys = [1];

const issuestype = [
  'Story',
  'Bug',
  'Task',
  'SubTask',
  'Bug Fix Steps',
];

const addRow = (e) => {
  console.log("inside addRow",e);
};
let i=0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.onReorder = this.onReorder.bind(this);
    this.onAllowDropInsideItemChanged = this.onAllowDropInsideItemChanged.bind(this);
    this.onAllowReorderingChanged = this.onAllowReorderingChanged.bind(this);
    this.onShowDragIconsChanged = this.onShowDragIconsChanged.bind(this);

    this.state = {
      issues:[],
      //issues: issueList,
      allowDropInsideItem: true,
      allowReordering: true,
      showDragIcons: false,
      mode: 'select',
      allowSearch: true,
    };
  }

  async componentDidMount()
  {
    let a=0;
    let issues1 = [];
    let x = await fetchIssueList();
    console.log("1 inside componentDidMount: ",x);
    let y = x.issues.map((element) => {
      console.log("1.5 inside componentDidMount: ",element);
      debugger;
          let item = {
                ID: element.id,
                Head_ID: (element.fields.issuelinks.length != 0
                ? element.fields.issuelinks[0].hasOwnProperty("outwardIssue")
                ? element.fields.issuelinks[0].outwardIssue.id : -1 : -1),
                Issue_Key: element.key,
                Issue_Type: element.fields.issuetype.name,
                Summary: element.fields.summary,
                Assignee: (element.fields.assignee === null? "Unassigned":element.fields.assignee.displayName),
                Reporter: element.fields.reporter.displayName,
                Priority: element.fields.priority.name,
            }
          console.log("2 inside componentDidMount: ",JSON.stringify(item));
        console.log("3 inside componentDidMount: ",JSON.stringify(issues1));
        return item;
      });
      console.log("4 inside componentDidMount new test: ",y);
        this.setState({
          issues:y,
        });
  }

  render() {
    const { mode, allowSearch } = this.state;
    
    return (
      <div>
        <TreeList
          id="issues"
          dataSource={this.state.issues}
          rootValue={-1}
          showRowLines={true}
          showBorders={true}
          defaultExpandedRowKeys={expandedRowKeys}
          columnAutoWidth={true}
          keyExpr="ID"
          parentIdExpr="Head_ID"
          onInitNewRow={this.onInitNewRow}
          onRowInserted={this.addRow}
        >

        <RowDragging
            onDragChange={this.onDragChange}
            onReorder={this.onReorder}
            allowDropInsideItem={this.state.allowDropInsideItem}
            allowReordering={this.state.allowReordering}
            showDragIcons={this.state.showDragIcons}
        />

        <Editing
            allowUpdating={true}
            allowDeleting={true}
            allowAdding={true}
            mode="row" 
        />

        <Column allowHiding={false} dataField="Issue_Key"> </Column>
        <Column allowHiding={false} dataField="Issue_Type"> <RequiredRule /> <Lookup dataSource={issuestype} /> </Column>
        <Column allowHiding={false} dataField="Summary"> <RequiredRule /> </Column>
        <Column dataField="Assignee"> <RequiredRule /> </Column>
        <Column dataField="Priority"> <RequiredRule /> </Column>
        <Column allowHiding={false} type="buttons" caption="Actions">
                <Button name="add" />
                <Button name="edit" />
                <Button name="delete" />
                <Button name="save" onClick={this.addNode} />
            </Column>
        <ColumnChooser enabled={true} allowSearch={allowSearch} mode={mode} />
        </TreeList>
      </div>
    );
  }

  addNode = async (e) => {
    addRow(e);
  }
  
  addRow = async (e) => {
    console.log("1 inside addRow: ",e.data.Summary);
    console.log("1.5 inside addRow: ",e.data.Issue_Type);
    let body = {
      fields: {
        summary: e.data.Summary,
        project: {
          key: "OEM",
        },
        issuetype: {
          name: e.data.Issue_Type,
        },
        assignee: {
          name: "Abhishek Srivastava",
        },
        "customfield_10042": "https://google.com",
        "customfield_10034": 8
      }
    };

    let body1 = JSON.stringify(body);
    console.log("2 inside addRow: ",JSON.stringify(body));
    const response = await requestJira('/rest/api/3/issue', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: body1
    })
  console.log(`Response: ${response.status} ${response.statusText}`);
  }

  onInitNewRow(e) {
    console.log("1 onInitNewRow: ",e);
    e.data.ID=i;
    e.data.Head_ID = -1;
    i++;
  }

  onDragChange(e) {
    console.log("1 onDragChange: ",e);
    const visibleRows = e.component.getVisibleRows();
    const sourceNode = e.component.getNodeByKey(e.itemData.ID);
    let targetNode = visibleRows[e.toIndex].node;

    while (targetNode && targetNode.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

  onReorder(e) {
    console.log("1 onReorder: ",e);
    const visibleRows = e.component.getVisibleRows();
    let sourceData = e.itemData;
    let { issues } = this.state;
    const sourceIndex = issues.indexOf(sourceData);

    if (e.dropInsideItem) {
      sourceData = { ...sourceData, Head_ID: visibleRows[e.toIndex].key };
      issues = [
        ...issues.slice(0, sourceIndex),
        sourceData,
        ...issues.slice(sourceIndex + 1),
      ];
    } else {
      const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
      let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;

      if (targetData && e.component.isRowExpanded(targetData.ID)) {
        sourceData = { ...sourceData, Head_ID: targetData.ID };
        targetData = null;
      } else {
        const headId = targetData ? targetData.Head_ID : -1;
        if (sourceData.Head_ID !== headId) {
          sourceData = { ...sourceData, Head_ID: headId };
        }
      }

      issues = [...issues.slice(0, sourceIndex), ...issues.slice(sourceIndex + 1)];

      const targetIndex = issues.indexOf(targetData) + 1;
      issues = [...issues.slice(0, targetIndex), sourceData, ...issues.slice(targetIndex)];
    }

    this.setState({
      issues,
    });
  }

  onAllowDropInsideItemChanged(args) {
    this.setState({
      allowDropInsideItem: args.value,
    });
  }

  onAllowReorderingChanged(args) {
    this.setState({
      allowReordering: args.value,
    });
  }

  onShowDragIconsChanged(args) {
    this.setState({
      showDragIcons: args.value,
    });
  }
}

export default App;
