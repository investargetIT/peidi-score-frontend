import { ref, onUnmounted, watch, type Ref } from "vue";

/**
 * 自动保存组合式函数
 * @param saveFunction 保存函数
 * @param isActive 是否激活自动保存的条件函数
 * @param interval 自动保存间隔（毫秒），默认1分钟
 * @param immediate 是否立即执行一次保存（页面加载时）
 * @returns 自动保存控制对象
 */
export function useAutoSave(
  saveFunction: () => void,
  isActive: () => boolean,
  interval: number = 60 * 1000,
  immediate: boolean = false
) {
  const autoSaveTimer = ref<NodeJS.Timeout | null>(null);
  const isSaving = ref(false);

  // 启动自动保存
  const startAutoSave = () => {
    if (autoSaveTimer.value) {
      clearInterval(autoSaveTimer.value);
    }

    autoSaveTimer.value = setInterval(() => {
      if (isActive() && !isSaving.value) {
        isSaving.value = true;
        try {
          saveFunction();
        } finally {
          isSaving.value = false;
        }
      }
    }, interval);
  };

  // 停止自动保存
  const stopAutoSave = () => {
    if (autoSaveTimer.value) {
      clearInterval(autoSaveTimer.value);
      autoSaveTimer.value = null;
    }
  };

  // 手动触发保存
  const triggerSave = () => {
    if (isActive() && !isSaving.value) {
      isSaving.value = true;
      try {
        saveFunction();
      } finally {
        isSaving.value = false;
      }
    }
  };

  // 监听条件变化，自动启动/停止
  watch(
    isActive,
    newVal => {
      if (newVal) {
        startAutoSave();
        if (immediate) {
          triggerSave();
        }
      } else {
        stopAutoSave();
      }
    },
    { immediate: true }
  );

  // 组件卸载时清理
  onUnmounted(() => {
    stopAutoSave();
  });

  return {
    isSaving,
    startAutoSave,
    stopAutoSave,
    triggerSave
  };
}

/**
 * 简化的自动保存函数（适用于ESG组件）
 * @param saveFunction 保存函数
 * @param activeTab 当前激活的标签页
 * @param isEdit 是否可编辑
 * @param targetTab 目标标签页名称
 * @param interval 自动保存间隔（毫秒）
 */
export function useEsgAutoSave(
  saveFunction: () => void,
  activeTab: Ref<string>,
  isEdit: Ref<boolean>,
  targetTab: string,
  interval: number = 60 * 1000
) {
  return useAutoSave(
    saveFunction,
    () => activeTab.value === targetTab && isEdit.value,
    interval
  );
}
