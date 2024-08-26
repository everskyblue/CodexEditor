const { sizeMeasurement } = require("tabris")

tabris.onMessage(() => {
    const s = sizeMeasurement.measureTextsSync([{tezxt: "hola"}])
    console.log(s)
})