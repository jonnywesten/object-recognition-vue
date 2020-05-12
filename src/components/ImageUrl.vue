<template>
    <div>
        <canvas ref="canvas" width="1" height="1"/>

        <input type="text" class="d-block w-75 mx-auto" v-model="url"/>
        <div class="btn btn-primary" v-on:click="fetchImage">Load Image Url</div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import * as cocoSSD from '@tensorflow-models/coco-ssd';
    import PredictionRenderer from "./PredictionRenderer";


    @Component
    export default class ImageUrl extends Vue {

        @Prop() private model: cocoSSD.ObjectDetection;

        private url: string = '';
        private predictionRenderer = new PredictionRenderer();

        fetchImage() {
            console.log(this.url);

            let $image = new Image();
            $image.setAttribute("crossorigin", "anonymous");
            $image.crossOrigin = "";
            $image.src =  this.url;
            $image.onload = (evt: any) => {

                const canvas = <HTMLCanvasElement>this.$refs.canvas;
                const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.canvas.width = Math.min(800, evt.path[0].width);
                ctx.canvas.height = Math.min(600, evt.path[0].height);

                ctx.drawImage($image, 0, 0);

                this.model.detect(canvas).then((predictions: Array<Object>) => {
                    this.predictionRenderer.render(predictions, ctx);
                });
            };

        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

</style>
