import React, { useEffect, useRef, useState }  from 'react';
import { Button  as ActualButton } from 'devextreme-react/button';
import api, { route } from "@forge/api";
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
import {saveNewRow, savingDragandDrop} from "./service/saveData";
import {onDragChange, onReorder} from "./service/saveDnD";
import notify from 'devextreme/ui/notify';
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
  'Bug Fix Steps',
  ];


  const deleteRow = async (e) =>
  {
    console.log("0 inside deleteRow: ",e);
    notify("The selected issue is deleted successfully");
    //let afterDeleteRow = currentIssues.filter(y => y.id != deleteId);
  }

 

  return (
    <div>
        <div>
          <ActualButton type="success" onClick={handleClickSearch} >
              <LoadIndicator className="button-indicator" height={20} width={20} visible={searchButton.loadIndicatorVisible} />
              <span className="dx-button-text">{searchButton.buttonText}</span>
          </ActualButton>
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
                  <Button name="add"  type="success" stylingMode="contained" />
                  <Button name="edit" type="default" stylingMode="contained" />
                  <Button name="delete" type="danger" stylingMode="contained" onClick={deleteRow} />
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