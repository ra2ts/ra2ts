import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import DroidSansRegularFontJson from "./droid_sans_regular.typeface.json";
import DroidSansBoldFontJson from "./droid_sans_bold.typeface.json";

const loader = new FontLoader();

export const DroidSansRegular = loader.parse(DroidSansRegularFontJson);
export const DroidSansBold = loader.parse(DroidSansBoldFontJson);