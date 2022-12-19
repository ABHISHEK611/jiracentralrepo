export const data = [
  {
    key: "KEY-1",
    parent: "root",
    type: "Feature",
    summary: "Summary of Feature",
    storypoint: 8,
    assignee: "Raj",
    status: "In Progress",
    children: [
      {
        key: "KEY-4",
        parent: "KEY-1",
        type: "Story",
        summary: "Summary of Story",
        storypoint: 5,
        assignee: "Raj",
        status: "In Progress",
        children: [
          {
            key: "KEY-6",
            parent: "KEY-4",
            type: "Task",
            summary: "Summary of Task",
            storypoint: 5,
            assignee: "Raj",
            status: "In Progress"
          }
        ]
      },
      {
        key: "KEY-5",
        parent: "KEY-1",
        type: "Story",
        summary: "Summary of Story",
        storypoint: 3,
        assignee: "Raj",
        status: "Open"
      }
    ]
  },
  {
    key: "KEY-2",
    parent: "root",
    type: "Feature",
    summary: "Summary of Feature",
    storypoint: 3,
    assignee: "Thanh",
    status: "Open"
  },
  {
    key: "KEY-3",
    parent: "root",
    type: "Feature",
    summary: "Summary of Feature",
    storypoint: 5,
    assignee: "Thanh",
    status: "Closed"
  }
];
