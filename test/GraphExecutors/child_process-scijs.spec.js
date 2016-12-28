import backend from '../../src/GraphExecutors/child_process-scijs';
import {expect} from 'chai';

describe('child_process-scijs GraphExecutor', () => {
    it('should work', async() => {
        const emitter = await backend([
                'stdio.read', ['lambda', [],
                    ['stdio.write',
                        ['list', 1, 2, 3]]]],
            [0]);
        const res = await new Promise(res => emitter(data => res(data)));
        expect(res).to.deep.equal([1, 2, 3]);
    })
});