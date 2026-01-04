import "../css/app.css";
import Alpine from "alpinejs";
import collapse from "@alpinejs/collapse";
import focus from "@alpinejs/focus";
import slider from "./slider.js";
import collapsible from "./header/collapsible.js";
import anchor from "@alpinejs/anchor";

window.Alpine = Alpine;

// plugins
Alpine.plugin(collapse);
Alpine.plugin(focus);
Alpine.plugin(anchor);

// data
Alpine.data("slider", slider);
Alpine.data("collapsible", collapsible);
Alpine.start();
