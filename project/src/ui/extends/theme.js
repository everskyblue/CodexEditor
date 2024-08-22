import { contentView, drawer } from "voir-native";

function applyTextColor(color) {
    this.textColor = color;
}

function applyBackgroundColor(bgColor) {
    this.background = bgColor;
}

const applyDrawerThemeElements = [
    "NavigationView",
    "ActivityBar"
];