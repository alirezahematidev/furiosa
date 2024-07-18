import { Callback, CallbackWithError, TreeNode, Replacer, TreeImpl, TreeLike, MaybeNode, TreeOptions } from '$core/index';
import * as functions from './functions';
import * as utils from './utils';
import { nonUniqueTreeWarning, safeError } from './helpers';

class Tree<T extends TreeNode> implements TreeImpl<T> {
  private readonly tree: ReadonlyArray<T> = [];

  private currentTree: T[] = [];

  private listener: Callback<T> | undefined;

  constructor(tree: T[], options: TreeOptions<T> = {}) {
    nonUniqueTreeWarning(tree, 'constructor');

    this.tree = tree;

    this.currentTree = tree;

    this.listener = options.listener;
  }

  private listen(callback: Callback<T>) {
    return (tree: readonly T[]) => {
      try {
        callback(tree);

        if (this.listener) this.listener(tree);
      } catch (error) {
        safeError(error, 'An error occured while listening to update.');
      }
    };
  }

  private safeListen(callback: CallbackWithError<T>) {
    return (tree: readonly T[], error: Error | undefined) => {
      try {
        callback(tree, error);

        if (this.listener) this.listener(tree);
      } catch (_error) {
        callback(tree, _error instanceof Error ? _error : error);

        if (error) return console.error(error.message);

        safeError(_error, 'An error occured while listening to update.');
      }
    };
  }

  public get originalTree() {
    return this.tree;
  }

  public getTree() {
    return this.currentTree;
  }

  public find(id: string): MaybeNode<T> {
    return functions.find(this.currentTree, id);
  }

  public getPath(id: string): string[] {
    return utils.getPath(this.currentTree, id);
  }

  public get size() {
    return utils.size(this.currentTree);
  }

  public remove(id: string): typeof this;
  public remove(id: string, callback: Callback<T>): void;
  public remove(id: string, callback?: Callback<T>) {
    if (callback) return void functions.remove(this.tree, id, this.listen(callback));

    const update = functions.remove(this.currentTree, id);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while removing a node.');
    }

    this.currentTree = update;

    return this;
  }

  public safeRemove(id: string): typeof this;
  public safeRemove(id: string, callback: CallbackWithError<T>): void;
  public safeRemove(id: string, callback?: CallbackWithError<T>) {
    if (callback) return void functions.safeRemove(this.tree, id, this.safeListen(callback));

    const update = functions.safeRemove(this.currentTree, id);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while removing a node.');
    }

    this.currentTree = update;

    return this;
  }

  public insert(destination: string | null, data: TreeLike<T>): typeof this;
  public insert(destination: string | null, data: TreeLike<T>, callback: Callback<T>): void;
  public insert(destination: string | null, data: TreeLike<T>, callback?: Callback<T>) {
    if (callback) return void functions.insert(this.tree, destination, data, this.listen(callback));

    const update = functions.insert(this.currentTree, destination, data);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while inserting a node.');
    }

    this.currentTree = update;

    return this;
  }

  public safeInsert(destination: string | null, data: TreeLike<T>): typeof this;
  public safeInsert(destination: string | null, data: TreeLike<T>, callback: CallbackWithError<T>): void;
  public safeInsert(destination: string | null, data: TreeLike<T>, callback?: CallbackWithError<T>) {
    if (callback) return void functions.safeInsert(this.tree, destination, data, this.safeListen(callback));

    const update = functions.safeInsert(this.currentTree, destination, data);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while inserting a node.');
    }

    this.currentTree = update;

    return this;
  }

  public move(from: string, to: string | null): typeof this;
  public move(from: string, to: string | null, callback: Callback<T>): void;
  public move(from: string, to: string | null, callback?: Callback<T>) {
    if (callback) return void functions.move(this.tree, from, to, this.listen(callback));

    const update = functions.move(this.currentTree, from, to);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while moving a node.');
    }

    this.currentTree = update;

    return this;
  }

  public safeMove(from: string, to: string | null): typeof this;
  public safeMove(from: string, to: string | null, callback: CallbackWithError<T>): void;
  public safeMove(from: string, to: string | null, callback?: CallbackWithError<T>) {
    if (callback) return void functions.safeMove(this.tree, from, to, this.safeListen(callback));

    const update = functions.safeMove(this.currentTree, from, to);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while moving a node.');
    }

    this.currentTree = update;

    return this;
  }

  public replace(target: string, replacer: Replacer<T>): typeof this;
  public replace(target: string, replacer: Replacer<T>, callback: Callback<T>): void;
  public replace(target: string, replacer: Replacer<T>, callback?: Callback<T>) {
    if (callback) return void functions.replace(this.tree, target, replacer, this.listen(callback));

    const update = functions.replace(this.currentTree, target, replacer);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while replacing a node.');
    }

    this.currentTree = update;

    return this;
  }

  public safeReplace(target: string, replacer: Replacer<T>): typeof this;
  public safeReplace(target: string, replacer: Replacer<T>, callback: CallbackWithError<T>): void;
  public safeReplace(target: string, replacer: Replacer<T>, callback?: CallbackWithError<T>) {
    if (callback) return void functions.safeReplace(this.tree, target, replacer, this.safeListen(callback));

    const update = functions.safeReplace(this.currentTree, target, replacer);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while replacing a node.');
    }

    this.currentTree = update;

    return this;
  }

  public swap(from: string, to: string): typeof this;
  public swap(from: string, to: string, callback: Callback<T>): void;
  public swap(from: string, to: string, callback?: Callback<T>) {
    if (callback) return void functions.swap(this.tree, from, to, this.listen(callback));

    const update = functions.swap(this.currentTree, from, to);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while swaping a node.');
    }

    this.currentTree = update;

    return this;
  }

  public safeSwap(from: string, to: string): typeof this;
  public safeSwap(from: string, to: string, callback: CallbackWithError<T>): void;
  public safeSwap(from: string, to: string, callback?: CallbackWithError<T>) {
    if (callback) return void functions.safeSwap(this.tree, from, to, this.safeListen(callback));

    const update = functions.safeSwap(this.currentTree, from, to);

    try {
      if (this.listener) this.listener(update);
    } catch (error) {
      safeError(error, 'An error occured while swaping a node.');
    }

    this.currentTree = update;

    return this;
  }
}

export { Tree };
