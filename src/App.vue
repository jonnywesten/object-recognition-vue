<template>
    <div id="app" class="text-center">

        <img alt="Vue logo" src="./assets/logo.png"/>
        <h1>vue-object-recognition</h1>

        <div class="loading" v-if="!loaded">
            <div class="lds-facebook">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div class="lds-text">Loading tensorflow.js</div>
        </div>

        <div v-if="loaded" class="text-center">

            <ul class="nav nav-pills w-25 my-3 mx-auto">
                <li class="nav-item mx-auto" @click="setMode('image')">
                    <a class="nav-link"  v-bind:class="{ active: mode === 'image' }">From Image</a>
                </li>
                <li class="nav-item mx-auto" @click="setMode('camera')">
                    <a class="nav-link"  v-bind:class="{ active: mode === 'camera' }">Webcam</a>
                </li>
            </ul>

            <div v-if="mode === 'camera'">
                <Camera :model="model"/>
            </div>

            <div v-if="mode === 'image'">
                <ImageUpload :model="model"/>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import Camera from "./components/Camera.vue";
    import ImageUpload from "./components/ImageUpload.vue";
    import * as cocoSSD from '@tensorflow-models/coco-ssd';

    @Component({
        components: {
            Camera,
            ImageUpload
        }
    })
    export default class App extends Vue {

        model: cocoSSD.ObjectDetection;
        loaded: boolean = false;
        mode = "image";

        async mounted() {

            this.model = await cocoSSD.load();
            this.loaded = true;
        }

        setMode(mode: string){
            this.mode = mode;
        }
    }
</script>

<style lang="scss">


    @import "styles/loading";

    $primary: #41b883;

    @import "styles/bootstrap/bootstrap";

    html, body {
        width: 100%;
        height: 100%;
        background: #161618;
        color: #e1e1e1;
        font-family: Helvetica, Arial, sans-serif;
    }





</style>
