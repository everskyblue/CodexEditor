import {Module} from 'tabris'

export function runCode(source: string) {
  try {
    const wrapper = `
(function (console){
  ${source}
})((function () {
  ${Module.load(__dirname + '/console.js')}
  return consoleCapsule();
})())
`;

    Module.execute(wrapper, __dirname + '/execute.js')
  } catch(e) {
     //console.log(JSON.stringify(e))
    //console.error('error', e.trace)
  }
}

export default function (filename: string) {
  try {
    Module.createRequire(filename)
  } catch(e) {
    console.log(e)
  }
}