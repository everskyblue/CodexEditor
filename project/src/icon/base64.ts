import { decode } from "base-64";

const images = [
    {
        name: 'Home',//data:image/png;base64,
        src: 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAhQAAAIUB4uz/wQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAADSSURBVEiJvZJBCsIwEEUf4gW8gHuP4SlESt0JLvQiegCvI95CdFd0W1CwRaG6SSBoaiftxIHZTPjvDUlAXilwNp0G5EQ1ByrgZboCVrHgqpI6uIqkCd5JIoW3koTCgyRt4SJJV/hPiRbcK5kpw11JCnCJALed9fzPoVtToIywfQFMrGQAbBTha8PEXlEOZFpXYlg5QF8YqICts8QQWDgL1pZUsAOWH7MRMG4KSn/RzTO7SoLRv+lfBYUi9+4T7IGnAvxhWF+CA5AAJ0/oGDBL3LM3WIPi42nJErIAAAAASUVORK5CYII=',
    },
    {
        name: 'Config',
        src: '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'
    }
];

type Imgs = (typeof images)[number]['name'] //Extract<typeof images[keyof typeof images], {name: string}>;

type Icons = Record<Imgs, Blob>

const Icon = {} as Icons;

for (let i = 0; i < images.length; i++) {
    let { name, src } = images[i];
    const byteCharacters = decode(src);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    Icon[name] = new Blob([byteArray], {
        type: 'image/png'
    });
}

export default Icon;

/*
function Render(image: Blob) {
    let a = new Canvas({
        layoutData: {
            centerY: true
        }
    }).onTap(console.log);
    let b = a.getContext("2d", 32, 32);
    a.width = 32;
    a.height = 32;
    ImageBitmap.createImageBitmap(image, {
        resizeQuality: 'medium',
        resizeWidth: 32,
        resizeHeight: 32
    }).then(result => {
        b.drawImage(result, 0, 0, 32, 32, 0, 0, 32, 32);
        //b.fillStyle = 'rgb(255,255,255)'
        //b.fillRect(0,0,a.width,a.height)
        const imgData = b.getImageData(0, 0, a.width, a.height)
        console.log(JSON.stringify(imgData.data),'---------------');
        for (let i = 0; i < imgData.data.length; i+=4) {
            imgData.data[i] = 1//imgData[i] //
            imgData.data[i - 2] = 255//imgData[i] //
            imgData.data[i - 3] = 255//imgData[i] //
            imgData.data[i - 4] = 255//imgData[i] //
        }
        b.putImageData(imgData, 0, 0)
    })
    let a:ImageView;
    return (props: any = {}) => (a ?? (a = new ImageView({
            image: {src: image, width: 24, height: 24}, 
            layoutData: {centerY: true},
            //...props
            tap(){console.log(arguments);}
        }))
    )
}*/