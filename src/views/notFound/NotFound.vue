<template>
    <div class="notFound">
        <el-card shadow="hover">
            <img src="~assets/404/very_sorry.png" alt="" srcset="">
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'NotFound'
}
</script>

<style lang="less">
    .notFound {
        // background: #f4f5f7;

        .el-card {
            width: 980px;
            margin: 30px auto 30px;
            background: #fff;
            border-radius: 10px;
        }
    }
</style>