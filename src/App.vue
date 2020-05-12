<template>
    <div id="app" class="text-center py-5">

        <img alt="Vue logo" src="./assets/logo.png"/>
        <h1>Object recognition</h1>

        <div v-if="loading" class="mt-4">Loading tensorflow.js..</div>

        <div v-if="!loading" class="text-center">

            <ul class="nav nav-pills w-50 my-3 mx-auto pr-4">
                <li class="nav-item mx-auto" @click="setMode('url')">
                    <a class="nav-link" v-bind:class="{ active: mode === 'url' }">Image URL</a>
                </li>
                <li class="nav-item mx-auto" @click="setMode('image')">
                    <a class="nav-link" v-bind:class="{ active: mode === 'image' }">Upload Image</a>
                </li>
                <li class="nav-item mx-auto" @click="setMode('camera')">
                    <a class="nav-link" v-bind:class="{ active: mode === 'camera' }">Webcam</a>
                </li>
            </ul>

            <div v-if="mode === 'camera'">
                <Camera :model="model"/>
            </div>

            <div v-if="mode === 'image'">
                <ImageUpload :model="model"/>
            </div>

            <div v-if="mode === 'url'">
                <ImageUrl :model="model"/>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import Camera from "./components/Camera.vue";
    import ImageUpload from "./components/ImageUpload.vue";
    import ImageUrl from "./components/ImageUrl.vue";
    import * as cocoSSD from '@tensorflow-models/coco-ssd';

    @Component({
        components: {
            Camera,
            ImageUpload,
            ImageUrl
        }
    })
    export default class App extends Vue {

        model: cocoSSD.ObjectDetection | undefined;
        loading = true;
        mode = "url";

        async created() {
            this.model = await cocoSSD.load();
            this.loading = false;
        }

        setMode(mode: string) {
            this.mode = mode;
        }
    }
</script>

<style lang="scss">

    $primary: #41b883;
    $text: #e1e1e1;

    @import "styles/bootstrap/bootstrap";

    html, body {
        width: 100%;
        height: 100%;
        background: #161618;
        color: $text;
        font-family: Helvetica, Arial, sans-serif;
    }

    .btn-primary{
        background: $primary;
        color:  $text;
    }

    .nav-item{
        cursor: pointer;
    }

</style>
