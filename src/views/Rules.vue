<!-- 菜单权限 -->
<template>
    <div>
        <el-card>
            <div>
                <el-button type="primary" @click="oppenDialog">新增</el-button>
            </div>
            <el-tree :data="data" :props="defaultProps" v-loading="isLoading" node-key="id"
                :default-expanded-keys="defaultKeys">
                <template #default="{ node, data }">
                    <div class="content">
                        <div class="left">
                            <el-tag v-if="data.menu == 1">菜单</el-tag>
                            <el-tag type="success" v-if="data.menu == 0">权限</el-tag>
                            <el-icon>
                                <component :is="data.icon"></component>
                            </el-icon>
                            {{ data.name }}
                        </div>
                        <div class="right">
                            <el-switch v-model="data.status" :inactive-value="0" :active-value="1"
                                @change="switchChange($event, data)" @click.stop="" />
                            <el-button type="primary" :icon="Edit" size="small" @click.stop="editRules(data)" />
                            <el-tooltip effect="dark" content="新增" placement="top" :enterable="false">
                                <el-button type="warning" :icon="CirclePlusFilled" size="small" @click.stop="addSub(data.id)"/>
                            </el-tooltip>

                            <el-button type="danger" :icon="Delete" size="small" @click.stop="delRules(data)" />

                        </div>
                    </div>
                </template>
            </el-tree>
        </el-card>
        <el-dialog v-model="dialogVisibleAddRules" :title="titleValue" width="40%">
            <el-form :model="formData" label-width="110px">
                <el-form-item label="上级菜单">
                    <el-cascader :options="rulesList" :props="props1" v-model="formData.rule_id" placeholder="请选择上级菜单" />
                </el-form-item>
                <el-form-item label="菜单/规则">
                    <el-radio-group v-model="formData.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="formData.name" />
                </el-form-item>
                
                <el-form-item label="菜单图标" v-if="formData.menu == 1">
                    <IconSelect v-model="formData.icon"></IconSelect>
                </el-form-item>
                <!-- 一级菜单没有前端路由，二级菜单才有 -->
                <el-form-item label="前端路由" v-if="formData.menu == 1 && formData.rule_id > 0">
                    <el-input v-model="formData.frontpath" />
                </el-form-item>
                <el-form-item label="后端规则" v-if="formData.menu == 0">
                    <el-input v-model="formData.condition" />
                </el-form-item>
                <el-form-item label="请求方式" v-if="formData.menu == 0">
                    <el-select v-model="formData.method" placeholder="请选择请求方式">
                        <el-option v-for="item in methodData" :key="item.id" :label="item.name" :value="item.name" />
                    </el-select>
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="formData.order" :min="1" :max="1000" @change="handleChangeOrder" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" @change="isSwitch" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisibleAddRules = false">取消</el-button>
                    <el-button type="primary" @click="addRulesOk">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
</div>
</template>

<script setup>
import IconSelect from '@/components/IconSelect.vue'
import { getRulesListFn, addRulesFn, editRulesFn, editStatusFn, delRulesFn } from '@/api/rules.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref, reactive } from 'vue'

//对话框标题
const titleValue = ref('')
//新增对话框
const dialogVisibleAddRules = ref(false)
//新增数据源对象
const formData = reactive({
    rule_id: 0,
    //1是菜单 0是规则
    menu: 1,
    name: '',
    //后端规则
    condition: '',
    //后端请求方式
    method: '',
    status: 1,
    order: 50,
    icon: '',
    //前端路由
    frontpath: ''
})
//菜单id
const rulesId = ref('')
//打开新增
const oppenDialog = () => {
    titleValue.value = '新增'
    formData.rule_id = 0
    //1是菜单 0是规则
    formData.menu = 1
    formData.name = ''
    //后端规则
    formData.condition = ''
    //后端请求方式
    formData.method = ''
    formData.status = 1
    formData.order = 50
    formData.icon = ''
    //前端路由
    formData.frontpath = ''
    dialogVisibleAddRules.value = true
}

//请求方式
const methodData = ref([
    { id: 1, name: 'GET' },
    { id: 2, name: 'POST' },
    { id: 3, name: 'PUT' },
    { id: 4, name: 'DELETE' }
])

//切换状态
const isSwitch = (e) => {
    console.log(e)
    formData.status = e
}

//排序选择
const handleChangeOrder = (val) => {
    formData.order = val
}

//编辑权限
const editRules = (row) => {
    console.log(row)
    titleValue.value = '编辑'
    rulesId.value = row.id

    formData.rule_id = row.rule_id
    //1是菜单 0是规则
    formData.menu = row.menu
    formData.name = row.name
    //后端规则
    formData.condition = row.condition
    //后端请求方式
    formData.method = row.method
    formData.status = row.status
    formData.order = row.order
    formData.icon = row.icon
    //前端路由
    formData.frontpath = row.frontpath
    dialogVisibleAddRules.value = true


}
//确定新增
const addRulesOk = async () => {
    if (titleValue.value == '新增') {
        const res = await addRulesFn(formData)
        console.log(res)
        if (res.msg && res.msg !== 'ok') {
            return
        }
        dialogVisibleAddRules.value = false
        getRulesList()
    } else if (titleValue.value == '编辑') {
        const res = await editRulesFn(rulesId.value, formData)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        dialogVisibleAddRules.value = false
        getRulesList()
    }
}



const Edit = ref('Edit')
const CirclePlusFilled = ref('CirclePlusFilled')
const Delete = ref('Delete')
//数据源
const data = ref([])
const rulesList = ref([])
//级联选择器
const props1 = reactive({
    checkStrictly: true,
    value: 'id',
    label: 'name',
    children: 'child',
    //直接返回id,否则会返回对象
    emitPath: false
})
const defaultProps = reactive({
    children: 'child',
    label: 'name',
})

const defaultKeys = ref([])

//是否开启loading状态
const isLoading = ref(false)

//获取权限列表
const getRulesList = async () => {
    isLoading.value = true
    const res = await getRulesListFn()
    isLoading.value = false
    console.log(res)
    if (res.msg && res.msg !== 'ok') {
        return ElMessage.error(res.msg)
    }
    //获取数据源
    data.value = res.data.list
    rulesList.value = res.data.rules
    //获取1级菜单id
    defaultKeys.value = res.data.list.map(item => {
        return item.id
    })

}
getRulesList()

//修改菜单权限启用状态
const switchChange = async (e, row) => {
    console.log(row)
    const res = await editStatusFn(row.id, e)
    if (res.msg && res.msg !== 'ok') {
        if (row.status == 0) {
            row.status = 1
        } else if (row.status == 1) {
            row.status = 0
        }
        ElMessage.error(res.msg)
        return
    }
    ElMessage({
        message: '状态修改成功',
        type: 'success',
    })

}

//删除
const delRules = async (row) => {

    const isdel = await ElMessageBox.confirm(
        '是否删除?',
        '删除',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).catch(err => err)   

    if (isdel == 'confirm') {
        const res = await delRulesFn(row.id)
        if (res.msg && res.msg !== 'ok') {
            return ElMessage.error(res.msg)
        }
        getRulesList()
    }
}
//添加子选项
const addSub=(id)=>{
    //先打开再赋值，因为打开对话框的过程中会进行数据初始化
    oppenDialog()
    formData.rule_id=id
}

</script>

<style lang='less' scoped>
.el-card {
    margin-top: 20px;

    .el-tree {
        margin-top: 20px;
    }

    .content {
        width: 100%;
        display: flex;
        align-items: center;
        padding-top: 20px;
        padding-bottom: 20px;

        .left {
            width: 200px;
            display: flex;
            align-items: center;

            .el-icon {
                margin-left: 10px;
                margin-right: 10px;
            }
        }

        .right {
            margin-left: auto;
            width: 200px;

            .el-switch {
                margin-right: 13px;
            }
        }
    }
}

:deep(.el-tree-node__content) {
    height: 40px;
}

.el-select {
    width: 100%;
}
</style>