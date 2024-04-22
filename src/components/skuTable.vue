<!-- 多规格表格 -->
<template>
    <el-form-item label="规格设置">
        <table cellpadding="0" cellspacing="0">
            <thead>
                <tr>
                    <th v-for="(item,i) in tableTitle" :key="i" :rowspan="item.row" :colspan="item.col">
                        {{ item.name }}
                    </th>
                </tr>
                <tr>
                    <th v-for="(item,i) in isSkuVal" :key="i">
                        {{ item.name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,i) in skuTable" :key="i">
                    <td v-for="(sub,index) in item.skus" :key="index" width="60px">
                        {{ sub.value }}                    
                    </td>
                   
                    <td>
                        <el-input v-model="item.oprice" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.pprice" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.cprice" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.stock" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.volume" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.weight" type="number"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.code" ></el-input>
                    </td>
                </tr>
            </tbody>
        </table>

    </el-form-item>
</template>

<script setup>
import { initTable } from '@/utils/useSku.js'
const { isSkuVal, tableTitle, skuTable } = initTable()

console.log(skuTable.value)

</script>

<style lang='less' scoped>
 table{
    border: 1px solid #dbdbdb;
    width: 100%;
    thead tr th{
        border: 1px solid #dbdbdb;        
    }
    tbody tr td{
        border: 1px solid #dbdbdb;
        text-align: center;
    }
 } 
</style>