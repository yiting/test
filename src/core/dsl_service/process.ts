import ChildProcess from 'child_process';

export default async function dslProcess(_input: any, _options: any) {
  return new Promise((res, rej) => {
    const childProcess = ChildProcess.fork(`${__dirname}/dslService.js`);
    childProcess
      .on('message', (msg: any) => {
        res(msg);
      })
      .on('close', () => {
        // console.log(arguments)
      })
      .on('exit', () => {
        // console.log(arguments)
      })
      .on('error', () => {
        // console.log(arguments)
      })
      .on('disconnect', () => {
        // console.log(arguments)
      });
    childProcess.send({
      _input,
      _options,
    });
  });
}
