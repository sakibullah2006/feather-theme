import "../css/app.css";
import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import slider from "./slider.js";
import collapsible from "./header/collapsible.js";
import dropdownMenu from "./header/dropdown-menu.js";
import anchor from "@alpinejs/anchor";
import carousel from "./common/carousel.js";

window.Alpine = Alpine;

// plugins
Alpine.plugin(collapse);
Alpine.plugin(focus);
Alpine.plugin(anchor);

// data
Alpine.data("slider", slider);
Alpine.data("carousel", carousel);
Alpine.data("collapsible", collapsible);
Alpine.data("dropdownMenu", dropdownMenu);
Alpine.start();
