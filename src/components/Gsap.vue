<template>
    <div>
        {{ data.num.toFixed(0) }}
    </div>
</template>
<script setup>
import { reactive,watch } from "vue"
import gsap from "gsap"

const props = defineProps({
    value:{
        type:Number,
        default:0
    }
})

const data = reactive({
    num:0
})

function AnimateFn(){
    gsap.to(data,{
        duration:0.5,
        num:props.value
    })
}

AnimateFn()

watch(()=>props.value,()=>AnimateFn())

</script>
