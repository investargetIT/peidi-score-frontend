// i18n/index.ts

import en from "@/locales/en";
import zh from "@/locales/zh";
import { createI18n } from "vue-i18n";

const lang = localStorage.getItem("lang") || "zh";
const i18n = createI18n({
  legacy: false, // Set to false to use Composition API mode
  locale: lang,
  fallbackLocale: "en",
  messages: { en, zh }
});

export default i18n;
