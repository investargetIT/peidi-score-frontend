// i18n/index.ts

import en from "@/locales/en";
import zh from "@/locales/zh";
import { createI18n } from "vue-i18n";

const lang = localStorage.getItem("lang") || "zh";
const i18n = createI18n({
  legacy: false, // Set to false to use Composition API mode
  locale: lang,
  fallbackLocale: "en",
  messages: { en, zh },
  silentTranslationWarn: true, // 禁用警告
  missingWarn: false, // 禁用缺失键的警告
  silentFallbackWarn: true, // 禁用回退警告
  fallbackWarn: false // 禁用回退警告
});

export default i18n;
