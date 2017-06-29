export default class VirtualScroll {
    constructor(vOptions) {

        this.view = vOptions.el;
        this.min;
        this.reference;
        this.xform;
        this.velocity;
        this.frame;
        this.timestamp;
        this.ticker;
        this.amplitude;
        this.target;
        this.timeConstant = 325;
        this.max = parseInt(getComputedStyle(this.view).height, 10) - innerHeight;
        this.offset = this.min  = 0;
        this.pressed = false;
        this.relative = (innerHeight - 30) / this.max;

        this.xform = 'transform';


        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.track = this.track.bind(this);
        this.autoscroll = this.autoscroll.bind(this);
        this.ypos = this.ypos.bind(this);


        if (typeof window.ontouchstart !== 'undefined') {
            this.view.addEventListener('touchstart', this.onMouseDown);
            this.view.addEventListener('touchmove', this.onMouseMove);
            this.view.addEventListener('touchend', this.onMouseUp);
        }

        this.view.addEventListener('mousedown', this.onMouseDown);
    }

    init()
    {
        // TODO virtualscroll init function
    }

    ypos(e) {
        // touch event
        if (e.targetTouches && (e.targetTouches.length >= 1)) {
            return e.targetTouches[0].clientY;
        }

        // mouse event
        return e.clientY;
    }

    scroll(y) {
        this.offset = (y > this.max) ? this.max : (y < this.min) ? this.min : y;
        this.view.style[this.xform] = 'translateY(' + (-this.offset) + 'px)';
    }

    track(r) {
        let now, elapsed, delta, v, _return

        _return = r || false;

        now = Date.now();
        elapsed = now - this.timestamp;
        this.timestamp = now;
        delta = this.offset - this.frame;
        this.frame = this.offset;

        v = 1000 * delta / (1 + elapsed);

        this.velocity = 0.8 * v + 0.2 * this.velocity;

        if(_return) {
            return this.velocity;
        }
    }



    autoscroll() {
        let elapsed, delta;

        if (this.amplitude) {
            elapsed = Date.now() - this.timestamp;
            delta = -this.amplitude * Math.exp(-elapsed / this.timeConstant);
            console.log('delta: ' + delta);
            if (delta > 0.5 || delta < -0.5) {
                this.scroll(this.target + delta);
                requestAnimationFrame(this.autoscroll);
            } else {
                this.scroll(this.target);
            }
        }
    }

    onMouseDown(e) {

        this.view.addEventListener('mousemove', this.onMouseMove)
        this.view.addEventListener('mouseup', this.onMouseUp);

        this.pressed = true;
        this.reference = this.ypos(e)
        this.amplitude = 0;
        this.velocity = this.amplitude;
        this.frame = this.offset;
        this.timestamp = Date.now();

        clearInterval(this.ticker);
        this.ticker = setInterval(this.track,100);

        e.preventDefault();
        //e.stopPropagation();

        return false;
    }

    onMouseMove(e) {
        let y, delta;

        if (this.pressed) {
            y = this.ypos(e);
            delta = this.reference - y;
            if (delta > 2 || delta < -2) {
                this.reference = y;
                this.scroll(this.offset + delta);
            }
        }

        e.preventDefault();
        //e.stopPropagation();
        return false;
    }

    onMouseUp(e) {

        this.view.removeEventListener('mousemove', this.onMouseMove);
        this.view.removeEventListener('mouseup', this.onMouseUp);

        this.pressed = false;

        clearInterval(this.ticker);
        if (this.velocity > 10 || this.velocity < -10) {
            this.amplitude = 0.8 * this.velocity;
            this.target = Math.round(this.offset + this.amplitude);
            this.timestamp = Date.now();
            requestAnimationFrame(this.autoscroll);
        }


        e.preventDefault();
        //e.stopPropagation();
        return false;
    }
}