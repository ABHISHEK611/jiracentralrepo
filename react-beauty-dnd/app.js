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
import { render } from "react-dom";

let flag = false;

const App = () => {
  const [tableData, setTableData] = useState(data);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
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
    console.log("Inside cancel");
    if (flag) {
      console.log("Inside cancel if");
      const found = tableData.find((obj) => {
        return obj.key === "";
      });
      deleteRow(found.key);
    } else {
      console.log("Inside cancel else");
      setEditingKey("");
    }
  };

  const save = async (key) => {
    console.log("inside save", key);

    // if (flag) {
    //   console.log("inside true");
    //   try {
    //     const row = form.validateFields();
    //     console.log("row:", row);

    //     const newData = [...data];
    //     const index = newData.findIndex((item) => key === item.key);
    //     if (index > -1) {
    //       const item = newData[index];
    //       newData.splice(index, 1, {
    //         ...item,
    //         ...row
    //       });
    //       setTableData(newData);
    //       setEditingKey("");
    //       // const newState = data.map((obj) => {
    //       //   if (obj.key === "") {
    //       //     return {
    //       //       ...obj,
    //       //       key: row.,
    //       //       name: row.name,
    //       //       age: row.age,
    //       //       address: row.address
    //       //     };
    //       //   }
    //       //   return obj;
    //       // });
    //       flag = false;
    //       // setTableData(newState);
    //     } else {
    //       newData.push(row);
    //       setTableData(newData);
    //       setEditingKey("");
    //     }
    //   } catch (errInfo) {
    //     console.log("Validate Failed:", errInfo);
    //   }
    // } else {
    console.log("inside else");
    try {
      const row = await form.validateFields();
      console.log("row", row);
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        console.log("inside if");
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        setTableData(newData);
        flag = false;
        setEditingKey("");
      } else {
        console.log("inside else");
        newData.push(row);
        setTableData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
    //}
  };

  const addRow = (record) => {
    console.log("add new row data", record.key);
    flag = true;

    const newData = {
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

  const deleteRow = async (key) => {
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
      render: (_, record) => {
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

  const mergedColumns = tableColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
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
          components={components}
          onRow={(record, index) => ({
            index,
            record
          })}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel
          }}
        />
      </Form>
    </DragDropContext>
  );
};

export default App;
