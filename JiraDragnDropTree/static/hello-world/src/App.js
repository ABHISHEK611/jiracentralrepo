import React from 'react';
import { TreeList, Column, ColumnChooser } from 'devextreme-react/tree-list';
import { SelectBox } from 'devextreme-react/select-box';
import { CheckBox } from 'devextreme-react/check-box';
import { employees } from './demo-data/data.js';

const columnChooserModes = [{
  key: 'dragAndDrop',
  name: 'Drag and drop',
}, {
  key: 'select',
  name: 'Select',
}];

const expandedRowKeys = [1];
 
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: columnChooserModes[0].key,
      allowSearch: true,
    };

    this.onModeValueChanged = this.onModeValueChanged.bind(this);
    this.onAllowSearchValueChanged = this.onAllowSearchValueChanged.bind(this);
  }

  render() {
    const { mode, allowSearch } = this.state;

    return (
      <div>
        <TreeList
          id="employees"
          dataSource={employees}
          columnAutoWidth={true}
          showRowLines={true}
          showBorders={true}
          defaultExpandedRowKeys={expandedRowKeys}
          keyExpr="ID"
          parentIdExpr="Head_ID"
        >
          
          <Column allowHiding={false} dataField="Issue_Key" />
          <Column dataField="Issue_Type" />
          <Column dataField="Summary" />
          <Column dataField="Reporter" />
          <Column visible={false} dataField="Assignee" />
          <Column dataField="Sprint" />
          <ColumnChooser enabled={true} allowSearch={allowSearch} mode={mode} />
        </TreeList>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <span>Column chooser mode</span>
            &nbsp;
            <SelectBox
              items={columnChooserModes}
              value={mode}
              valueExpr="key"
              displayExpr="name"
              onValueChanged={this.onModeValueChanged}
            />
          </div>
          <div className="option">
            <CheckBox
              id="allowSearch"
              defaultValue={allowSearch}
              text="Allow search"
              onValueChanged={this.onAllowSearchValueChanged}
            />
          </div>
        </div>
      </div>
    );
  }

  onModeValueChanged(e) {
    this.setState({
      mode: e.value,
    });
  }

  onAllowSearchValueChanged(e) {
    this.setState({
      allowSearch: e.value,
    });
  }
}

export default App;
