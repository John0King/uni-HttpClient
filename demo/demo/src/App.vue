<script lang="ts">
    import Vue from 'vue';
    export default Vue.extend({
        mpType: 'app',
        onLaunch() {
            console.log('App Launch')
        },
        onShow() {
            console.log('App Show')
        },
        onHide() {
            console.log('App Hide')
        }
    });
</script>
<style>
    /*每个页面公共css */
    @media screen and (min-width: 650px) {
        uni-app{
            max-width: 650px;
            margin: auto;
            background-color: gray;
        }
    }
</style>
