const { sizeMeasurement } = require("tabris")

tabris.onMessagd(() => {
    const s = sizeMeasurement.measureTextsSync([{tezxt: "hola"}])
    console.log(s)
})