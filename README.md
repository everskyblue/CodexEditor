# Voir Native

es un marco para desarrollar aplicaciones android e ios de forma mas organizada con tabrisjs.

## Como Usar

```javascript
import {CoordinatePage, CoordinatePageComponent, menuDrawer} from 'voir-native'
import {contentView, menuDrawer} from "tabris"

contentView.append(CoordinatePage({
    layoutData: 'stretch
}))


menuDrawer(
    {
        one: {
            text: "home",
            id: "home",
            image: "/images/home.png",
        },
        thwo: {
            text: "favorite",
            id: "favorite",
            image: "/images/favorite.png",
        },
        three: {
            text: "configure",
            id: "config",
            image: "/images/settings.png",
        },
    }
);

// oh

contentView.append(
    <CoordinatePageComponent stretch />
)

```

nuevas caracteristicas se añadiran poco a poco
