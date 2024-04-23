<!--  -->
<template>
  <div>
    <el-col>
      <el-result
        icon="error"
        title="404 error"
        sub-title="找不到資料"
        style="padding-top: 150px"
      >
        <template #icon>
          <el-image src="https://tisi.tw/img/pages/404.png"></el-image>
        </template>
        <template #extra>
          <el-button
            type="primary"
            size="large"
            @click="$router.push('/')"
            round
          >
            回首頁
          </el-button>
        </template>
      </el-result>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "",
};
</script>

<style lang="less" scoped></style>
