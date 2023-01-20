import React, { useEffect, useRef, useState }  from 'react';
//import { Button } from 'devextreme-react/button';
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
  Paging,
  Lookup,
  Button
} from 'devextreme-react/tree-list';
import {issues} from "./data/manageData";
import { requestJira } from "@forge/bridge";

function App() {

  console.log("1 inside app");
  const [currentIssues, setCurrentIssues] = useState(null);
  console.log("2 inside app");
  
  const [searchButton, setsearchButton] = useState({
    loadIndicatorVisible: false,
    buttonText: 'Search',
  });

  const handleClickSearch = async () => {
    console.log("1 inside handleClickSearch");

    setsearchButton({
        loadIndicatorVisible: true,
        buttonText: 'Searching',
    });
    let response = await issues();
    setsearchButton({
        loadIndicatorVisible: false,
        buttonText: 'Refresh',
    });
    setCurrentIssues(response.result);
    await console.log("2 inside handleClickSearch",currentIssues);
  };

  const expandedRowKeys = [1];
  const mode = 'select';
  const issuestype = [
  'Story',
  'Bug',
  'Task',
  'SubTask',
  'Bug Fix Steps',
  ];

  const deleteRow = async (e) =>
  {
    console.log("0 inside deleteRow: ",e);
    //let afterDeleteRow = currentIssues.filter(y => y.id != deleteId);
  }

  const saveNewRow = async (e) =>
  {
    console.log("0 inside saveNewRow: ",e);
    console.log("1 inside saveNewRow: ",e.data.Summary);
    console.log("1.5 inside saveNewRow: ",e.data.Issue_Type); }
  //   let body = {
  //     fields: {
  //       summary: e.data.Summary,
  //       project: {
  //         key: "OEM",
  //       },
  //       issuetype: {
  //         name: e.data.Issue_Type,
  //       },
  //       assignee: {
  //         name: "Abhishek Srivastava",
  //       },
  //       "customfield_10042": "https://google.com",
  //       "customfield_10034": 8
  //     }
  //   };

  //   let body1 = JSON.stringify(body);
  //   console.log("2 inside addRow: ",JSON.stringify(body));
  //   const response = await requestJira('/rest/api/3/issue', {
  //     method: 'POST',
  //     headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //     },
  //     body: body1
  //   })
  // console.log(`Response: ${response.status} ${response.statusText}`);
  //}

  const savingDragandDrop = async (source, target) => {
    console.log("inside savingDragandDrop",currentIssues);
    console.log("0 inside savingDragandDrop",source);
    console.log("1 inside savingDragandDrop",target);
    console.log("2 inside savingDragandDrop",source.Issue_Key);
    console.log("3 inside savingDragandDrop",target.Issue_Key);
    let body = {
      "outwardIssue": {
          "key": target.Issue_Key
      },
      "inwardIssue": {
          "key": source.Issue_Key
      },
      "type": {
          "name": "Blocks"
      }
  }
  console.log("4 inside savingDragandDrop",JSON.stringify(body));
  try{
    const response = await requestJira(`/rest/api/3/issueLink`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
     })
    //console.log(`Response: ${response.status} ${response.statusText}`);
    //console.log(await response.text());
    console.log(JSON.stringify(response));
  }catch(err)
  {
    console.log("Error ",JSON.stringify(err));}
}

  const onDragChange = async (e) => {
    console.log("0 inside onDragChange",e);
    console.log("0.5 inside onDragChange",currentIssues);
    let visibleRows = e.component.getVisibleRows(),
      sourceNode = e.component.getNodeByKey(e.itemData.ID),
      targetNode = visibleRows[e.toIndex].node;

    console.log("1 inside onDragChange: ",visibleRows);
    console.log("2 inside onDragChange: ",sourceNode);
    console.log("3 inside onDragChange: ",targetNode);
    while (targetNode && targetNode.data) {
      if (targetNode.data.ID === sourceNode.data.ID) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

  const onReorder = async (e) => {
    console.log("0 inside onReorder",e);
    console.log("0.5 inside onReorder",currentIssues);
    let visibleRows = e.component.getVisibleRows(),
      sourceData = e.itemData,
      targetData = visibleRows[e.toIndex].data,
      issuesReordered = currentIssues,
      sourceIndex = issuesReordered.indexOf(sourceData),
      targetIndex = issuesReordered.indexOf(targetData);

    console.log("1 inside onReorder visible rows: ",visibleRows);
    console.log("2 inside onReorder source: ",sourceData);
    console.log("3 inside onReorder target: ",targetData);
    //console.log("4 inside onReorder: ",issuesReordered);
    console.log("5 inside onReorder sourceIndex: ",sourceIndex);
    console.log("6 inside onReorder targetIndex: ",targetIndex);
    if (e.dropInsideItem) {
      console.log("7 inside onReorder inside if:");
      sourceData = { ...sourceData, Head_ID: targetData.ID };
      issuesReordered = [...issuesReordered.slice(0, sourceIndex), sourceData, ...issuesReordered.slice(sourceIndex + 1)];
      savingDragandDrop(sourceData, targetData);
    }
    else {
      console.log("8 inside onReorder inside else:");
      if (sourceData.Head_ID !== targetData.Head_ID) 
      {
        console.log("9 inside onReorder inside else 1stif:");
        sourceData = { ...sourceData, Head_ID: targetData.Head_ID };
        if (e.toIndex > e.fromIndex) {
          console.log("10 inside onReorder inside else 2ndif:");
          targetIndex++;
        }
      }
      issuesReordered = [...issuesReordered.slice(0, sourceIndex), ...issuesReordered.slice(sourceIndex + 1)];
      console.log("11 inside onReorder inside else:",issuesReordered);
      issuesReordered = [...issuesReordered.slice(0, targetIndex), sourceData, ...issuesReordered.slice(targetIndex)];
      console.log("12 inside onReorder inside else:",issuesReordered);
    }
    setCurrentIssues(issuesReordered);
  }

  return (
    <div>
        <div>
          <Button type="success" onClick={handleClickSearch} >
              <LoadIndicator className="button-indicator" height={20} width={20} visible={searchButton.loadIndicatorVisible} />
              <span className="dx-button-text">{searchButton.buttonText}</span>
          </Button>
        </div>
        <div>
          <TreeList
            id="issueList"
            dataSource={currentIssues}
            rootValue={-1}
            keyExpr="ID"
            parentIdExpr="Head_ID"
            autoExpandAll={false} //changed from OG
            showRowLines={true}
            showBorders={true}
            allowColumnReordering={true}
            allowColumnResizing={false}
            columnAutoWidth={true}>

            <Column dataField="Issue_Key" allowHiding={false} allowEditing={false}> </Column>
            <Column dataField="Issue_Type" allowHiding={false}> <RequiredRule /> <Lookup dataSource={issuestype} />  </Column>
            <Column dataField="Summary" allowHiding={false}> <RequiredRule /> </Column>
            <Column dataField="Assignee"> <RequiredRule /> </Column>
            <Column dataField="Priority"> <RequiredRule /> </Column>
            <Column type="buttons" caption="Actions" allowHiding={false}>
                  <Button name="add" />
                  <Button name="edit" />
                  <Button name="delete" onClick={deleteRow} />
                  <Button name="save" onClick={saveNewRow} />
            </Column>
            {/* <ColumnFixing enabled={true} /> */}

            <ColumnChooser enabled={true} allowSearch={true} mode={mode}/>
            {/* <FilterRow visible={true} /> */}
            <SearchPanel visible={true} />
           

            <RowDragging
              onDragChange={onDragChange}
              onReorder={onReorder}
              allowDropInsideItem={true}
              allowReordering={true}
              showDragIcons={false}
            />

            <Editing
              mode="row"
              allowUpdating={true}
              allowDeleting={true}
              allowAdding={true}
            />

            <Paging
              enabled={true}
              defaultPageSize={10} 
            />

          </TreeList>
        </div>
    </div>
  );
}

export default App;