
<template>
    <view class="t-page">
        <button @click="open">打开颜色选择器</button>
        <!-- 需要声明 ref  -->
        <t-color-picker ref="colorPicker" :color="color" @confirm="confirm"></t-color-picker>
    </view>
</template>
<script>
    import tColorPicker from '@/components/t-color-picker/t-color-picker.vue'
    export default {
        components: {
            tColorPicker
        },
        data() {
            return {
                color: {r: 255,g: 255,b: 0,a: 1}
            };
        },
        methods: {
            open(item) {
                // 打开颜色选择器
                this.$refs.colorPicker.open();
            },
            confirm(e) {
                console.log('颜色选择器返回值：'+ JSON.stringify(e))
            }
        }
    };
</script>