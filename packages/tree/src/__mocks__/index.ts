const TREE_DATA = [
  {
    id: '1',
    name: 'category-1',
    children: [
      {
        id: '3',
        name: 'sub-category-1',
        children: [
          {
            id: '5',
            name: 'sub-category-3',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'category-2',
    children: [
      {
        id: '4',
        name: 'sub-category-2',
        children: [],
      },
    ],
  },
];

const FLAT_DATA = [
  {
    id: '1',
    name: 'category-1',
    parentId: null,
  },
  {
    id: '3',
    name: 'sub-category-1',
    parentId: '1',
  },
  {
    id: '5',
    name: 'sub-category-3',
    parentId: '3',
  },
  {
    id: '2',
    name: 'category-2',
    parentId: null,
  },
  {
    id: '4',
    name: 'sub-category-2',
    parentId: '2',
  },
];

export { TREE_DATA, FLAT_DATA };
