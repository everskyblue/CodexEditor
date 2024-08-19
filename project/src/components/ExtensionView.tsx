import {
    Composite,
    Row,
    Stack,
    TextInput,
    ImageView,
    TextView,
    TextInputAcceptEvent,
    EventObject
} from "tabris";
import TabView from "./TabView";

const images_ext = [
    "/assets/img/vocabulary-off.png",
    "/assets/img/filter.png",
    "/assets/img/package-import.png"
];

const category_extension = [
    {
        category: "theme"
    }
];

const filter_by = ["extension_id", "category", "publisher"];

export function FilterView() {
    const delegateOption = ({ target }: EventObject<ImageView>) => {
        const {
            data: { index }
        } = target;
        if (index === 0) {
            target.parent().siblings(TextInput).first().text = "";
        }
    };

    function searchExt(ev: TextInputAcceptEvent<TextInput>) {
        console.log(ev.text);
    }

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
                left={8}
                keyboard="ascii"
                right={8}
                textColor="white"
                background="#171717"
                borderColor="transparent"
                onAccept={searchExt}
                keepFocus={true}
                message="buscar paquete"
                messageColor="gray"
            />
        </Stack>
    );
}

function Extension({ title, image, description }: any) {
    const showEx = () => {};

    return (
        <Composite onTap={showEx} stretchX highlightOnTouch>
            <ImageView centerY width={25} height={25} image={image} />
            <TextView left="prev()" right={0} padding={[0, 5]} markupEnabled>
                <b font="16px bold" textColor="#737373">
                    {title}
                </b>
                <br />
                <i font="12px" textColor="#52525b">
                    {description}
                </i>
                <br />
                <small textColor="#737373">author </small>
                <small textColor="#064e3b">788867 λ</small>
            </TextView>
        </Composite>
    );
}

class ExtensionContent extends Stack {
    constructor() {
        super({
            left: 0,
            right: 0,
            top: "prev() 15",
            spacing: 15,
            bottom: 0
        });
        this.append(
            <Extension
                title="Android Autocomplete"
                image="/assets/img/icons/android.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Android Autocomplete"
                image="/assets/img/icons/android.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Android Autocomplete"
                image="/assets/img/icons/android.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Android Autocomplete"
                image="/assets/img/icons/android.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Android Autocomplete"
                image="/assets/img/icons/android.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Android Autocomplete"
                image="/assets/img/icons/android.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Android Autocomplete"
                image="/assets/img/icons/android.png"
                description="esto es una breve description"
            />
        );
    }
}

export class ExtensionView extends Composite {
    constructor() {
        super({
            top: "prev()",
            right: 0,
            left: 0
        });

        this.append(<ExtensionContent />);
    }
}

export class ExtensionInstalled extends TabView {
    constructor() {
        super({
            title: "extensiones instaladas"
        });
    }
}

export class ExtensionDisabled extends TabView {
    constructor() {
        super({
            title: "extensiones desactivadas"
        });
    }
}
