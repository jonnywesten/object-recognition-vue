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


    @Component
    export default class Camera extends Vue {

        @Prop() private model: cocoSSD.ObjectDetection;

        private video: HTMLVideoElement;
        private canvas: HTMLCanvasElement;
        private predictions: string = "...";

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
                        this.detectFrame(this.video, this.model);
                    }
                });
        }


        detectFrame(video: HTMLVideoElement, model: cocoSSD.ObjectDetection) {

            model.detect(video).then((predictions: Array<any>) => {

                this.renderPredictions(predictions);

                this.predictions = predictions.map(el => el.class).join(", ") || '...';

                requestAnimationFrame(() => {
                    this.detectFrame(video, model);
                });
            });
        }

        renderPredictions(predictions:Array<any>) {


            const ctx = this.canvas.getContext("2d") || new CanvasRenderingContext2D();

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // Font options.
            const font = "16px sans-serif";
            ctx.font = font;
            ctx.textBaseline = "top";

            predictions.forEach(prediction => {
                const x = prediction.bbox[0];
                const y = prediction.bbox[1];
                const width = prediction.bbox[2];
                const height = prediction.bbox[3];
                // Draw the bounding box.
                ctx.strokeStyle = "#00FFFF";
                ctx.lineWidth = 4;
                ctx.strokeRect(x, y, width, height);
                // Draw the label background.
                ctx.fillStyle = "#00FFFF";
                const textWidth = ctx.measureText(prediction.class).width;
                const textHeight = parseInt(font, 10); // base 10
                ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
            });

            predictions.forEach(prediction => {
                const x = prediction.bbox[0];
                const y = prediction.bbox[1];
                // Draw the text last to ensure it's on top.
                ctx.fillStyle = "#000000";
                ctx.fillText(prediction.class, x, y);
            });
        };

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
