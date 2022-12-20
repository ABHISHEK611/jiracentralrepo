import React, { useState, Fragment } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable
  // Form,
  // InputNumber,
  // Input
} from "react-beautiful-dnd";
import { Form, Input, InputNumber } from "antd";
import { render } from "react-dom";

export const customTableWrapper = (props) => (
  <Droppable droppableId="droppable" isCombineEnabled>
    {(provided) => (
      <Fragment>
        <tbody
          ref={provided.innerRef}
          {...props}
          {...provided.droppableProps}
        ></tbody>
        <tfoot>{provided.placeholder}</tfoot>
      </Fragment>
    )}
  </Droppable>
);

export const customTableRow = ({ index, record, ...restProps }) => {
  return (
    <Draggable key={record.key} draggableId={record.key} index={index}>
      {(provided) => (
        <tr
          key={record.key}
          ref={provided.innerRef}
          {...restProps}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="row-item"
        />
      )}
    </Draggable>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
export const components = {
  body: {
    // Custom tbody
    wrapper: customTableWrapper,
    // Custom row
    row: customTableRow,
    // Editable row
    cell: EditableCell
  }
};
