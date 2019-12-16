import Vue from "vue";
import App from "./App.vue";
// @ts-ignore
import ImageUploader from "vue-image-upload-resize";

Vue.config.productionTip = false;
Vue.use(ImageUploader);

new Vue({
    render: h => h(App)
}).$mount("#app");
