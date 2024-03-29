import React, { useState, Fragment } from "react";
import {
  Form,
  Table,
  Button,
  Typography,
  Popconfirm,
  Input,
  InputNumber
} from "antd";
import { data } from "./data/data.js";
import { searchTree, removeDraggingItem } from "./utility/utility.js";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { components } from "./components/CustomTableWrapper.js";

interface DataType {
  key: string;
  parent: string;
  type: string;
  summary: string;
  storypoint: number;
  assignee: string;
  status: string;
}
const App = () => {
  const [tableData, setTableData] = useState(data);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    console.log("record inside edit:", JSON.stringify(record));
    form.setFieldsValue({
      key: "",
      type: "",
      summary: "",
      storypoint: "",
      assignee: "",
      status: "",
      ...record
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    console.log("inside save", key);
    try {
      const row = (await form.validateFields()) as DataType;

      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        console.log("newData inside if:", JSON.stringify(newData));
        setTableData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        console.log("newData inside else:", JSON.stringify(newData));
        setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const addRow = (record: Partial<DataType>) => {
    console.log("add new row data", record.key);

    const newData: DataType = {
      key: "",
      parent: record.key,
      type: "",
      summary: "",
      storypoint: 0,
      assignee: "",
      status: ""
    };

    console.log("newdata:", newData);
    setTableData([newData, ...tableData]);
  };

  const deleteRow = async (key: React.Key) => {
    console.log("deleting a row key1:", key);

    const newData = [...tableData];
    const finalData = newData.filter((x) => x.key !== key);
    setTableData(finalData);
    console.log("deleting a row key2:", JSON.stringify(tableData));
  };

  const tableColumns = [
    {
      title: "Issue Key",
      dataIndex: "key",
      width: "15%",
      editable: true
    },
    {
      title: "Type",
      dataIndex: "type",
      width: "15%",
      editable: true
    },
    {
      title: "Summary",
      dataIndex: "summary",
      width: "25%",
      editable: true
    },
    {
      title: "Story point",
      dataIndex: "storypoint",
      width: "10%",
      editable: true
    },
    {
      title: "Assignee",
      dataIndex: "assignee",
      width: "15%",
      editable: true
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "25%",
      editable: true
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Typography.Link
              onClick={() => addRow(record)}
              style={{ marginRight: 8 }}
            >
              Add
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={() => deleteRow(record.key)}
              style={{ marginLeft: 8 }}
            >
              Delete
            </Typography.Link>
          </span>
        );
      }
    }
  ];

  const onDragEnd = (result) => {
    const { destination, source, draggableId, combine } = result;
    if (!combine) {
      // not implement drop in between rows
      console.log("not implement drop in between rows");
      return;
    }

    const newTableData = Array.from(tableData);
    debugger;
    let sourceItem = searchTree(newTableData, draggableId);
    if (sourceItem.parent === "root") {
      const index = newTableData.indexOf(sourceItem);
      newTableData.splice(index, 1);
    } else {
      let parentOfSurceItem = searchTree(newTableData, sourceItem.parent);
      removeDraggingItem(parentOfSurceItem, sourceItem);
    }

    if (combine) {
      // drop item on item
      let targetItem = searchTree(newTableData, combine.draggableId);
      // update parent of source
      sourceItem.parent = targetItem.key;
      if (targetItem.hasOwnProperty("children")) {
        targetItem.children.push(sourceItem);
      } else {
        targetItem.children = [sourceItem];
      }
    } else {
      // not implement drop in between rows
      console.log("drop");
      return;
    }
    setTableData(newTableData);
  };

  /*const onFinish = (values: any) => {
    console.log("Success:", values);

    const newData: DataType = {
      key: values.key,
      parent: "root",
      type: values.type,
      summary: values.summary,
      storypoint: values.storypoint,
      assignee: values.assignee,
      status: values.status
    };
    setTableData([...tableData, newData]);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };*/
  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === "storypoint" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h2>Hierarchy Plugin</h2>
      <Form form={form} component={false}>
        <Table
          dataSource={tableData}
          columns={mergedColumns}
          /*components={{
            body: {
              cell: EditableCell
            }
          }}*/
          components={components}
          onRow={(record, index) => ({
            index,
            record
          })}
          rowClassName="editable-row"
          pagination={false}
          // pagination={{
          //  onChange: cancel
          //}}
          /*components={components}
        onRow={(record, index) => ({
          index,
          record
        })}
        rowClassName="editable-row"
        pagination={false}*/
        />
      </Form>
    </DragDropContext>
  );
};

export default App;
