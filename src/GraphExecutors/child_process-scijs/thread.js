const {Interpreter} = require('../../common/lisp');


process.send({status: 'ready'});
process.once('message', ({expr, data}) => {
    const interpreter = new Interpreter(Interpreter.stdlib);
    interpreter.interpret(expr);
    interpreter.stdout.on('data', data => process.send({data}));
    if (Array.isArray(data))
        data.forEach(entry => interpreter.stdin.write(entry));
});