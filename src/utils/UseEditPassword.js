//修改密码
import { editPasswordFn } from '@/api/login.js'
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
//抽离修改密码功能
export function useEditPassword() {
    //默认关闭修改密码对话框
    const dialogEditPassword = ref(false)
    //Form表单数据源
    const ruleFormEdit = reactive({
        oldpassword: '',
        password: '',
        repassword: ''
    })
    //Form表单验证规则
    const rulesEdit = reactive({
        oldpassword: [
            { required: true, message: '请输入原始密码', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        repassword: [
            { required: true, message: '请输入确认密码', trigger: 'blur' }
        ]
    })
    //获取From表单DOM元素
    const ruleFormRefEdit = ref(null)
    //调用修改密码API
    const editPasswordHandle = () => {
        ruleFormRefEdit.value.validate(async isValid => {
            if (!isValid) {
                return
            }
            //验证通过调用修改密码api接口
            const res = await editPasswordFn(ruleFormEdit)
            console.log(res)
            if (res.msg != 'ok') {
                //密码修改失败
                return ElMessage.error(res.msg)
            }
            //密码修改成功
            ElMessage({
                message: '密码修改成功',
                type: 'success',
            })
            //关闭对话框
            dialogEditPassword.value = false
        })
    }
    //导出属性和方法
    return {
        dialogEditPassword,
        ruleFormEdit,
        rulesEdit,
        ruleFormRefEdit,
        editPasswordHandle
    }
}