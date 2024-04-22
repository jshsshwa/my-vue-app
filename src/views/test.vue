<!--  -->
<template>
    <el-table-column type="expand">
        <template #default="scope">
            <div class="setComment">
                <el-avatar :size="50" :src="scope.row.user.avatar" fit="cover" />
                <div>
                    <p><span class="p1">{{ scope.row.user.username }}</span></p>
                    <p>{{ scope.row.review.data }}
                    </p>
                    <p>
                        <el-avatar v-for="(item, i) in scope.row.review.image" :key="i" shape="square" :size="80"
                            :src="item" />

                    </p>
                    <p v-if="!scope.row.extra">
                        <el-button type="primary" @click="openDialig(scope.row)">回复</el-button>
                    </p>
                    <div v-else class="setMain" v-for="(item, i) in scope.row.extra" :key="i">
                        <span>回复：</span>
                        {{ item.data }}
                        <p>
                            <span style="color:#409eff;cursor: pointer;"
                                @click="oppenDialogEdit(scope.row, item.data)">修改</span>
                        </p>
                    </div>
                </div>
            </div>
        </template>
    </el-table-column>
</template>
<script setup>


</script>

<style lang='less' scoped></style>