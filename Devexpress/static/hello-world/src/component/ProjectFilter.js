import { useEffect, useState } from "react";
import DropDownBox from 'devextreme-react/drop-down-box';
import CustomStore from 'devextreme/data/custom_store';
import { getAllProject } from "../data/ManageData";


const ProjectFilter = (props) => {
    let state = {
        treeBoxValue: []
      };
      let treeDataSource = makeAsyncDataSource();

    const makeAsyncDataSource = () => {
        return new CustomStore({
          loadMode: 'raw',
          key: 'ID',
          load() {
            return getAllProject()
          },
        });
      }

    return (
        <div className="dx-field-value">
            <DropDownBox
              value={state.treeBoxValue}
              valueExpr="key"
              displayExpr="name"
              labelMode={"floating"}
              label='Select project'
              showClearButton={true}
              dataSource={this.treeDataSource}
              onValueChanged={this.syncTreeViewSelection}
              contentRender={this.treeViewRender}
            />
          </div>
    )
};
export default ProjectFilter;