<template>
    <div>
        <div class="video-player">
            <video ref="video"></video>
            <canvas width="640" height="480" ref="canvas"></canvas>
        </div>
        <h6>{{ predictions }}</h6>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import * as cocoSSD from '@tensorflow-models/coco-ssd';
    import PredictionRenderer from "./PredictionRenderer";

    @Component
    export default class Camera extends Vue {

        @Prop() private model: cocoSSD.ObjectDetection;

        private video: HTMLVideoElement;
        private canvas: HTMLCanvasElement;
        private predictions: string = "...";
        private predictionRenderer = new PredictionRenderer();

        created() {
            this.webcam_init();
        }

        webcam_init() {

            navigator.mediaDevices
                .getUserMedia({video: true})
                .then(stream => {

                    this.video = <HTMLVideoElement>this.$refs.video;
                    this.canvas = <HTMLCanvasElement>this.$refs.canvas;

                    this.video.srcObject = stream;
                    this.video.onloadedmetadata = ()=>{

                        this.video.play();

                        const ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
                        this.detectFrame(this.video, this.model, ctx);
                    }
                });
        }


        detectFrame(video: HTMLVideoElement, model: cocoSSD.ObjectDetection, ctx: CanvasRenderingContext2D) {

            model.detect(video).then((predictions: Array<any>) => {

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                this.predictionRenderer.render(predictions, ctx);
                this.predictions = predictions.map(el => el.class).join(", ") || '...';

                requestAnimationFrame(() => {
                    this.detectFrame(video, model, ctx);
                });
            });
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .video-player{
        position: relative;

        canvas, video{
            border-radius: 15px;
        }

        canvas{
            position: absolute;
            margin-left: -640px;
        }
    }
</style>
