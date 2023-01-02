import React from 'react';
import { TreeList, Column, RowDragging, ColumnChooser, Editing, RequiredRule, Lookup, Button, } 
from 'devextreme-react/tree-list';
import CheckBox from 'devextreme-react/check-box';
import { SelectBox } from 'devextreme-react/select-box';
import { fetchIssueList } from './data.js';
//import {issues as issueList} from './data.js';

const expandedRowKeys = [1];

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

  async componentDidMount(){

    let a=0;
    let issues1 = [];
    let idCount = 1;
    let headCount = -1;
    let x = await fetchIssueList();
    console.log("1 inside componentDidMount: ",x);
    let y = x.issues.map((element) => {
      console.log("1.5 inside componentDidMount: ",element);
      debugger;
          let item = {
                ID: element.id,
                Head_ID: -1,
                Issue_Key: element.key,
                Issue_Type: element.fields.issuetype.name,
                Summary: element.fields.summary,
                Assignee: (element.fields.assignee === null? "Unassigned":element.fields.assignee.displayName),
                Reporter: element.fields.reporter.displayName,
                Priority: element.fields.priority.name,
            }
          console.log("2 inside componentDidMount: ",JSON.stringify(item));
          //issues1.push(item);
          idCount = idCount +1;
          if(headCount === -1)
          {
            headCount = headCount +2;
          }
        console.log("3 inside componentDidMount: ",JSON.stringify(issues1));
        return item;
      });
      console.log("4 inside componentDidMount new test: ",y);
        this.setState({
          issues:y,
        })
 }
// const getHeadId = async (element) => {
//   console.log("1 inside getId: ",element)
//           if(element.fields.issuelinks.length === 0)
//             {
//               console.log("1.1 inside getId: ");
//               return -1;
//             }
//           else
//             {
//              if (element.fields.issuelinks[0].outwardIssue)
//                   {
//                     console.log("1.1 inside getId inside else inside if: ");
//                     return element.fields.issuelinks[0].outwardIssue.id
//                   }
//                 else {
//                   console.log("1.1 inside getId inside else inside else: ");
//                     return -1;
//                 }
            
//             }
//         }
//   }


  render() {
    const { mode, allowSearch } = this.state;
    
    const saveConfig = (e) => {
      console.log("save",e);
    }

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
          onEditorPreparing={this.onEditorPreparing}
          onInitNewRow={this.onInitNewRow}
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
            mode="row" />

          <Column allowHiding={false} dataField="Issue_Key"> <RequiredRule /> </Column>
          <Column allowHiding={false} dataField="Issue_Type"> <RequiredRule /> </Column>
          <Column dataField="Summary"> <RequiredRule />  </Column>
          <Column dataField="Assignee"> <RequiredRule />  </Column>
          <Column dataField="Priority"> <RequiredRule /> </Column>
          <Column type="buttons" caption="Actions">
            <Button name="edit" />
            <Button name="delete" />
          </Column>
          <ColumnChooser enabled={true} allowSearch={allowSearch} mode={mode} />
        </TreeList>

        {/* <div className="options">
          <div className="caption">Options</div>
          <div className="options-container">
            <div className="option">
              <CheckBox
                value={this.state.allowDropInsideItem}
                text="Allow Drop Inside Item"
                onValueChanged={this.onAllowDropInsideItemChanged}
              />
            </div>
            <div className="option">
              <CheckBox
                value={this.state.allowReordering}
                text="Allow Reordering"
                onValueChanged={this.onAllowReorderingChanged}
              />
            </div>
            <div className="option">
              <CheckBox
                value={this.state.showDragIcons}
                text="Show Drag Icons"
                onValueChanged={this.onShowDragIconsChanged}
              />
            </div>
          </div>
        </div> */}
      </div>
    );
  }

  onEditorPreparing(e) {
    if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
      e.cancel = true;
    }
  }

  onInitNewRow(e) {
    e.data.Head_ID = 1;
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
