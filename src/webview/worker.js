const { sizeMeasurement } = require("tabris")

tabris.onMessage(() => {
    const s = sizeMeasurement.measureTextsSync([{text: "hola", font: '17px'}])
    console.log(s)
})