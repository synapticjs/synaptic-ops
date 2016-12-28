// https://github.com/maryrosecook/littlelisp/blob/master/littlelisp.spec.js used as a reference

import {Interpreter} from '../src/common/lisp';
import {expect} from 'chai';

const interpreter = new Interpreter();
const interpret = code => interpreter.interpret(code);

describe('littleLisp', () => {
    describe('lists', () => {
        it('should return empty list', () => {
            expect(interpret(["list"])).to.deep.equal([]);
        });

        it('should return list of strings', () => {
            expect(interpret(["list", "hi", "mary", "rose"])).to.deep.equal(['hi', "mary", "rose"]);
        });

        it('should return list of numbers', () => {
            expect(interpret(["list", 1, 2, 3])).to.deep.equal([1, 2, 3]);
        });

        it('should return list of numbers in strings as strings', () => {
            expect(interpret(["list", "1", "2", "3"])).to.deep.equal(["1", "2", "3"]);
        });
    });


    describe('invocation', () => {
        it('should return first element of list', () => {
            expect(interpret(["first", ["list", 1, 2, 3]])).to.deep.equal(1);
        });

        it('should return rest of list', () => {
            expect(interpret(["rest", ["list", 1, 2, 3]])).to.deep.equal([2, 3]);
        });
    });

    describe('lambdas', () => {
        it('should return correct result when invoke lambda w no params', () => {
            expect(interpret([["lambda", [], ["rest", ["list", 1, 2]]]])).to.deep.equal([2]);
        });

        it('should return correct result for lambda that takes and returns arg', () => {
            expect(interpret([["lambda", ["x"], "x"], 1])).to.deep.equal(1);
        });
        it('should return correct result for curried lambda args', () => {
            expect(interpret([[[["lambda", ["x"], "x"]]], 1])).to.deep.equal(1);
        });

        it('should return correct result for lambda that returns list of vars', () => {
            expect(interpret([["lambda", ["x", "y"], ["list", "x", "y"]], 1, 2])).to.deep.equal([1, 2]);
        });

        it('should get correct result for lambda that returns list of lits + vars', () => {
            expect(interpret([["lambda", ["x", "y"], ["list", 0, "x", "y"]], 1, 2])).to.deep.equal([0, 1, 2]);
        });

        it('should return correct result when invoke lambda w params', () => {
            expect(interpret([["lambda", ["x"], ["first", ["list", "x"]]], 1]))
                .to.deep.equal(1);
        });
    });

    describe('let', () => {
        it('should eval inner expression w names bound', () => {
            expect(interpret(["let", [["x", 1], ["y", 2]], ["list", "x", "y"]])).to.deep.equal([1, 2]);
        });

        it('should accept empty binding list', () => {
            expect(interpret(["let", [], 42])).to.deep.equal(42);
        });
    });

    describe('if', () => {
        it('should choose the right branch', () => {
            expect(interpret(["if", 1, 42, 4711])).to.deep.equal(42);
            expect(interpret(["if", 0, 42, 4711])).to.deep.equal(4711);
        });
    });
    describe('stdio', function() {
        it('should run stdout an int', () => {
            return new Promise(res => {
                interpreter.stdout.on('data', res);
                interpret(["stdio.write", 1]);
            })
                .then(data => expect(data).to.deep.equal(1));
        });
        it('should run stdin an int', () => {
            return new Promise(res => {
                interpreter.stdout.on('data', res);
                interpret(["stdio.write", 1]);
            })
                .then(data => expect(data).to.deep.equal(1));
        });
        it('should read from stdout', () => {
            return new Promise(res => {
                interpret(["stdio.read", ["lambda", ["x"], ["stdio.write", "x"]]]);
                interpreter.stdout.on('data', res);
                interpreter.stdin.write(1);
            })
                .then(data => expect(data).to.deep.equal(1));
        });
    });
});