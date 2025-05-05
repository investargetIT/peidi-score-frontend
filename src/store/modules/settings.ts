import { defineStore } from "pinia";
import { type setType, store, getConfig } from "../utils";
import { useI18n } from "vue-i18n";

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): setType => {
    const { t } = useI18n();
    return {
      title: t("system.title"),
      fixedHeader: getConfig().FixedHeader,
      hiddenSideBar: getConfig().HiddenSideBar
    };
  },
  getters: {
    getTitle(state) {
      return state.title;
    },
    getFixedHeader(state) {
      return state.fixedHeader;
    },
    getHiddenSideBar(state) {
      return state.hiddenSideBar;
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    }
  }
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
