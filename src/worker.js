const { sizeMeasurement } = require("tabris")

tabris.onMessage(() => {
    const s = sizeMeasurement.measureTextsSync([{text: "hola"}])
    console.log(s)
})