import * as React from "react";
import {
  DropDownButton,
  DropDownButtonItem,
} from "@progress/kendo-react-buttons";
import { issueType } from "./issueType";
export default function MyCommandCell(
  enterEdit,
  remove,
  save,
  cancel,
  addChild,
  editField,
  bundleSave,
  viewDetails
) {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    render() {
      const { dataItem } = this.props;
      return dataItem[editField] ? (
        <td>
          <button
            id={dataItem.key}
            ref={(ele) => (bundleSave.current[dataItem.key] = ele)}
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={() => save(dataItem)}
          >
            {<span class="k-icon k-i-check"></span>}
          </button>
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={() => cancel(dataItem)}
          >
            <span class="k-icon k-i-cancel-outline"></span>
          </button>
        </td>
      ) : (
        <td>
          <DropDownButton
            themeColor="info"
            icon={"k-icon k-i-plus"}
            onItemClick={(event) => addChild(dataItem, event.item.id)}
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
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
            onClick={() => enterEdit(dataItem)}
          >
            <span class="k-icon k-i-edit"></span>
          </button>
          {dataItem.issues !== undefined && (
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={() => viewDetails(dataItem)}
            >
              <span class="k-icon k-i-preview"></span>
            </button>
          )}
        </td>
      );
    }
  };
}
