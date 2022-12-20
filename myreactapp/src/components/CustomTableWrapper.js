import React, { useState, Fragment } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { EditableCell } from "./Editablecell.js";

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
