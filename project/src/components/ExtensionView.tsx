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

export function FilterView(propsInput: any = {}) {
    const delegateOption = ({ target }: EventObject<ImageView>) => {
        const {
            data: { index }
        } = target;
        if (index === 0) {
            target.parent().siblings(TextInput).first().text = "";
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

function Extension({ title, image, description }: any) {
    const showExtensions = () => {};

    return (
        <Composite
            onTap={showExtensions}
            stretchX
            top="prev()"
            highlightOnTouch
        >
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
            top: "prev()",
            right: 0,
            left: 0,
            bottom: 0
        });

        var childs = null;

        const handlerInput = ({ value: text }: EventObject<TextInput>) => {
            if (text.length === 0) {
                const content = this.find(ExtensionContent).only();
                childs = content.children();
                if (childs.length === 0) {
                    childs.dispose();
                    content.addViewExtension();
                }
            }
        };

        const searchExtensions = (ev: TextInputAcceptEvent<TextInput>) => {
            childs = this.find(ExtensionContent).only().children();
            childs.dispose();
            //childs = wc.toArray();
            //childs.detach();
        };

        this.append(
            <$>
                <TextView text="extensiones" padding={8} textColor="gray" />
                <FilterView
                    onAccept={searchExtensions}
                    onTextChanged={handlerInput}
                />
                <ExtensionContent />
            </$>
        );
    }
}

export class ExtensionInstalled extends TabView {
    constructor() {
        super({
            bottom: "auto",
            title: "extensiones instaladas"
        });
        // 11
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

export class ExtensionDisabled extends TabView {
    constructor() {
        super({
            bottom: "auto",
            title: "extensiones desactivadas"
        });
        //14
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
        this.append(
            <Extension
                title="Angular Autocomplete"
                image="/assets/img/icons/angular.png"
                description="esto es una breve description"
            />
        );
    }
}
