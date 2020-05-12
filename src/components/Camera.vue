<template>
    <div>
        <div class="video-player">
            <video ref="video"/>
            <canvas width="640" height="480" ref="canvas"/>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from "vue-property-decorator";
    import * as cocoSSD from '@tensorflow-models/coco-ssd';
    import PredictionRenderer from "./PredictionRenderer";

    @Component
    export default class Camera extends Vue {

        @Prop() private model: cocoSSD.ObjectDetection;

        private predictionRenderer = new PredictionRenderer();
        private predictionInterval: number | undefined;

        async mounted() {
            const video = await this.initWebcam(this.$refs.video);
            this.predictionInterval = setInterval(()=>{
                this.analyzeVideoFrame(video);
            }, 50);
        }

        beforeDestroy(){
            clearInterval(this.predictionInterval);
        }

        initWebcam(videoRef: Vue | Element | Vue[] | Element[]): Promise<HTMLVideoElement> {

            return new Promise(resolve => {

                navigator.mediaDevices
                    .getUserMedia({video: true})
                    .then(stream => {

                        const video = <HTMLVideoElement>videoRef;

                        video.srcObject = stream;
                        video.onloadedmetadata = () => {
                            video.play();
                            resolve(video);
                        }
                    });
            });
        }

        analyzeVideoFrame(video: HTMLVideoElement) {

            this.model.detect(video).then((predictions: Array<any>) => {

                const canvas = <HTMLCanvasElement>this.$refs.canvas;
                const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                this.predictionRenderer.render(predictions, ctx);
            });
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

    .video-player {
        position: relative;

        canvas, video {
            border-radius: 5px;
        }

        canvas {
            position: absolute;
            margin-left: -640px;
        }
    }
</style>
