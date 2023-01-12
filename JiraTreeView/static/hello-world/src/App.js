import React, { useEffect, useRef, useState }  from 'react';
import { Button } from 'devextreme-react/button';
import { LoadIndicator } from 'devextreme-react/load-indicator';
import {
  TreeList,
  ColumnChooser,
  ColumnFixing,
  Column,
  RequiredRule,
  FilterRow,
  SearchPanel,
  Selection,
  Editing,
  RowDragging, 
  Paging
} from 'devextreme-react/tree-list';
import {issues} from "./data/manageData";

const expandedRowKeys = [1];

const issuestype = [
  'Story',
  'Bug',
  'Task',
  'SubTask',
  'Bug Fix Steps',
];


function App() {

  console.log("1 inside app");
  //const [currentIssues, setCurrentIssues] = useState(null);
  let response = issues();
  const [currentIssues, setCurrentIssues] = useState(response.result);
  //setCurrentIssues(response.result);
  console.log("2 inside app");

  const onDragChange = (e) => {
    let visibleRows = e.component.getVisibleRows(),
      sourceNode = e.component.getNodeByKey(e.itemData.ID),
      targetNode = visibleRows[e.toIndex].node;

    while (targetNode && targetNode.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

  const onReorder = (e) => {
    let visibleRows = e.component.getVisibleRows(),
      sourceData = e.itemData,
      targetData = visibleRows[e.toIndex].data,
      issuesReordered = currentIssues,
      sourceIndex = issuesReordered.indexOf(sourceData),
      targetIndex = issuesReordered.indexOf(targetData);

    if (e.dropInsideItem) {
      sourceData = { ...sourceData, HeadID: targetData.ID };
      issuesReordered = [...issuesReordered.slice(0, sourceIndex), sourceData, ...issuesReordered.slice(sourceIndex + 1)];
    } else {
      if (sourceData.HeadID !== targetData.HeadID) {
        sourceData = { ...sourceData, HeadID: targetData.HeadID };
        if (e.toIndex > e.fromIndex) {
          targetIndex++;
        }
      }
      issuesReordered = [...issuesReordered.slice(0, sourceIndex), ...issuesReordered.slice(sourceIndex + 1)];
      issuesReordered = [...issuesReordered.slice(0, targetIndex), sourceData, ...issuesReordered.slice(targetIndex)];
    }

    setCurrentIssues(issuesReordered);
  }

  return (
    
        <div>
          <TreeList
            id="issueList"
            dataSource={currentIssues}
            rootValue={-1}
            keyExpr="ID"
            parentIdExpr="HeadID"
            autoExpandAll={false} //changed from OG
            showRowLines={true}
            showBorders={true}
            allowColumnReordering={true}
            allowColumnResizing={true}
            columnAutoWidth={true}>

            <Column allowHiding={false} dataField="Issue_Key"> </Column>
            <Column allowHiding={false} dataField="Issue_Type"> <RequiredRule /> <Lookup dataSource={issuestype} /> </Column>
            <Column allowHiding={false} dataField="Summary"> <RequiredRule /> </Column>
            <Column dataField="Assignee"> <RequiredRule /> </Column>
            <Column dataField="Priority"> <RequiredRule /> </Column>

            {/*<ColumnFixing enabled={true} />*/}

            <ColumnChooser enabled={true} />
            <FilterRow visible={true} />
            <SearchPanel visible={true} />
            <Editing
              mode="popup"
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            />
            {/*<Selection mode="single" />*/}

            <RowDragging
              onDragChange={onDragChange}
              onReorder={onReorder}
              allowDropInsideItem={true}
              allowReordering={true}
              showDragIcons={false}
            />

            <Paging
              enabled={true}
              defaultPageSize={10} 
            />

          </TreeList>
        </div>
  );
}

export default App;