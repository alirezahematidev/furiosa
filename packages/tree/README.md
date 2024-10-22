# 🌳 Treekit

### Are you feeling stuck when working with tree data structures?

Discover **Treekit**, your go-to tool for effortlessly manipulating tree data structures. With streamlined methods, it simplifies tasks such as rearranging and updating nodes within your hierarchical data.

[![Version][version-badge]][package]

[version-badge]: https://img.shields.io/npm/v/@furiosa/tree
[package]: https://www.npmjs.com/package/@furiosa/tree

## Documentation

coming soon...

## Installation

To install Treekit, run the following commands

```bash
  npm install --save @furiosa/tree
```

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Usage

```js
import Tree from "@furiosa/tree";

const data = [
  // your tree data
];

const {insert, move, ...} = new Tree(data);
```

Also you can directly import the methods to use

```js
import {insert, move, ...} "@furiosa/tree/functions";

const data = [
  // your tree data
];

```
