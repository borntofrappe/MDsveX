import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Node } from 'svast';
import { walk } from '../src/walk';
const svast_walk = suite('walk-tree');

svast_walk('walks a single node', () => {
	const node = {
		type: 'hi',
	};

	let _t;
	let _n;
	walk(node, (node, parent) => {
		_t = node.type;
		_n = node;
	});

	assert.is(_t, 'hi');
	assert.is(_n, node);
});

svast_walk('Root node should have an undefined parent', () => {
	const node = {
		type: 'hi',
	};

	let _p;
	walk(node, (_, parent) => {
		_p = parent;
	});

	assert.is(_p, undefined);
});

svast_walk('walks child nodes', () => {
	const tree = {
		type: 'hi',
		children: [
			{
				type: '1',
			},
			{
				type: '2',
			},
			{
				type: '3',
			},
			{
				type: '4',
			},
			{
				type: '5',
			},
		],
	};

	const _t: string[] = [];
	walk(tree, (node, parent) => {
		_t.push(node.type);
	});

	assert.equal(_t, ['hi', '1', '2', '3', '4', '5']);
});

svast_walk('parent is correctly passed', () => {
	const tree = {
		type: 'hi',
		children: [
			{
				type: '1',
			},
			{
				type: '2',
			},
			{
				type: '3',
			},
			{
				type: '4',
			},
			{
				type: '5',
			},
		],
	};

	let _p;
	walk(tree, (node, parent) => {
		if (node.type === '1') _p = parent;
	});

	assert.is(_p, tree);
});

svast_walk('parent is  correctly passed and modifier nodes are visited', () => {
	const tree = {
		type: 'hi',
		modifiers: [
			{
				type: '1',
			},
			{
				type: '2',
			},
			{
				type: '3',
			},
			{
				type: '4',
			},
			{
				type: '5',
			},
		],
	};

	let _p;
	const _t: string[] = [];
	walk(tree, (node, parent) => {
		if (node.type === '1') _p = parent;
		_t.push(node.type);
	});

	assert.is(_p, tree);
	assert.equal(_t, ['hi', '1', '2', '3', '4', '5']);
});

svast_walk('parent is  correctly passed and value nodes are visited', () => {
	const tree = {
		type: 'hi',
		value: [
			{
				type: '1',
			},
			{
				type: '2',
			},
			{
				type: '3',
			},
			{
				type: '4',
			},
			{
				type: '5',
			},
		],
	};

	let _p;
	const _t: string[] = [];
	walk(tree, (node, parent) => {
		if (node.type === '1') _p = parent;
		_t.push(node.type);
	});

	assert.is(_p, tree);
	assert.equal(_t, ['hi', '1', '2', '3', '4', '5']);
});

svast_walk('parent is  correctly passed and property nodes are visited', () => {
	const tree = {
		type: 'hi',
		properties: [
			{
				type: '1',
			},
			{
				type: '2',
			},
			{
				type: '3',
			},
			{
				type: '4',
			},
			{
				type: '5',
			},
		],
	};

	let _p;
	const _t: string[] = [];
	walk(tree, (node, parent) => {
		if (node.type === '1') _p = parent;
		_t.push(node.type);
	});

	assert.is(_p, tree);
	assert.equal(_t, ['hi', '1', '2', '3', '4', '5']);
});

svast_walk('parent is  correctly passed and branch nodes are visited', () => {
	const tree = {
		type: 'hi',
		branches: [
			{
				type: '1',
			},
			{
				type: '2',
			},
			{
				type: '3',
			},
			{
				type: '4',
			},
			{
				type: '5',
			},
		],
	};

	let _p;
	const _t: string[] = [];
	walk(tree, (node, parent) => {
		if (node.type === '1') _p = parent;
		_t.push(node.type);
	});

	assert.is(_p, tree);
	assert.equal(_t, ['hi', '1', '2', '3', '4', '5']);
});

svast_walk(
	'parent is  correctly passed and expression nodes are visited',
	() => {
		const tree = {
			type: 'hi',
			expression: {
				type: '1',
			},
		};

		let _p;
		const _t: string[] = [];
		walk(tree, (node, parent) => {
			if (node.type === '1') _p = parent;
			_t.push(node.type);
		});

		assert.is(_p, tree);
		assert.equal(_t, ['hi', '1']);
	}
);

svast_walk(
	'parent is  correctly passed and non-array value nodes are visited',
	() => {
		const tree = {
			type: 'hi',
			value: {
				type: '1',
			},
		};

		let _p;
		const _t: string[] = [];
		walk(tree, (node, parent) => {
			if (node.type === '1') _p = parent;
			_t.push(node.type);
		});

		assert.is(_p, tree);
		assert.equal(_t, ['hi', '1']);
	}
);

svast_walk('a more complex node', () => {
	const leaf = { type: 'leaf' };
	const has_child = { type: 'haschild1', children: [leaf] };
	const has_child2 = { type: 'haschild2', children: [has_child] };
	const has_child3 = { type: 'haschild3', children: [has_child2] };
	const tree = {
		type: 'hi',
		children: [has_child3],
	};

	const _p: (Node | undefined)[] = [];
	const _t: string[] = [];
	walk(tree, (node, parent) => {
		_p.push(parent);
		_t.push(node.type);
	});

	assert.is(_p[0], undefined);
	assert.is(_p[1], tree);
	assert.is(_p[2], has_child3);
	assert.is(_p[3], has_child2);
	assert.is(_p[4], has_child);
	assert.equal(_t, ['hi', 'haschild3', 'haschild2', 'haschild1', 'leaf']);
});

svast_walk('returning false prevents child nodes from being walked', () => {
	const leaf = { type: 'leaf' };
	const leaf2 = { type: 'leaf' };
	const has_child = { type: 'haschild1', children: [leaf] };
	const has_child2 = { type: 'haschild2', children: [leaf2] };
	const tree = {
		type: 'hi',
		children: [has_child, has_child2],
	};

	const _p: (Node | undefined)[] = [];
	const _t: string[] = [];
	walk(tree, (node, parent) => {
		_p.push(parent);
		_t.push(node.type);
		if (parent === tree) return false;
	});

	assert.is(_p[0], undefined);
	assert.is(_p[1], tree);
	assert.is(_p[2], tree);
	assert.is(_p.length, 3);
	assert.is(_p[3], undefined);
	assert.equal(_t, ['hi', 'haschild1', 'haschild2']);
});

svast_walk.run();
