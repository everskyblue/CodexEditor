import { ImageView } from "tabris";
import {ImageBlob as Icons} from "../icon";

export function Home(props: any = {}) {
    return (
        <ImageView image={Icons.Home} width={24} height={24} centerY {...props} />
    )
}

export function Config(props: any = {}) {
    return (
        <ImageView image={Icons.Config} width={24} height={24} centerY {...props} />
    )
}