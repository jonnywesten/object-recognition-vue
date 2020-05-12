<template>
    <div>
        <div class="my-5">
            <canvas ref="canvas" width="1" height="1"/>

            <image-uploader :preview="false"
                            capture="environment" :debug="1" doNotResize="gif" :autoRotate="true" outputFormat="verbose"
                            @input="setImage">
                <label for="fileInput" slot="upload-label" class="upload-label d-block">
                    <div class="btn btn-primary mx-auto">
                        Click to upload
                    </div>
                </label>
            </image-uploader>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import * as cocoSSD from '@tensorflow-models/coco-ssd';
    import PredictionRenderer from "./PredictionRenderer";


    @Component
    export default class ImageUpload extends Vue {

        @Prop() private model: cocoSSD.ObjectDetection;

        private loaded = false;
        private predictionRenderer = new PredictionRenderer();

        setImage(file: any) {

            this.loaded = true;

            let $image = new Image();
            $image.src = file.dataUrl;
            $image.onload = (event: any) => {

                const canvas = <HTMLCanvasElement>this.$refs.canvas;
                const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

                const path = event.path || (event.composedPath && event.composedPath());
                ctx.canvas.width = Math.min(800, path[0].width);
                ctx.canvas.height = Math.min(600, path[0].height);

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.drawImage($image, 0, 0);

                this.model.detect(canvas).then((predictions: Array<Object>) => {
                    this.predictionRenderer.render(predictions, ctx);
                });
            };
        };
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

    #fileInput {
        display: none;
    }

    .upload-icon {
        fill: #e1e1e1;
    }

</style>
