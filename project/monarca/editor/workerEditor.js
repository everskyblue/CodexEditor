import { sizeMeasurement } from "tabris"

function job(texts, x, y) {
    const sizes = [];
    texts.forEach((text, line) => {
        const charSizes = [];
        for (let index = 0; index < text.length; index++) {
            const char = text[index];
            const size = {
                ...(block.textManager.getTextSize(char)),
                text: char
            };
            if (index !== 0) {
                const { height, width, text } = charSizes[index - 1];
                size.width = size.width + width;
                size.text = text + char;
            }
            if (line !== 0) {
                size.height += sizes[line - 1].totalSize.height;
            }
            charSizes.push(size);
        }
        sizes.push({
            charSizes,
            totalSize: charSizes.at(-1) ?? {}
        })
    })

    const findSize = sizes.find(({ charSizes, totalSize: size }) => {
        const deference = Math.abs(y - size.height);
        const accumulator = (y + size.height) / 2;
        const percent = (deference / accumulator) * 100;
        //console.log(percent, deference, accumulator, size,y);
        return (Math.floor(percent) < 50 && deference < 12)
    })

    //console.log(JSON.stringify(charSizes));
    if (typeof findSize !== 'undefined') {
        const { charSizes, totalSize: size } = findSize;
        const findTextPosition = charSizes.find(({ width }) => {
            return (Math.floor(Math.abs(width - x)) < 12)
        })
    }
}
window.addEventListener("message", e => {
    console.log((e.data))
})