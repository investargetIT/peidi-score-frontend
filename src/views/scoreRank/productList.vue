<template>
  <div class="mt-3 rounded-sm">
    <el-table
      :data="tableData"
      style="width: 100%"
      :empty-text="t('table.emptyText')"
    >
      <el-table-column :label="t('leaderboard.rank')">
        <template #default="scope">
          <span>{{
            scope.$index + 1 + (pagination.pageNo - 1) * pagination.pageSize
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="fullName" :label="t('leaderboard.user')">
        <template #default="scope">
          <div class="flex gap-2 items-center">
            <el-avatar
              :size="32"
              :src="avatarUrls[scope.row.id] || Avatar"
              style="margin-right: 12px"
            />
            <span>{{ scope.row.fullName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column :prop="pointColumnProp" :label="pointColumnLabel">
        <template #default="scope">
          {{ changeNumberFormat(scope.row[pointColumnProp]) }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handlePageChange"
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      layout="total, prev, pager, next"
      :total="pagination.total"
      style="width: 100%; margin-top: 20px; text-align: center"
    ></el-pagination>
  </div>
</template>

<script setup lang="ts">
import { changeNumberFormat } from "@/utils/common";
import { ref, watch, computed, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import enUs from "element-plus/es/locale/lang/en";
import { getScoreRankList, getFileDownLoadPath } from "@/api/pmApi.ts";
import Avatar from "@/assets/user.jpg";

const props = defineProps({
  pointType: {
    type: String,
    default: "lifeTimePoints"
  },
  pointTypeMap: {
    type: Object,
    default: () => ({})
  }
});

const { t } = useI18n();
const tableData = ref([]);
const pagination = ref({
  pageNo: 1,
  pageSize: 10,
  total: 0
});
const avatarUrls = ref({});

// 缓存两类数据
const cache = ref({
  lifeTimePoints: { records: [], total: 0, avatars: {} },
  exchangeablePoints: { records: [], total: 0, avatars: {} }
});

const fetchAndCache = async (type: string) => {
  const res = await getScoreRankList({
    pageNo: 1,
    pageSize: 100000, // 拉全量，分页在前端做
    sortStr: JSON.stringify([{ sortName: type, sortType: "desc" }])
  });
  if (res?.data?.records) {
    const avatars: Record<string, string> = {};
    for (const record of res.data.records) {
      if (record.avatarUrl) {
        avatars[record.id] = await getPreviewUrl(record.avatarUrl, record.id);
      }
    }
    cache.value[type] = {
      records: res.data.records,
      total: res.data.total || 0,
      avatars
    };
  }
};

const getPreviewUrl = async (file, userId) => {
  if (!file) return "";

  try {
    // 尝试作为JSON字符串解析
    const parsed = JSON.parse(file);

    // 如果解析成功且是数组格式
    if (Array.isArray(parsed) && parsed.length > 0) {
      const objectName = parsed[0]?.response?.data || parsed[0]?.name;
      if (objectName) {
        const res = await getFileDownLoadPath({
          objectName: objectName
        });
        if (res.code === 200) {
          return res.data;
        }
      }
    }
    return "";
  } catch (error) {
    // 如果JSON.parse失败，说明是单纯的字符串，直接返回使用
    // console.log(`用户${userId}的avatarUrl是单纯字符串，直接使用:`, file);
    return file;
  }
};

const updateTableData = () => {
  const type = props.pointType;
  tableData.value = cache.value[type].records.slice(
    (pagination.value.pageNo - 1) * pagination.value.pageSize,
    pagination.value.pageNo * pagination.value.pageSize
  );
  pagination.value.total = cache.value[type].total;
  avatarUrls.value = cache.value[type].avatars;
};

const handlePageChange = (pageNo: number) => {
  pagination.value.pageNo = pageNo;
  updateTableData();
};

watch(
  () => props.pointType,
  () => {
    pagination.value.pageNo = 1;
    updateTableData();
  }
);

onMounted(async () => {
  await fetchAndCache(props.pointTypeMap["exchangeablePoints"]);
  await fetchAndCache(props.pointTypeMap["lifeTimePoints"]);
  updateTableData();
});

const pointColumnLabel = computed(() => {
  return props.pointType === props.pointTypeMap["exchangeablePoints"]
    ? t("dashboard.exchangeablePoints")
    : t("dashboard.longTermPoints");
});

const pointColumnProp = computed(() => {
  return props.pointType === props.pointTypeMap["exchangeablePoints"]
    ? props.pointTypeMap["exchangeablePoints"]
    : props.pointTypeMap["lifeTimePoints"];
});

defineExpose({
  fetchProductList: updateTableData
});
</script>
<style scoped>
.hhh {
  color: red;
}

.userIcon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
