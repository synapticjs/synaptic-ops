import {expect} from 'chai';
import {GraphRecorder} from '../src';

describe('Graph Recorder', () => {
    describe('compiling to something that looks like lisp', () => {
        let graph;
        beforeEach(() => {
            graph = new GraphRecorder();
            graph.read(graph.float32matrix([2, 2]))
        });


        it('should return input', () => {
            graph.write(graph.vars[0]);

            expect(graph.compile()).to.deep.equal([
                ['allocate', [
                    [graph.vars[0], ['Float32Tensor', 4, [2, 2]]]
                ]],

                ['read', graph.vars[0]],
                ['write', graph.vars[0]]
            ])
        });

        it('should return input via clone - blas-style', () => {
            const x = graph.vars[0];
            const tempVar = graph.float32matrix([2, 2]);
            graph.blas.copy(x, tempVar);
            graph.write(tempVar);
            expect(graph.compile()).to.deep.equal([
                [graph._keywords.allocate, [
                    [graph.vars[0], ['Float32Tensor', 4, [2, 2]]],
                    [graph.vars[1], ['Float32Tensor', 4, [2, 2]]]
                ]],

                [graph._keywords.read, graph.vars[0]],
                ['blas.copy', graph.vars[0], graph.vars[1]],
                [graph._keywords.write, graph.vars[1]]
            ])
        });

        it('should support if', () => {
            const x = graph.vars[0];
            const condition = graph.float32();
            const scaler = graph.float32();
            graph.define(condition, 1);
            graph.define(scaler, 0);

            graph.ifnot0(condition,
                () => graph.write(x),
                () => {
                    graph.blas.scal(scaler, x);
                    graph.write(x);
                });

            expect(graph.compile()).to.deep.equal([
                [graph._keywords.allocate, [
                    [graph.vars[0], ['Float32Tensor', 4, [2, 2]]],
                    [graph.vars[1], ['Float32', 1]],
                    [graph.vars[2], ['Float32', 1]]
                ]],

                [graph._keywords.define, graph.vars[1], 1],
                [graph._keywords.define, graph.vars[2], 0],

                [graph._keywords.read, graph.vars[0]],
                [graph._keywords.if,
                    graph.vars[1],
                    [graph._keywords.do, [
                        [graph._keywords.write, graph.vars[0]]
                    ]],
                    [graph._keywords.do, [
                        ['blas.scal', graph.vars[2], graph.vars[0]],
                        [graph._keywords.write, graph.vars[0]]
                    ]]
                ]
            ])
        });

        it('should be able to throw an error', () => {
            //todo matrices comparison
        })
    });
});