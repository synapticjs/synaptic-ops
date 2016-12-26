import {Pointer} from './types';

type Op = Array<string | Pointer | Op>;

export class GraphRecorderAPI {
    static _keywords = {
        'allocate': 'allocate',
        'define': 'define',
        'if': 'if',
        'read': 'read',
        'write': 'write',
        'do': 'do',
    };

    get _keywords () { return this.constructor._keywords }

    vars: string[] = [];
    _varMap: Object<string, Pointer> = {};
    _instructions: Op[] = [];

    _registerPointer(pointer: Pointer): void {
        const id = `#${this.vars.length}`;
        this.vars.push(id);
        this._varMap[id] = pointer;
        return id;
    }

    _registerOp(op: Op): any {
        this._instructions.push(op);
    }

    _record(fn: () => any) {
        const globalInstructions = this._instructions;
        this._instructions = [];
        fn();
        const result = this._instructions;
        this._instructions = globalInstructions;
        return [this._keywords.do, result];
    }

    compile() {
        return [
            [
                this._keywords.allocate,
                this.vars
                    .map(varname => [varname, this._varMap[varname].allocate()])
            ],
            ...this.vars
                .filter(varname => this._varMap[varname].predefinedValue !== undefined)
                .map(varname => [this._keywords.define, varname, this._varMap[varname].predefinedValue]),

            ...this._instructions
        ]
    }
}
