console.log("loader.js")
try {
fetch('./editor.html').then(e=> e.text())
.then(r => {
    console.log(r)
}).catch(console.error)
.finally((e) => {
    console.log(e, "finaly")
})

} catch (e) {alert(e)}