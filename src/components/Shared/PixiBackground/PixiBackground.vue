<template>
    <div ref="bgRenderer" class="pixibackground"></div>
</template>

<script>
    import * as PIXI from 'pixi.js';
    import { TweenMax} from 'gsap';
    import ColorPropsPlugin from '../../../../node_modules/gsap/ColorPropsPlugin'
    import { mapMutations, mapGetters, mapState } from 'vuex';
    import GlobalState from '../../../store/State'

    export default {
        name: 'PixiBackground',
        created() {
            this.$store.watch((state) => (state.mouse), this.moveFlare, {deep:true})
            this.$store.watch((state) => (state.app.currentColors), this.onColorChange, {deep:true})
            this.$store.watch((state) => {state.app.globalState}, this.onChangeState, {deep:true} );
            window.addEventListener('resize', this.onResize);
        },
        computed: {
            ...mapState({
                    currentState: state => state.app.globalState
                })
        },
        mounted() {
            this.init()
        },
        methods: {
            ...mapMutations([
                'setLoading',
                'setAppReady',
                'setAppGlobalState',
                'setDefaultColors'
            ]),
            init() {
                this.renderer = new PIXI.WebGLRenderer(window.innerWidth, window.innerHeight, { transparent: true }, true);
                this.stage =  new PIXI.Container();

                this.loading();

                this.colors = {first:this.$store.getters.getCurrentColor('first'), second:this.$store.getters.getCurrentColor('second')}
                this.perc = 0.5;

                this.tm = 0;
                this.blobFrames = [];
                this.shadowFrame = [];
                this.shaderFrag = `
                    precision mediump float;

                    varying vec2 vTextureCoord;
                    uniform sampler2D uSampler;
                    uniform vec2 resolution;
                    uniform float time;

                    void main(void){
                       vec2 uv = gl_FragCoord.xy/resolution.xy;
                       float strength = 16.0;
                       float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (time * 10.0);
                       vec4 grain = vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;

                       gl_FragColor = texture2D(uSampler, vTextureCoord) + grain;
                    }
                `;
                this.filter = new PIXI.Filter( null, this.shaderFrag);
                this.createFlare();
                this.stage.filterArea = this.renderer.screen;
                this.stage.filters = [this.filter];

                this.$refs.bgRenderer.appendChild(this.renderer.view);

                let VideoTexture = PIXI.Texture.fromVideo('/static/video/medialart.mp4')
                this.generalVideo = new PIXI.Sprite(VideoTexture);

                this.generalVideo.alpha = 0.15;
                this.generalVideo.x = 0;
                this.generalVideo.y = 0;

                this.stage.addChild(this.generalVideo);

                this.animate();
            },

            createFlare() {
                let canvas = document.createElement('canvas');
                canvas.width = 1080;
                canvas.height = 1080;
                let context = canvas.getContext('2d');
                let grad = context.createRadialGradient(540,540,0,540,540,763.68);

                grad.addColorStop(0, 'rgba(51,51,51,1)');
                grad.addColorStop(0.35, 'rgba(51,51,51,0.5)');
                grad.addColorStop(0.70, 'rgba(51,51,51,0)');

                context.setTransform(1,0,0,1,0,0);
                context.fillStyle = grad;
                context.fillRect(0, 0, 1080,1080);

                this.flare = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));

                this.flare.x = window.screen.availWidth/2 - this.flare.width/2;
                this.flare.y = window.screen.availHeight/2 - this.flare.height/2;
                this.flare.alpha = 0;

                this.stage.addChild(this.flare);
            },

            loading() {
                this.loader = new PIXI.loaders.Loader();
                this.loader.add('/static/sprite/blob-0.json')
                    .add('/static/sprite/blob-1.json')
                    .add('/static/sprite/blob-2.json')
                    .add('/static/sprite/blob-3.json')
                    .add('/static/sprite/blob-4.json')
                    .add('/static/sprite/blob-5.json')
                    .add('/static/sprite/blob-6.json')
                    .add('/static/sprite/blob-7.json')
                    .add('/static/sprite/ombra-0.json')
                    .add('/static/sprite/ombra-1.json')
                    .add('/static/sprite/ombra-2.json')
                    .add('/static/sprite/ombra-3.json')
                    .add('/static/sprite/ombra-4.json')
                    .add('/static/sprite/ombra-5.json')
                    .add('/static/sprite/ombra-6.json')
                    .add('/static/sprite/ombra-7.json')
                    .add('/static/sprite/prova-blob.mp4')
                    .add('/static/video/medialart.mp4')
                    .load(this.setup);

                this.loader.onProgress.add(() => {
                    this.setLoading(this.loader.progress);
                });

                this.loader.onComplete.add(() => {
                    this.setAppGlobalState(GlobalState.INTRO);
                });
            },
            setup() {
                for (var i = 0; i < 64; i++) {
                    var val = i < 10 ? '0' + i : i;

                    //console.log('blob_00' + val + '.png');
                    //this.blobFrames.push(PIXI.Texture.fromFrame('blob000' + val + '.png'));
                    this.shadowFrame.push(PIXI.Texture.fromFrame('ombra_000' + val + '.png'));
                }
                this.createBlob();
            },
            createBlob() {

                let texture = PIXI.Texture.fromVideo('/static/sprite/prova-blob.mp4');
                let source = texture.baseTexture.source;
                this.blobContainer = new PIXI.Container();
                this.blob = new PIXI.Sprite(texture);
                this.blobShadows = new PIXI.extras.AnimatedSprite(this.shadowFrame);
                source.loop = true;
                this.blobShadows.play();

                this.blob.width = this.blobShadows.width = 800;
                this.blob.height = this.blobShadows.height = 800;

                this.blob.animationSpeed = this.blobShadows.animationSpeed =  .3;
                this.blob.x = this.blobShadows.x = window.screen.availWidth/2 - this.blob.width/2;
                this.blob.y = this.blobShadows.y = window.screen.availHeight/2 - this.blob.height/2;

                this.blob.alpha = 0;
                this.blobShadows.alpha = 0;

                this.stage.addChild(this.blobShadows);
                this.stage.addChild(this.blob);

                let canvas = document.createElement('canvas');
                let dimensione = 400;

                canvas.width = dimensione;
                canvas.height = dimensione;
                let context = canvas.getContext('2d');
                let grad = context.createRadialGradient(dimensione/2,dimensione/2,0,dimensione/2,dimensione/2,dimensione * this.perc/1.3);

                grad.addColorStop(0, this.colors.first);
                grad.addColorStop(1, this.colors.second);

                context.setTransform(1,0,0,1,0,0);
                context.fillStyle = grad;
                context.fillRect(0, 0, 800,800);

                this.bgTexture = PIXI.Texture.fromCanvas(canvas)
                this.blobBg = new PIXI.Sprite(this.bgTexture);
                this.blobBg.x = window.screen.availWidth/2 - this.blobBg.width/2;
                this.blobBg.y = window.screen.availHeight/2 - this.blobBg.height/2;
                this.blobBg.mask = this.blob;
                this.stage.addChild(this.blobBg);

                this.onResize();

            },
            onColorChange() {
                let falsper=.1;
                if (this.$store.getters.getFirstColorScore>0){
                   falsper= this.$store.getters.getFirstColorScore;
                } else {
                    this.setDefaultColors();
                    return
                }
                TweenMax.to(this, 3, {perc: falsper});
                TweenMax.to(this.colors, 3, {colorProps:{first:this.$store.getters.getCurrentColor('first')}});
                TweenMax.to(this.colors, 3, {colorProps:{second:this.$store.getters.getCurrentColor('second')}, onUpdate:this.reDrowBlobBG});
            },

            reDrowBlobBG() {
                let canvas = document.createElement('canvas');
                let dimensione = 400;

                canvas.width = dimensione;
                canvas.height = dimensione;
                let context = canvas.getContext('2d');
                let grad = context.createRadialGradient(dimensione/2,dimensione/2,0,dimensione/2,dimensione/2,dimensione*(this.perc/1.3));

                grad.addColorStop(0, this.colors.first);
                grad.addColorStop(1, this.colors.second);

                context.setTransform(1,0,0,1,0,0);
                context.fillStyle = grad;
                context.fillRect(0, 0, 800,800);

                this.bgTexture = PIXI.Texture.fromCanvas(canvas);
                this.blobBg.texture = this.bgTexture;
            },
            animate() {
                requestAnimationFrame(this.animate);

                let v2 = this.filter.uniforms.resolution;
                v2[0] = this.renderer.screen.width;
                v2[1] = this.renderer.screen.height;
                this.filter.uniforms.resolution = v2;

                this.tm+=0.01;
                this.filter.uniforms.time = this.tm;

                this.renderer.render(this.stage);
            },

            moveFlare(obj) {
                let x;
                let y;
                let centerX = window.innerWidth/2;
                let centerY = window.innerHeight/2;

                let maxX = centerX + centerX * 0.20;
                let minX =  centerX - centerX * 0.20;

                let maxY = centerY + centerY * 0.20;
                let minY =  centerY - centerY * 0.20;
                x = (obj.mouseX > maxX ) ? maxX : (obj.mouseX < minX ) ? minX : obj.mouseX;
                y = (obj.mouseY > maxY ) ? maxY : (obj.mouseY < minY ) ? minY : obj.mouseY;


                TweenMax.killChildTweensOf(this.flare.position);
                TweenMax.to(this.flare.position, 1.5, {x: x - 540, y: y - 580})
            },

            onChangeState() {
                switch (this.currentState) {
                    case GlobalState.INTRO:
                        TweenMax.to(this.flare, 2, {alpha: 1, delay: 1});
                        break;
                    case GlobalState.BASE:
                        TweenMax.to(this.blob, 3, {alpha: 1});
                        TweenMax.to(this.blobShadows, 3, {alpha: 1});
                        break;
                    case GlobalState.RESULT:
                        TweenMax.to(this.blob, 3, {alpha: 0});
                        TweenMax.to(this.blobShadows, 3, {alpha: 0});
                        break;
                }
            },

            onResize() {
                let w = window.innerWidth;
                let h = window.innerHeight;

                this.renderer.view.style.width = w + "px";
                this.renderer.view.style.height = h + "px";
                this.renderer.resize(w,h);

                let maxwhh = window.innerWidth;
                let consthhpadding = 50;

                if (window.innerHeight < maxwhh){
                    maxwhh = window.innerHeight;
                }

                if (maxwhh < 450){
                    maxwhh=450;
                }
                if (maxwhh > 800){
                    maxwhh=800;
                }

                this.blobBg.width = this.blob.width = this.blobShadows.width = maxwhh-consthhpadding;
                this.blobBg.height= this.blob.height = this.blobShadows.height = maxwhh-consthhpadding;

                this.blobBg.x = window.innerWidth/2 - this.blobBg.width/2;
                this.blobBg.y = window.innerHeight/2 - this.blobBg.height/2;

                this.blob.x = this.blobShadows.x =  window.innerWidth/2 - this.blob.width/2;
                this.blob.y = this.blobShadows.y = window.innerHeight/2 - this.blob.height/2;
            }
        }
    }
</script>

<style>
    .pixibackground {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
    }
</style>