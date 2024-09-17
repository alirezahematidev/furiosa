import { Callback, TreeNode, Replacer, TreeImpl, TreeLike, TreeOptions, CurryFn, MaybeNode } from '$core/index';
import * as fns from './functions';
import { nonUniqueTreeWarning } from './helpers';

class Tree<T extends TreeNode> implements TreeImpl<T> {
  private readonly tree: ReadonlyArray<T> = [];

  private currentTree: T[] = [];

  private throwOnError: boolean | undefined = false;

  constructor(tree: T[], options: TreeOptions = {}) {
    nonUniqueTreeWarning(tree, 'constructor');

    this.tree = tree;

    this.currentTree = tree;

    this.throwOnError = options.throwOnError;

    this._bind();
  }

  private _bind() {
    this.find = this.find.bind(this);
    this.remove = this.remove.bind(this);
    this.insert = this.insert.bind(this);
    this.move = this.move.bind(this);
    this.replace = this.replace.bind(this);
    this.swap = this.swap.bind(this);
    this.getTree = this.getTree.bind(this);
  }

  private curry<T>(fn: CurryFn<T>) {
    return fn(this.throwOnError);
  }

  // public addListener(event: Uppercase<keyof TreeImpl<T>>, callback: (oldTree: T[], currentTree: T[]) => void) {
  //   this.emitter.addListener(event, callback);
  // }

  // public removeListener(event: Uppercase<keyof TreeImpl<T>>, callback: (oldTree: T[], currentTree: T[]) => void) {
  //   this.emitter.removeListener(event, callback);
  // }

  public get originalTree() {
    return this.tree;
  }

  public getTree() {
    return this.currentTree;
  }

  public find(id: string): MaybeNode<T> {
    return fns.find(this.currentTree, id);
  }

  public remove(id: string): typeof this;
  public remove(id: string, callback: Callback<T>): void;
  public remove(id: string, callback?: Callback<T>) {
    if (callback) return void this.curry(fns.remove(this.tree, id, callback));

    // const oldTree = this.currentTree;

    this.currentTree = this.curry(fns.remove(this.currentTree, id));

    return this;
  }

  public insert(destination: string | null, data: TreeLike<T>): typeof this;
  public insert(destination: string | null, data: TreeLike<T>, callback: Callback<T>): void;
  public insert(destination: string | null, data: TreeLike<T>, callback?: Callback<T>) {
    if (callback) return void this.curry(fns.insert(this.tree, destination, data, callback));

    // const oldTree = this.currentTree;

    this.currentTree = this.curry(fns.insert(this.currentTree, destination, data));

    return this;
  }

  public move(from: string, to: string | null): typeof this;
  public move(from: string, to: string | null, callback: Callback<T>): void;
  public move(from: string, to: string | null, callback?: Callback<T>) {
    if (callback) return void this.curry(fns.move(this.tree, from, to, callback));

    //  const oldTree = this.currentTree;

    this.currentTree = this.curry(fns.move(this.currentTree, from, to));

    return this;
  }

  public replace(target: string, replacer: Replacer<T>): typeof this;
  public replace(target: string, replacer: Replacer<T>, callback: Callback<T>): void;
  public replace(target: string, replacer: Replacer<T>, callback?: Callback<T>) {
    if (callback) return void this.curry(fns.replace(this.tree, target, replacer, callback));

    // const oldTree = this.currentTree;

    this.currentTree = this.curry(fns.replace(this.currentTree, target, replacer));

    return this;
  }

  public swap(from: string, to: string): typeof this;
  public swap(from: string, to: string, callback: Callback<T>): void;
  public swap(from: string, to: string, callback?: Callback<T>) {
    if (callback) return void this.curry(fns.swap(this.tree, from, to, callback));

    //  const oldTree = this.currentTree;

    this.currentTree = this.curry(fns.swap(this.currentTree, from, to));

    return this;
  }
}

export { Tree };
