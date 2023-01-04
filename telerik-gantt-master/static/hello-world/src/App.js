import React, {useState} from 'react';
import {getter, guid, clone} from '@progress/kendo-react-common';
import {
    Gantt,
    GanttWeekView,
    GanttMonthView,
    GanttDayView,
    GanttYearView,
    filterBy,
    orderBy,
    mapTree,
    extendDataItem,
    GanttTextFilter,
    GanttDateFilter,
    addTask,
    updateTask,
    removeTask,
    addDependency,
    GanttForm,
    GanttRemoveDialog
} from '@progress/kendo-react-gantt';

import {exampleDependencyData, exampleTaskData} from "./data";
import issuesData, {findChildByJql} from "./service";

const ganttStyle = {
    height: '100%',
    width: '100%',
};
const
    taskModelFields = {
        id: 'key',
        start: 'start',
        end: 'end',
        title: 'title',
        percentComplete: 'percentComplete',
        isRollup: 'isRollup',
        isExpanded: 'isExpanded',
        isInEdit: 'isInEdit',
        children: 'children',
        isSelected: 'isSelected'
    };
const dependencyModelFields = {
    id: 'id',
    fromId: 'fromId',
    toId: 'toId',
    type: 'type'
};
const getTaskId = getter(taskModelFields.id);
const columns = [{
    field: taskModelFields.id,
    title: 'KEY',
    width: 120
}, {
    field: taskModelFields.title,
    title: 'Title',
    expandable: true,
    width: 200,
    filter: GanttTextFilter
}, {
    field: taskModelFields.start,
    title: 'Start',
    width: 120,
    format: '{0:MM/dd/yyyy}',
    filter: GanttDateFilter
}, {
    field: taskModelFields.end,
    title: 'End',
    width: 120,
    format: '{0:MM/dd/yyyy}',
    filter: GanttDateFilter
}];
const loadingPanel = (
    <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image"></div>
        <div className="k-loading-color"></div>
    </div>
);
const existIssue = async (source, key) => {
    for (const item of source) {
        if (item.key === key)
            return true;
        // Item not returned yet. Search its children by recursive call.
        if (item.children !== undefined) {
            let subresult = await existIssue(item.children, key);
            // If the item was found in the subchildren, return it.
            if (subresult)
                return true;
        }
    }
    // Nothing found yet? return false.
    return false;
}

function App() {
    const [taskData, setTaskData] = useState([]);
    const [loading, setLoading] = useState(true);
    if (taskData.length === 0) {
        issuesData().then(value => {
            setTaskData(value)
            setLoading(false)
        })
    }
    const [dependencyData, setDependencyData] = useState(exampleDependencyData);
    const [expandedState, setExpandedState] = useState([7, 11, 12, 13]);
    const [selectedIdState, setSelectedIdState] = useState(null);
    const [editItem, setEditItem] = useState(null);
    const [removeItem, setRemoveItem] = useState(null);
    const [dataState, setDataState] = useState({
        sort: [],
        filter: []
    });
    const onDataStateChange = React.useCallback(event => setDataState(event.dataState), [setDataState]);
    const onExpandChange = React.useCallback(event => {
        if (event.value === false) {
            setLoading(true)
            let issue = event.dataItem;
            console.log(taskData)
            Promise.all(issue.children.map(async (child) => {
                let data = await findChildByJql(child);
                data.map(element => {
                    existIssue(taskData, element.key).then(found => {
                        if (!found) {
                            setTaskData(addTask({
                                direction: 'child',
                                selectedDataItem: child,
                                taskModelFields: taskModelFields,
                                dataTree: taskData,
                                defaultDataItem: {
                                    [taskModelFields.title]: element.title,
                                    [taskModelFields.id]: element.key,
                                    [taskModelFields.percentComplete]: 0
                                }
                            }))
                        }

                    })
                })
            })).then(() => setLoading(false));
        }
        const id = getTaskId(event.dataItem);
        const newExpandedState = event.value ? expandedState.filter(currentId => currentId !== id) : [...expandedState, id];
        setExpandedState(newExpandedState);
    }, [expandedState, setExpandedState, taskData]);
    const onSelect = React.useCallback(event => setSelectedIdState(getTaskId(event.dataItem)), [setSelectedIdState]);
    const onEdit = React.useCallback(event => setEditItem(clone(event.dataItem)), [setEditItem]);
    const onAdd = React.useCallback(event => {
        const {
            syntheticEvent,
            nativeEvent,
            target,
            ...others
        } = event;
        const newData = addTask({
            ...others,
            taskModelFields: taskModelFields,
            dataTree: taskData,
            defaultDataItem: {
                [taskModelFields.title]: 'New task',
                [taskModelFields.id]: guid(),
                [taskModelFields.percentComplete]: 0
            }
        });
        setTaskData(newData);
    }, [taskData]);
    const onFormSubmit = React.useCallback(event => {
        const newData = updateTask({
            updatedDataItem: event.dataItem,
            taskModelFields: taskModelFields,
            dataTree: taskData
        });
        setEditItem(null);
        setTaskData(newData);
    }, [taskData, setTaskData, setEditItem]);
    const onFormCancel = React.useCallback(() => setEditItem(null), [setEditItem]);
    const onRemove = React.useCallback(event => setRemoveItem(event.dataItem), [setRemoveItem]);
    const onRemoveConfirm = React.useCallback(event => {
        const newData = removeTask({
            removedDataItem: event.dataItem,
            taskModelFields: taskModelFields,
            dataTree: taskData
        });
        setRemoveItem(null);
        setTaskData(newData);
    }, [taskData, setTaskData, setRemoveItem]);
    const onRemoveCancel = React.useCallback(() => setRemoveItem(null), [setRemoveItem]);
    const onDependencyCreate = React.useCallback(event => {
        const newData = addDependency({
            dependencyData,
            fromId: event.fromId,
            toId: event.toId,
            type: event.type,
            dependencyModelFields,
            defaultDataItem: {
                [dependencyModelFields.id]: guid()
            }
        });
        setDependencyData(newData);
    }, [setDependencyData, dependencyData]);
    const processedData = React.useMemo(() => {
        const filteredData = filterBy(taskData, dataState.filter, taskModelFields.children);
        const sortedData = orderBy(filteredData, dataState.sort, taskModelFields.children);
        return mapTree(sortedData, taskModelFields.children, task => extendDataItem(task, taskModelFields.children, {
            [taskModelFields.isExpanded]: expandedState.includes(getTaskId(task)),
            [taskModelFields.isSelected]: selectedIdState === getTaskId(task)
        }));
    }, [taskData, dataState, expandedState, selectedIdState]);

    return (
        <div>
            {loading && loadingPanel}
            <Gantt
                style={ganttStyle}
                taskData={processedData}
                taskModelFields={taskModelFields}
                dependencyData={dependencyData}
                dependencyModelFields={dependencyModelFields}
                columns={columns}
                reorderable={true}
                sortable={true}
                sort={dataState.sort}
                filter={dataState.filter}
                navigatable={true}
                onExpandChange={onExpandChange}
                onDataStateChange={onDataStateChange}
                toolbar={{
                    addTaskButton: true
                }}
                onAddClick={onAdd}
                onTaskClick={onSelect}
                onRowClick={onSelect}
                onTaskDoubleClick={onEdit}
                onRowDoubleClick={onEdit}
                onTaskRemoveClick={onRemove}
                onDependencyCreate={onDependencyCreate}>
                <GanttWeekView/>
                <GanttDayView/>
                <GanttMonthView/>
                <GanttYearView/>
            </Gantt>
            {editItem &&
                <GanttForm dataItem={editItem} onSubmit={onFormSubmit} onCancel={onFormCancel} onClose={onFormCancel}/>}
            {removeItem &&
                <GanttRemoveDialog dataItem={removeItem} onConfirm={onRemoveConfirm} onCancel={onRemoveCancel}
                                   onClose={onRemoveCancel}/>}
        </div>
    );
}

export default App;
