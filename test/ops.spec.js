// import {expect} from 'chai';
// import {GraphRecorder, ndarray, GraphExecutorScijs as GraphExecutor} from '../';
//
// describe('Computation Graph', () => {
//     describe('smokes', () => {
//         //noinspection JSCheckFunctionSignatures
//         const input = ndarray(new Float64Array([1, 2, 3, 4]), [2, 2]);
//         let graph;
//         beforeEach(() => {
//             graph = new GraphRecorder([
//                 GraphRecorder.ndarray(input.shape),
//             ])
//         });
//         afterEach(() => {
//             const generatorFn = new GraphExecutor(graph.compile());
//             const generator = generatorFn([input]);
//             const {value, done} = generator.next();
//             expect(done).to.equal(true);
//             expect(value.shape).to.deep.equal(input.shape);
//             expect(Array.from(value.data)).to.deep.equal(Array.from(input.data))
//         });
//
//
//         it('should return input', () => {
//             graph.output(graph.inputs[0]);
//         });
//         it('should return input via clone - blas-style', () => {
//             const [x] = graph.env;
//             const tempVar = GraphRecorder.ndarray([2, 2]);
//             graph.blas.copy(x, tempVar);
//             graph.output(tempVar);
//         });
//     });
//
//     /*it('should return a sum of inputs', () => {
//         const graph = new GraphRecorder([
//             GraphRecorder.ndarray,
//             GraphRecorder.ndarray,
//         ]);
//
//         const {X, Y} = graph.inputs;
//
//         const result = graph.sum(X, Y);
//
//         graph.output(result);
//
//         expect(graph.compile()).to.equal()
//     })*/
// });