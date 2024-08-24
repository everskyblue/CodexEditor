import {
    Composite,
    Row,
    Stack,
    TextInput,
    ImageView,
    TextView,
    TextInputAcceptEvent,
    EventObject,
    CollectionView,
    drawer,
} from "tabris";
import { Toast } from "voir-native";
import TabView from "./TabView";
import { listFilesInDirectory } from "../services/bucket";
import { extensionStorage } from "../store";

const images_ext = [
    "/assets/img/vocabulary-off.png",
    "/assets/img/filter.png",
    "/assets/img/package-import.png",
];

const category_extension = [
    {
        category: "theme",
    },
];

const filter_by = ["extension_id", "category", "publisher"];

async function loadPackage() {
    const { error, files } = await listFilesInDirectory();

    if (error) console.log("error", error);

    return files;
}

export class CollectionExtension extends CollectionView {
    _plugins = [
        {
            name: "titulo del paquete",
            icon: "/assets/img/package.png",
            extensionId: "x889s8",
            totalDownload: 300,
            author: "nike",
            description:
                "excepteur officia anim enim irure ad sunt fugiat tempor et aliquip magna in minim pariatur aliquip nisi sint id anim est aliquip cillum occaecat deserunt",
        },
    ];
    _files: any[] = [];

    constructor(props = { stretch: true }) {
        super({
            top: "prev() 5",
            left: 0,
            right: 0,
            bottom: 0,
            padding: [0, 8],
        });
        this.itemCount = this._plugins.length;
    }

    createCell = () => {
        return <Extension install />;
    };

    async loadPackage() {
        const { error, files } = await listFilesInDirectory();

        if (error) console.log("error", error);

        //this.push();
    }

    updateCell = (cell: Composite, index: number) => {
        const plugin = this._plugins[index];
        const tv = cell.find(TextView).first();
        const iv = cell.find(ImageView).only();
        tv.text = tv.text
            .replace("$name", plugin.name)
            .replace("$description", plugin.description.slice(0, 40) + "...")
            .replace("$author", plugin.author);
        iv.image = plugin.icon;
    };
}

export function FilterView(propsInput: any = {}) {
    const delegateOption = ({ target }: EventObject<ImageView>) => {
        const {
            data: { index },
        } = target;
        if (index === 0) {
            const ti = target.parent().siblings(TextInput).first();
            if (ti.text.length > 0) {
                ti.text = "";
                const ec = drawer.find(ExtensionContent).first();
                if (ec.children(CollectionExtension).length > 0) {
                    ec.children().dispose();
                    ec.addViewExtension();
                }
            }
        }
    };

    return (
        <Stack stretchX spacing={10} top={0}>
            <Row right={0} padding={[2, 8]} spacing={5}>
                {...images_ext.map((img, index) => (
                    <ImageView
                        centerY
                        data={{ index }}
                        image={img}
                        width={30}
                        height={30}
                        padding={[0, 5]}
                        onTap={delegateOption}
                    />
                ))}
            </Row>
            <TextInput
                {...propsInput}
                left={8}
                keyboard="ascii"
                right={8}
                textColor="white"
                background="#171717"
                borderColor="transparent"
                keepFocus={true}
                message="buscar paquete"
                messageColor="gray"
            />
        </Stack>
    );
}

function Extension({
    title,
    image,
    description,
    totalDownload,
    author,
    extensionId,
    install,
}: any = {}) {
    const showExtensions = () => {};

    return (
        <Composite
            onTap={showExtensions}
            stretchX
            top="prev()"
            padding={{ bottom: 10 }}
            highlightOnTouch
        >
            <ImageView centerY width={25} height={25} image={image} />
            <TextView left="prev()" right={0} padding={[0, 5]} markupEnabled>
                <b font="16px bold" textColor="#737373">
                    {title ?? "$name"}
                </b>
                <br />
                <i font="12px" textColor="#52525b">
                    {description ?? "$description"}
                </i>
                <br />
                <small textColor="#737373">{author ?? "$author"} </small>
                {install ? (
                    <small textColor="#064e3b">
                        λ {totalDownload ?? "$totalDownload"}
                    </small>
                ) : (
                    ""
                )}
            </TextView>
            {install ? (
                <TextView
                    highlightOnTouch
                    text="descargar"
                    bottom={0}
                    right={3}
                    elevation={100}
                    padding={[3, 5]}
                    textColor="white"
                    background="#08734c"
                />
            ) : (
                <$>{[]}</$>
            )}
        </Composite>
    );
}

class ExtensionContent extends Stack {
    constructor() {
        super({
            left: 0,
            right: 0,
            top: "prev() 15",
            bottom: 0,
        });

        this.addViewExtension();
    }

    addViewExtension() {
        this.append(
            <$>
                <ExtensionInstalled />
                <ExtensionDisabled />
            </$>
        );
    }
}

export class ExtensionView extends Composite {
    constructor() {
        super({
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
        });

        var childs = null;

        const handlerInput = ({ value: text }: any) => {
            if (text.length === 0) {
                const content = this.find(ExtensionContent).only();
                childs = content.children();
                if (childs.length == 1) {
                    childs.dispose();
                    content.addViewExtension();
                }
            }
        };

        const searchExtensions = (ev: TextInputAcceptEvent<TextInput>) => {
            if (ev.target.text.length < 3)
                return Toast.makeText("busqueda muy corta", 3000).show();
            childs = this.find(ExtensionContent).only().children();
            childs.dispose();
            this.addViewSearch();
        };

        this.append(
            <$>
                <FilterView
                    onAccept={searchExtensions}
                    onTextChanged={handlerInput}
                />
                <ExtensionContent />
            </$>
        );
    }

    addViewSearch() {
        this.find(ExtensionContent)
            .first()
            .append(<CollectionExtension stretch />);
    }
}

export class ExtensionInstalled extends TabView {
    constructor() {
        super({
            bottom: "auto",
            top: "auto",
            title: "extensiones instaladas",
        });

        this.append(getViewExtension("installed"));
    }
}

export class ExtensionDisabled extends TabView {
    constructor() {
        super({
            top: "auto",
            bottom: "auto",
            title: "extensiones desactivadas",
        });

        this.append(getViewExtension("disabled"));
    }
}

function getViewExtension(key: string) {
    return extensionStorage[key as keyof typeof extensionStorage].map((ext) => {
        return (
            <Extension
                title={ext.title}
                image={ext.icon}
                description={ext.description}
                author={ext.author}
            />
        );
    });
}
