
/* 20 */
/***/ function(module, exports, __webpack_require__) {

    'use strict';

    var Behaviour = __webpack_require__(21);
    var EventDispatcher = __webpack_require__(9);
    var EventList = __webpack_require__(10);
    var support = __webpack_require__(12);
    var EnterFrame = __webpack_require__(22);
    var CubicBezier = __webpack_require__(24);

    var $setTimeout = __webpack_require__(14);

    var extend = __webpack_require__(19);

    //TODO:
    //MsPointer/Pointer
    //custom scrollbars
    //better manage enterframe
    //add mousedrag
    //scroll on text select
    //continu scroll from nested to parent if cannot scroll
    //add variable to reference scroller

    /**
     * throttle the touchmove event no to be fired moire than 60times/seconds
     * in milliseconds
     */
    var TOUCH_MOVE_THROTTLE = 0; //10;

    /**
     * Minimum movement of touch required to be considered a drag.
     */
    var MIN_TRACKING_FOR_DRAG = 10;

    /**
     * Time delay before canceling momentum.
     */
    var MAX_DELAY_FOR_DRAG = 300;

    function ScrollBehaviour(options, view) {

        var self = this;

        Behaviour.call(this, options, view);

        this.options = extend({

                friction: 1, //0.1, //higher = faster more friction
                deccelerationFriction: 0.001, // 0.0006 //higher = more friction,
                minSpeed: 0.15, // minimum speed needed before the animation stop (px/ms)

                usetransition: false, //use css transition for css touch deceleration
                cssEasing: 'cubic-bezier(0, 0.33, 0.66, 1)', //easing used for css touch deceleration
                touchThrottle: TOUCH_MOVE_THROTTLE, //min delay between two touchmove event
                minDragDistance: MIN_TRACKING_FOR_DRAG, //min touch distance before trigger scrollevent
                maxDragDelay: MAX_DELAY_FOR_DRAG, //delay to consider scroll is static
                bypassNativeScroll: true, //use native scroll or smooth scroll
                useHtmlScroll: true, //use the html scroll bar to scroll the view ?
                autoFocus: true, //focus htmlscroll bar on view creation ?
                useCustomScrollBar: false,
                contentWrapper: null,
                contentWrapClass: 'scrollview-content-wrapper', //the class added to the content wrapper

                direction: 'vertical', //  || horizontal || both
                moveContent: true,
                momentum: true }, // move content to emulate scroll or only publish scroll value

            options || {});

        this.frame = EnterFrame.getInstance();

        if (support.touch) {
            this.options.useHtmlScroll = false;
        }

        this.scrollToBinded = this.scrollTo.bind(this);
        this.jumpToBinded = this.jumpTo.bind(this);
        this.updateBinded = this.update.bind(this);
        this.disableBinded = this.disable.bind(this);
        this.enableBinded = this.enable.bind(this);

        this.view.on('scrollto', this.scrollTo, this);
        this.view.on('jumpto', this.jumpTo, this);
        this.view.on('updatescroll', this.update, this);
        this.view.on('disable', this.disable, this);
        this.view.on('enable', this.enable, this);

        //this.view.$el.addClass('scrollview');

        // if( this.options.contentWrapper == null ){
        //   this.view.$el.wrapInner( '<div class="'+this.options.contentWrapClass+'"></div>' );
        //   this.$contentWrap = this.view.$( "." + this.options.contentWrapClass ).eq(0);
        // } else{
        //   this.$contentWrap = $( this.options.contentWrapper ).addClass( this.options.contentWrapClass );
        // }

        //this.$fakeScroller = null;
        //this.$htmlFakeScroller = null;

        this.ratioX = 1;
        this.ratioY = 1;

        //this.$scroller = this.options.useHtmlScroll ? this.$win : this.view.$el;

        // if( !this.options.bypassNativeScroll ){
        //   this.view.$el.addClass('native-scroll');
        //   this.$html.addClass('native-scroll');
        // } else {
        //   this.view.$el.addClass('bypassed-scroll');
        //   this.$html.addClass('bypassed-scroll');
        // }

        // if( this.options.useHtmlScroll ){
        //   this.$html.addClass('one-scroll-mode');
        //   this.view.$el.addClass('one-scroll-mode');
        // }

        // this.winHeight = this.$win.height();
        // this.winWidth  = this.$win.width();

        this.scrollHeight = 0;
        this.contentHeight = 0;
        this.maxScrollHeight = 0;
        this.scrollTop = 0;
        this.savedScrollTop = null; //to restore scrollpos on _focusTarget
        this.realScrollTop = 0;
        // this.lastRealScrollTop = null;
        // this.realScrollTopDist = 0;

        this.scrollWidth = 0;
        this.contentWidth = 0;
        this.maxScrollWidth = 0;
        this.scrollLeft = 0;
        this.savedScrollLeft = null; //to restore scrollpos on _focusTarget
        this.realScrollLeft = 0;
        // this.lastRealScrollLeft = null;
        // this.realScrollLeftDist = 0;

        this.touchDeltaX = 0;
        this.touchDeltaY = 0;

        this.totalTouchMoveX = 0;
        this.totalTouchMoveY = 0;

        this.textPosX = 0;
        this.textPosY = 0;

        this.scrollPosX = 0;
        this.scrollPosY = 0;

        this.touchEvents = [];

        this.enabled = true; //is the scroll active ?
        this.focused = false; //is the view active/focused?
        // this.scrolling = false;
        this.hasMoved = false;
        this.preventClick = false;
        this.momentumProps = false;

        //on window load, the browser will try to autoScroll. to avoid this, we add a setTimeout only on the first jump
        this.hasJumpedOnce = false;

        //cache binded method to be able to remove listeners on it if needed
        //this._onScrollBinded    = this._onScroll.bind(this);
        //this._onScrollEnd = this.onScrollEnd.bind(this);

        this._onPointerDown = this.onPointerDown.bind(this);
        this._onPointerMove = this.onPointerMove.bind(this);
        this._onPointerUp = this.onPointerUp.bind(this);
        this._$deccelerate = this.$deccelerate.bind(this);

        //this._updateScreenBinded = this._updateScreen.bind(this);
        this._$watch = this.$watch.bind(this);
        // this._focusTargetBinded = this._focusTarget.bind(this);
        // this._releaseTargetBinded = this._releaseTarget.bind(this);
        //    this._onUserFocusBinded = this._onUserFocus.bind(this);

        this._wheelBinded = this.wheel.bind(this);

        //save the 2 last touchmove timestamp and delta in order to use it on touchend.
        //sometimes, touchend and the last touchmove will be the same, so we will have to use the previous touchmove event
        this.touchTimestampArr = [];
        this.touchScrollArr = [];

        this.updateBinded = this.update.bind(this);
        // this._stopPropagationBinded = this._stopPropagation.bind(this);

        this.bindEvents();
    };

    ScrollBehaviour.prototype = Object.create(Behaviour.prototype);
    ScrollBehaviour.prototype.constructor = Behaviour;

    ScrollBehaviour.prototype.disable = function () {
        this.enabled = false;
        //this.view.$el.addClass( this.options.disabledClass );
        //this._releaseTarget();
    };

    ScrollBehaviour.prototype.enable = function () {

        var self = this;

        this.enabled = true;
        //this.view.$el.removeClass( this.options.disabledClass );

        /*this._focusTarget();
         setTimeout(function () {
         //get back to last scrollpos or to 0
         self.jumpTo(self.$contentWrap.data('currScroll'));
         });*/
    };

    ScrollBehaviour.prototype.destroy = function () {

        this.view.off('disable', this.disable, this);
        this.view.off('enable', this.enable, this);
        this.view.off('scrollto', this.scrollTo, this);
        this.view.off('jumpto', this.jumpTo, this);
        this.view.off('updatescroll', this.update, this);
        this.view.off('disable', this.disable, this);
        this.view.off('enable', this.enable, this);

        // if (support.touch) {
        //this.$contentWrap[0].removeEventListener(support.transitionEnd, this._onScrollEnd);
        this.view.$el[0].removeEventListener(support.uidown, this._onPointerDown);
        document.removeEventListener(support.uimove, this._onPointerMove);
        document.removeEventListener(support.uiup, this._onPointerUp);
        // }

        this.frame.removeListener(EventList.ENTER_FRAME, this._$watch);
        //
        this.frame.removeListener(EventList.ENTER_FRAME, this._$deccelerate);
        //this.frame.removeListener(EventList.ENTER_FRAME, self._updateScreenBinded);

        //  EventDispatcher.unsubscribe('scroll:focus', this._releaseTargetBinded);
        // EventDispatcher.unsubscribe('scroll:stoppropagation', this._stopPropagationBinded);

        // if (this.options.bypassNativeScroll) {
        //   this.view.el.removeEventListener(support.uidown, this._onPointerDown, false);
        // }

        // this.view.$el.off(support.uidown + ' DOMMouseScroll mousewheel', this._onUserFocusBinded );
        this.view.$el.off('DOMMouseScroll mousewheel', this._wheelBinded);
    };

    ScrollBehaviour.prototype.bindEvents = function () {

        var self = this;

        // this.stopPropagation = false;

        // if( this.options.useHtmlScroll ){
        //   //stop propagation for nested scrolls
        //   EventDispatcher.subscribe('scroll:stoppropagation', this._stopPropagationBinded, this);
        //   this.view.$el.on(support.uidown + ' DOMMouseScroll mousewheel', this._onUserFocusBinded );
        //   EventDispatcher.subscribe('scroll:focus', this._releaseTargetBinded, this);
        // }

        // if( this.options.autoFocus ){
        //   this._focusTarget();
        // }

        //    if (this.options.bypassNativeScroll) {

        this.view.$el.addEventListener(support.uidown, this._onPointerDown, false);
        //this._animate(this.scrollLeft, this.scrollTop, true);
        //  this.frame.addListener(EventList.ENTER_FRAME, this._$watch, 'scrollstep');

        //  }

        this.view.$el.addEventListener("mousewheel", this._wheelBinded, false);
        this.view.$el.addEventListener("DOMMouseScroll", this._wheelBinded, false);

        //manage scroll event for non touch devives
        //TODO:: ANABLE THIS FEATURE FOR TOUCH DEVICEWithut bypassed touch
        // if ( !support.touch || (support.touch && !this.options.bypassNativeScroll ) ){
        //   this.$scroller.on("scroll", this._onScrollBinded);
        // }

        this.view.on('disable', this.disable, this);
        this.view.on('enable', this.enable, this);
    };

    // ScrollBehaviour.prototype._stopPropagation = function(){

    //   var self = this;
    //   clearTimeout( this.stopPropagtionTimer );
    //   this.stopPropagation = true;
    //   this.stopPropagtionTimer = setTimeout(function(){
    //     self.stopPropagation = false;
    //   },300);

    // };

    // ScrollBehaviour.prototype._onUserFocus = function(){
    //   if( !this.stopPropagation && this.enabled ){
    //     EventDispatcher.publish('scroll:stoppropagation');
    //     if( !this.focused ){
    //       this._focusTarget();
    //     }
    //   }
    // };

    ScrollBehaviour.prototype.focus = function () {};

    ScrollBehaviour.prototype.release = function () {};

    /** ---------------------------------------------------------------------------*/
    /** ----------------------- TOUCH PLATFORM ------------------------------------*/
    /** ---------------------------------------------------------------------------*/

    ScrollBehaviour.prototype._computeMomentum = function (direction, distance, time) {

        var scrollProp = direction == 'vertical' ? 'scrollPosY' : 'scrollPosX';
        var maxScrollProp = direction == 'vertical' ? 'scrollHeight' : 'scrollWidth';

        var speed = Math.abs(distance) / time;
        var maxDistLower = this[maxScrollProp] - this[scrollProp];
        var momentumLength, momentumDuration;

        /** momentum */
        momentumLength = speed * speed / (this.options.deccelerationFriction * 2);
        momentumDuration = speed / this.options.deccelerationFriction;

        if (distance < 0 && momentumLength > this[scrollProp]) {
            //would get over top

            momentumDuration = momentumDuration * this[scrollProp] / momentumLength;
            momentumLength = this[scrollProp];
        } else if (distance > 0 && momentumLength > maxDistLower) {
            //would get over bottom

            momentumDuration = momentumDuration * maxDistLower / momentumLength;
            momentumLength = maxDistLower;
        }

        momentumLength = momentumLength * (distance > 0 ? 1 : -1);

        return {
            length: momentumLength >> 0,
            duration: momentumDuration >> 0
        };
    };

    ScrollBehaviour.prototype.$deccelerate = function () {

        if (this.momentumProgress >= this.momentumDuration) {
            //this.frame.removeListener(EventList.ENTER_FRAME, this._$deccelerate);
            this.stopDecceleration();
            return;
        }

        var timestamp = Date.now();
        var diff = timestamp - this.momentumStartTime;
        var e = this.momentumProgress !== 0 ? CubicBezier(this.momentumEasing[0], this.momentumEasing[1], this.momentumEasing[2], this.momentumEasing[3], this.momentumProgress / this.momentumDuration, this.momentumDuration) : 0;

        this.momentumProgress = this.momentumProgress + diff;
        this.momentumStartTime = timestamp;

        /**
         * less pecise but a lot fatser than the technic used on scroll end
         */
        this.scrollPosX = this.scrollPosXBeforeMomentum + e * this.momentumdistanceLeft >> 0;
        this.scrollPosY = this.scrollPosYBeforeMomentum + e * this.momentumdistanceTop >> 0;

        // if( this.options.moveContent
        //   && (!support.transition || !this.options.usetransition ) ){

        //   //  ~n+1 === n*-1
        //   this.position( this.$contentWrap[0], ~this.scrollLeft+1, ~this.scrollTop+1 );

        //   for (var i = 0; i < this.fixedLength; i++){
        //     this.position(this.$fixed[i], this.scrollLeft, this.scrollTop);
        //   }

        // }

        if (this.view.onScroll) {
            this.view.onScroll(this.scrollLeft, this.scrollTop, this.momentumProps, this.contentHeight);
        }
    };

    ScrollBehaviour.prototype._computeFakeMomentum = function (distX, distY, duration, easing) {

        this.momentumStartTime = Date.now();
        this.momentumProgress = 0;
        this.momentumDuration = duration;

        this.scrollPosXBeforeMomentum = this.scrollPosX;
        this.scrollPosYBeforeMomentum = this.scrollPosY;

        this.momentumdistanceLeft = distX;
        this.momentumdistanceTop = distY;

        this.momentumEasing = easing || [0, 0.33, 0.66, 1];
    };

    ScrollBehaviour.prototype._setMomentum = function (momentumDistanceLeft, momentumDistanceTop, momentumDuration, momentumEasing) {

        console.log("_setMomentum", momentumDistanceLeft, momentumDistanceTop);

        /**
         * launch requestanimframe loop
         * sync with the css transition to update this.scrollTop
         */
        this._computeFakeMomentum(momentumDistanceLeft, momentumDistanceTop, momentumDuration, momentumEasing);

        /** launch the css transition */
        this._scrollBy(momentumDistanceLeft, momentumDistanceTop, momentumDuration, momentumEasing);
    };

    /*_updateScreen: function () {
     this._animate(this.scrollLeft, this.scrollTop);
     },*/

    ScrollBehaviour.prototype.onPointerDown = function (e) {

        if (!this.enabled /*|| !this.focused */) return;

        //this.stopDecceleration();

        document.addEventListener(support.uimove, this._onPointerMove, false);
        document.addEventListener(support.uiup, this._onPointerUp, false);

        this.totalTouchMoveX = 0;
        this.totalTouchMoveY = 0;
        this.preventClick = false;
        this.hasMoved = false;
        //this.isDragging = true;

        this.touchEvent = support.touch ? e.touches[0] || e.changedTouches[0] : e;
        this.touchTimestamp = e.timeStamp || Date.now();

        this.touchPositionX = this.touchEvent.pageX;
        this.touchPositionY = this.touchEvent.pageY;

        this.touchEvents.length = 0;

        //this.frame.removeListener(EventList.ENTER_FRAME, this._updateScreenBinded);
        //this.frame.addListener(EventList.ENTER_FRAME, this._updateScreenBinded);

        //Start requestAnimationFrame loop

        //this.frame.start();

        this.stopDecceleration();

        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    };

    ScrollBehaviour.prototype.onPointerMove = function (e) {

        if (!this.enabled /*|| !this.focused */) return;

        e.preventDefault();
        e.stopPropagation();

        this.newTouchTimestamp = e.timeStamp || Date.now();

        //throttle the touchmove function no to trigger it too often
        if (this.newTouchTimestamp - this.touchTimestamp < TOUCH_MOVE_THROTTLE) return;

        this.touchEvent = support.touch ? e.touches[0] || e.changedTouches[0] : e;

        this.touchDeltaX = this.touchEvent.pageX - this.touchPositionX;
        this.touchPositionX = this.touchEvent.pageX;
        this.totalTouchMoveX += Math.abs(this.touchDeltaX);

        this.touchDeltaY = this.touchEvent.pageY - this.touchPositionY;
        this.touchPositionY = this.touchEvent.pageY;
        this.totalTouchMoveY += Math.abs(this.touchDeltaY);

        // We need to move at least n pixels for the scrolling to initiate
        // where n = MIN_TRACKING_FOR_DRAG
        if (this.totalTouchMoveX > MIN_TRACKING_FOR_DRAG || this.totalTouchMoveY > MIN_TRACKING_FOR_DRAG) {
            this.hasMoved = true;
            this.preventClick = true;
            //  this.scrolling = true;
        }

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////

        //TODO DRY this part

        if (this.scrollPosY - this.touchDeltaY <= 0) {
            this.scrollPosY = 0;
        } else if (this.scrollPosY - this.touchDeltaY > this.maxScrollHeight) {
            this.scrollPosY = this.maxScrollHeight;
        } else {
            this.scrollPosY -= this.touchDeltaY;
        }

        if (this.scrollPosX - this.touchDeltaX <= 0) {
            this.scrollPosX = 0;
        } else if (this.scrollPosX - this.touchDeltaX > this.maxScrollWidth) {
            this.scrollPosX = this.maxScrollWidth;
        } else {
            this.scrollPosX -= this.touchDeltaX;
        }

        this.activateWatch();

        // if (support.isOldIE)
        //   this.$watch();

        //////////////////////////////////////////////////
        //////////////////////////////////////////////////

        this.touchTimestamp = this.newTouchTimestamp;
    };

    ScrollBehaviour.prototype.$watch = function (timestamp) {

        // if (!this.scrolling)
        //   return;

        //console.log('WATCH', this.scrollLeft,  this.scrollPosX);

        this.scrollLeft += (this.scrollPosX - this.scrollLeft) * this.options.friction;
        this.scrollTop += (this.scrollPosY - this.scrollTop) * this.options.friction;

        //  ~n+1 === n*-1
        this._animate(~this.scrollLeft + 1, ~this.scrollTop + 1);

        //Keep list from growing infinitely (holding min 10, max 20 measure points)
        if (this.touchEvents.length > 60) {
            //{left,top,time} * 20
            this.touchEvents.splice(0, 30); //{left,top,time} * 10
        }

        this.touchEvents.push(this.scrollLeft, this.scrollTop, Date.now());

        // if (this.scrolling){
        //   this.frame.start();
        // }

        // if ( Math.round(this.scrollLeft) === Math.round(this.scrollPosX) && Math.round(this.scrollTop) === Math.round(this.scrollPosY) /*&& !this.isDragging */ ) {
        //   this.onScrollEnd();
        // }

        //if value unchnaged, consider scroll has stopped
        //so prepar for scroll end after a small delay
        if (Math.round(this.scrollLeft) == this.lastScrollLeft && Math.round(this.scrollTop) == this.lastScrollTop) {
            this.lastScrollLeft = Math.round(this.scrollLeft);
            this.lastScrollTop = Math.round(this.scrollTop);
            return;
        }

        clearTimeout(this.scrollendTimer);

        this.scrollendTimer = $setTimeout(function () {
            this.onScrollEnd();
        }, 500, this);

        this.lastScrollLeft = Math.round(this.scrollLeft);
        this.lastScrollTop = Math.round(this.scrollTop);
    };

    ScrollBehaviour.prototype.onPointerUp = function (e) {

        document.removeEventListener(support.uimove, this._onPointerMove);
        document.removeEventListener(support.uiup, this._onPointerUp);

        // this.isDragging = false;

        if (!this.enabled /*|| !this.focused */) return;

        var self = this,
            sameEvent,
            lastTouchTimestamp,
            lastTouchDeltaY,
            duration,
            durationLeft,
            distanceLeft,
            durationTop,
            distanceTop,
            momentumLeft,
            momentumTop;

        this.newTouchTimestamp = e.timeStamp || Date.now();

        if (this.preventClick) e.preventDefault();

        //remove listeners
        //this.frame.removeListener(EventList.ENTER_FRAME, this._updateScreenBinded);

        // Then figure out what the scroll position was about 100ms ago
        var endPos = this.touchEvents.length - 1;
        var startPos;

        // Move pointer to position measured 100ms ago
        for (var i = endPos; i > 0 && this.touchEvents[i] > this.newTouchTimestamp - 100; i -= 3) {
            //{left,top,time}
            startPos = i;
        }

        // If start and stop position are identical in a 100ms timeframe,
        // we cannot compute any useful decceleration.
        if (startPos == endPos) {
            this.hasMoved = false;
        }

        // Compute relative movement between these two points
        duration = this.touchEvents[endPos] - this.touchEvents[startPos];
        distanceLeft = this.scrollLeft - this.touchEvents[startPos - 2];
        distanceTop = this.scrollTop - this.touchEvents[startPos - 1];

        if (!this.hasMoved) {
            //this.onScrollEnd();
            return;
        }

        /** compute momentum based on touch distance and duration  */
        momentumLeft = this._computeMomentum('horizontal', distanceLeft, duration);
        momentumTop = this._computeMomentum('vertical', distanceTop, duration);

        if (!this.options.momentum || momentumLeft.duration == 0 && momentumTop.duration == 0) {
            //this.onScrollEnd();
            return;
        }

        // this.scrolling = false;
        this._setMomentum(momentumLeft.length, momentumTop.length, Math.max(momentumLeft.duration, momentumTop.duration));
    };

    /** ---------------------------------------------------------------------------*/
    /** --------------------- NO TOUCH PLATFORM -----------------------------------*/
    /** ---------------------------------------------------------------------------*/

    ScrollBehaviour.prototype.wheel = function (e) {

        //console.log( "wheel", e, e.wheelDelta );

        e.preventDefault();

        this.stopDecceleration();

        var wheelDeltaX, wheelDeltaY;

        if (e.wheelDelta) {

            wheelDeltaX = e.wheelDelta; //6 or 12
            wheelDeltaY = e.wheelDelta;
        } else if (e.detail) {

            wheelDeltaX = wheelDeltaY = -e.detail * 40; // *3
        } else if (e.wheelDeltaX) {

            wheelDeltaY = e.wheelDeltaY / 12;
            wheelDeltaX = -1 * e.wheelDeltaX / 12;
        } else if (e.axis !== undefined && e.axis === e.HORIZONTAL_AXIS) {

            wheelDeltaY = 0;
            wheelDeltaX = -1 * wheelDeltaY;
        } else {
            wheelDeltaX = 0;
            wheelDeltaY = 0;
        }

        if (this.scrollPosY - wheelDeltaY <= 0) {
            this.scrollPosY = 0;
        } else if (this.scrollPosY - wheelDeltaY > this.maxScrollHeight) {
            this.scrollPosY = this.maxScrollHeight;
        } else {
            this.scrollPosY = this.scrollTop - wheelDeltaY;
        }

        if (this.scrollPosX - wheelDeltaX <= 0) {
            this.scrollPosX = 0;
        } else if (this.scrollPosX - wheelDeltaX > this.maxScrollWidth) {
            this.scrollPosX = this.maxScrollWidth;
        } else {
            this.scrollPosX = this.scrollLeft - wheelDeltaX;
        }

        this.activateWatch();

        // this.lastRealScrollLeft = this.lastRealScrollLeft === null ? this.scrollPosX : this.lastRealScrollLeft;
        // this.lastRealScrollTop  = this.lastRealScrollTop === null ? this.scrollPosY : this.lastRealScrollTop;

        // this.scrollPosX = this.realScrollLeft;
        // this.scrollPosY = this.realScrollTop;
    };

    // ScrollBehaviour.prototype._onScroll = function (e) {

    //   if (!this.enabled /*|| !this.focused  || this.isDragging */ )
    //     return;

    //   var self = this;

    //   if (!this.options.bypassNativeScroll) {

    //    // this.scrolling = true;

    //     var scrollLeft = this.options.useHtmlScroll ? this.$document.scrollLeft() : this.$scroller.scrollLeft();
    //     var scrollTop  = this.options.useHtmlScroll ? this.$document.scrollTop() : this.$scroller.scrollTop();

    //     this.scrollLeft = scrollLeft;// / this.ratioX;
    //     this.scrollTop  = scrollTop;// / this.ratioY;

    //     // if( this.options.useHtmlScroll && !this.options.bypassNativeScroll ){
    //     //   this.view.$el.scrollLeft( this.scrollLeft );
    //     //   this.view.$el.scrollTop( this.scrollTop );
    //     // }

    //     if( this.view.onScroll ){
    //       this.view.onScroll( this.scrollLeft, this.scrollTop, this.momentumProps, this.contentHeight );
    //     }

    //     clearTimeout(this.scrollendTimer);

    //     this.scrollendTimer = setTimeout(function () {

    //       if( self.view.onScrollEnd ){
    //         self.view.onScrollEnd( self.scrollLeft, self.scrollTop );
    //       }

    //     }, 300);

    //     return;
    //   }

    //   this.scrollPosX = this.$scroller.scrollLeft();// / this.ratioX;
    //   this.scrollPosY  = this.$scroller.scrollTop();// / this.ratioY;

    // };

    ScrollBehaviour.prototype.activateWatch = function () {

        if (!this.isWatching) {

            this.isWatching = true;
            this.frame.addListener(EventList.ENTER_FRAME, this._$watch, 'scrollstep');
            this.frame.start();
        }
    };

    // ScrollBehaviour.prototype.stopDecceleration = function(){

    //   if( this.isDecelerating ){
    //     this.momentumProps = false;
    //     this.frame.removeListener(EventList.ENTER_FRAME, this._$deccelerate);
    //   }

    // }

    ScrollBehaviour.prototype.stopWatch = function () {

        if (this.isWatching) {
            this.isWatching = false;
            this.frame.removeListener(EventList.ENTER_FRAME, this._$watch, 'scrollstep');
            this.scrollPosX = this.scrollLeft;
            this.scrollPosY = this.scrollTop;
        }

        // if ( this.options.moveContent && support.transform ) {

        //   curr = getCurrentStyle(this.$contentWrap[0], support.transformCss, 'gcs');
        //   initMatrix = curr != 'none' ? cssMatrixToArray(curr) : [1, 0, 0, 1, 0, 0];

        //   this.scrollLeft = ((initMatrix.length == 16) ? initMatrix[12] : initMatrix[4]) * -1;
        //   this.scrollTop  = ((initMatrix.length == 16) ? initMatrix[13] : initMatrix[5]) * -1;

        //   this.scrollTop  = this.scrollTop  << 0;
        //   this.scrollLeft = this.scrollLeft << 0;

        //   if (support.transition) {
        //     this._animate(this.scrollLeft, this.scrollTop, true); //true = force animate
        //     this.$contentWrap.off(support.transitionEnd, this._onScrollEnd);
        //     this.$contentWrap[0].style[support.transition] = support.transformCss + ' 0ms';
        //     for (i = 0; i < this.fixedLength; i++) {
        //       this.$fixed[i].style[support.transition] = support.transformCss + ' 0ms';
        //     }
        //   }

        // }

        // this.textPosX = -this.scrollLeft;
        // this.textPosY = -this.scrollTop;

        //this._animate(this.scrollLeft, this.scrollTop);
    };

    ScrollBehaviour.prototype.activateDecceleration = function () {

        if (!this.isDeccelerating) {
            ;
            this.isDeccelerating = true;
            this.frame.addListener(EventList.ENTER_FRAME, this._$deccelerate, 'scroll decceleration');
            this.frame.start();
        }
    };

    ScrollBehaviour.prototype.stopDecceleration = function () {

        if (this.isDeccelerating) {
            this.isDeccelerating = false;
            this.frame.removeListener(EventList.ENTER_FRAME, this._$deccelerate, 'scroll decceleration');
        }
    };

    // ScrollBehaviour.prototype._setScrollBarPos = function(){

    //   if( this.options.useHtmlScroll ){

    //     $(document).scrollLeft( this.scrollLeft )
    //                 .scrollTop( this.scrollTop );

    //   } else {

    //     this.$scroller.scrollLeft( this.scrollLeft )
    //                 .scrollTop( this.scrollTop );

    //   }

    // };

    ScrollBehaviour.prototype.onScrollEnd = function () {

        // if (!this.options.bypassNativeScroll) {

        //   if( this.view.onScrollEnd ){
        //     this.view.onScrollEnd( this.scrollLeft, this.scrollTop );
        //   }
        //   return;
        // }

        this.stopWatch();

        //this._setScrollBarPos();
        if (this.view.onScrollEnd) {
            this.view.onScrollEnd(this.scrollLeft, this.scrollTop);
        }
    };

    ScrollBehaviour.prototype._scrollBy = function (distX, distY, duration, easing) {

        if (!this.enabled /*|| !this.focused */) return;

        //this.progress = 0;
        this.hasMoved = false;

        // if (support.transition && this.options.usetransition ){
        //   //this.scrolling = true;
        //   this._setTransition( this.scrollLeft + distX, this.scrollTop + distY, duration );
        //   this._animate( this.scrollLeft + distX, this.scrollTop + distY );
        //   //this.scrolling = false;
        // }

        // this.frame.addListener(EventList.ENTER_FRAME, this._$deccelerate, 'scroll scrollby');
        // this.frame.start();

        this.activateWatch();
        this.activateDecceleration();

        // this.scrollPosX += distX;
        // this.scrollPosY += distY;
    };

    ScrollBehaviour.prototype._setTransition = function (destinationX, destinationY, duration) {

        this.momentumProps = this.momentumProps ? this.momentumProps : {};

        this.momentumProps.property = typeof duration != 'undefined' ? support.transformCss : '';
        this.momentumProps.duration = typeof duration != 'undefined' ? duration : 0;
        this.momentumProps.easing = typeof duration != 'undefined' ? this.options.cssEasing : '';
        this.momentumProps.left = typeof duration != 'undefined' ? destinationX : this.scrollLeft;
        this.momentumProps.top = typeof duration != 'undefined' ? destinationY : this.scrollTop;

        // if (this.momentumProps.duration !== 0) {

        //   this.$contentWrap[0].removeEventListener(support.transitionEnd, this._onScrollEnd, false);
        //   this.$contentWrap[0].addEventListener(support.transitionEnd, this._onScrollEnd, false);

        //   this.$contentWrap[0].style[support.transition] = support.transformCss + ' ' + this.momentumProps.duration + 'ms ' + this.momentumProps.easing;

        //   for (i = 0; i < this.fixedLength; i++)
        //     this.$fixed[i].style[support.transition] = support.transformCss + ' ' + this.momentumProps.duration + 'ms ' + this.momentumProps.easing;

        // } else {

        //   this.$contentWrap[0].style[support.transition] = support.transformCss + ' 0ms';

        //   for (i = 0; i < this.fixedLength; i++)
        //     this.$fixed[i].style[support.transition] = support.transformCss + ' 0ms';

        // }
    };

    ScrollBehaviour.prototype.scrollTo = function (newScrollLeft, newScrollTop, duration, easing) {

        if (!this.enabled /*|| !this.focused */) return;

        var self = this;
        var duration = duration || 500;
        var distanceLeft = newScrollLeft - this.scrollPosX;
        var distanceTop = newScrollTop - this.scrollPosY;

        this._setMomentum(distanceLeft, distanceTop, duration, easing);
    };

    ScrollBehaviour.prototype.jumpTo = function (newScrollLeft, newScrollTop) {

        if (!this.enabled /*|| !this.focused */) return;

        var self = this;

        this.stopDecceleration();
        this.activateWatch();
        this.scrollPosX = newScrollLeft;
        this.scrollPosY = newScrollTop;

        //add a 0 delay timeout to wait for browser auto scroll on window.load
        // if( !this.hasJumpedOnce ){
        //   this.hasJumpedOnce  = true;
        //   setTimeout(function(){
        //     self.onWindowLoad(newScrollLeft, newScrollTop);
        //   });
        // } else {
        //   this.onWindowLoad(newScrollLeft, newScrollTop);
        // }
    };

    // ScrollBehaviour.prototype.onWindowLoad = function(newScrollLeft, newScrollTop){

    //   this.lastRealScrollLeft = newScrollLeft;
    //   this.lastRealScrollTop = newScrollTop;

    //   this.textPosX = -newScrollLeft;
    //   this.textPosY = -newScrollTop;

    //   this.scrollLeft  = -newScrollLeft;
    //   this.scrollTop  = -newScrollTop;

    //   // if (!support.touch){
    //   //   this.$scroller.stop().scrollLeft( newScrollLeft * this.ratioX );
    //   //   this.$scroller.stop().scrollTop( newScrollTop * this.ratioY );
    //   // }

    //   // if (!this.options.bypassNativeScroll)
    //   //   return;

    //   this._animate(newScrollLeft, newScrollTop, true);
    //  // this.scrolling = false;

    // };

    //TODO: dispatch a SCROLL_TRANSITION event
    //from "_setTransition" method instead of animate
    ScrollBehaviour.prototype._animate = function (scrollLeft, scrollTop) {

        if (!this.enabled /*|| !this.focused || !this.scrolling*/) return;

        //publish scroll event
        //the _computeFakeMomentum method will publish a fakescroll event to sync with csstransition

        //get positive n to negative n using binary operator to imrove perfs
        //  ~n+1 === n*-1

        // if( this.options.moveContent ){
        //   this.position( this.$contentWrap[0], ~scrollLeft+1, ~scrollTop+1 );
        //   for (var i = 0; i < this.fixedLength; i++){
        //     this.position( this.$fixed[i], scrollLeft, scrollTop );
        //   }
        // }

        if (this.momentumProps) {
            scrollLeft = this.scrollLeft;
            scrollTop = this.scrollTop;
        }

        // scrollLeft += (!this.options.useHtmlScroll && !support.touch ? this.realScrollLeft : 0);
        // scrollTop  += (!this.options.useHtmlScroll && !support.touch ? this.realScrollTop : 0);

        if (this.view.onScroll) {

            this.view.onScroll(this.scrollLeft, this.scrollTop, this.momentumProps, this.contentHeight);
        }
    };

    //remove GPU generated texture when not scrolling element
    //to improve perf on mobile;
    // ScrollBehaviour.prototype._releaseTarget = function ( view ) {
    //   //alert("caller is " + arguments.callee.caller.toString());
    //   //console.log('RELEASE TARGET',view);
    //   if( /*|| !this.focused ||*/ (typeof view != "undefined" && view.el == this.view.el) )
    //     return;

    //   this.focused = false;
    //   this._saveScroll();

    // if (support.transform && this.options.bypassNativeScroll) {
    //   this.$contentWrap[0].style.top = -(this.scrollTop) + 'px';
    //   this.$contentWrap[0].style[support.transform] = 'none';
    //   this.$contentWrap[0].style[support.transition] = 'none';
    //   this.$contentWrap[0].style[support.perspective] = 'none';
    //   //keep the backface visibility hidden to avoid graphic bugs on Chrome 33
    //   this.$contentWrap[0].style[support.backfaceVisibility] = support.isChrome ? 'hidden' : 'visible';
    // }

    // if (support.transform && this.options.bypassNativeScroll) {

    //   for (i = 0; i < this.fixedLength; i++) {
    //     this.$fixed[i].style[support.transform] = 'none';
    //     this.$fixed[i].style[support.perspective] = 'none';
    //     this.$fixed[i].style[support.transition] = 'none';
    //     this.$fixed[i].style.top = this.scrollTop + 'px';
    //     //keep the backface visibility hidden to avoid graphic bugs on Chrome 33
    //     this.$fixed[i].style[support.backfaceVisibility] = support.isChrome ? 'hidden' : 'visible';
    //   }

    // }

    //this._removeFakeScrollers();

    //};

    // ScrollBehaviour.prototype._focusTarget = function (e){

    //   var self = this;

    // if( this.focused )
    //   return;

    // EventDispatcher.publish('scroll:focus', [ this.view ] );

    // this.focused = true;

    //this._createFakeScrollers();
    // if (this.options.bypassNativeScroll) {
    //   this.$fixed = this.$contentWrap.find('.fixed, .fixed-footer');
    //   this.fixedLength = this.$fixed.length;
    //   if (support.transform) {

    //     if( this.options.moveContent ){
    //       this.$contentWrap[0].style.top = '0px';
    //       this.$contentWrap[0].style[support.backfaceVisibility] = 'hidden';
    //       this.$contentWrap[0].style[support.perspective] = '1000px';
    //       for (i = 0; i < this.fixedLength; i++) {
    //         this.$fixed[i].style.top = '0px';
    //         this.$fixed[i][support.perspective] = '1000px';
    //         this.$fixed[i][support.backfaceVisibility] = 'hidden';
    //       }
    //     }

    //   }
    // }

    //this.update();

    //   if( this.options.useHtmlScroll ){
    //     self._restoreScroll();
    //   }

    // };

    // ScrollBehaviour.prototype._createFakeScrollers =  function(){

    //   if( this.options.useHtmlScroll && !support.touch ){
    //     if ($('html').find('> .fake-scroller').length === 0){
    //       $("html").append('<div class="fake-scroller"></div>');
    //     }
    //     this.$htmlFakeScroller = $("html").find('> .fake-scroller');
    //   }

    //   if ( this.view.$el.find('.fake-scroller').length === 0){
    //     //this.view.$el.append('<div class="fake-scroller"></div>');
    //   }

    //   this.$fakeScroller = this.view.$el.find('.fake-scroller');

    // };

    // ScrollBehaviour.prototype._removeFakeScrollers = function(){

    // };

    // ScrollBehaviour.prototype._saveScroll = function(){
    //   this.savedScrollLeft = this.scrollLeft;
    //   this.savedScrollTop = this.scrollTop;
    // };

    // ScrollBehaviour.prototype._restoreScroll = function(){

    //   //this.jumpTo( this.savedScrollLeft, this.savedScrollTop );

    // };

    ScrollBehaviour.prototype.update = function (wrapperWidth, wrapperHeight, contentWidth, contentHeight) {

        var self = this;

        // this.winHeight = this.$win.height();
        // this.winWidth  = this.$win.width();

        this.contentWidth = contentWidth;
        this.contentHeight = contentHeight;

        //set fake scroll size
        this.wrapperWidth = wrapperWidth; //this.view.$el.width() * 0.816875;
        this.wrapperHeight = wrapperHeight; //this.view.$el.height();

        // if( this.options.useHtmlScroll && !support.touch){

        //   this.ratioX = this.winWidth > this.wrapperWidth && this.wrapperWidth > 0 ? (this.winWidth / this.wrapperWidth) : 1;
        //   this.ratioY = this.winHeight > this.wrapperHeight && this.wrapperHeight > 0 ? (this.winHeight / this.wrapperHeight) : 1;

        //   // this.$htmlFakeScroller.width( this.contentWidth * this.ratioX );
        //   // this.$htmlFakeScroller.height( this.contentHeight * this.ratioY );

        // }

        // this.$fakeScroller.width( this.contentWidth );
        // this.$fakeScroller.height( this.contentHeight );

        //maxScroll is the diff between the content size and the wrapper size
        //it is only used by touch devices with bypassed native scroll
        //we don't need the ratio as it is only use by no touch devices with htmlScroll option enabled

        this.scrollWidth = this.contentWidth - this.wrapperWidth;
        this.scrollHeight = this.contentHeight - this.wrapperHeight;

        this.maxScrollWidth = this.contentWidth >= this.wrapperWidth ? this.scrollWidth : 0;
        this.maxScrollHeight = this.contentHeight >= this.wrapperHeight ? this.scrollHeight : 0;

        if (this.view.onScroll) {

            this.view.onScroll(this.scrollLeft, this.scrollTop, this.momentumProps, this.contentHeight);
        }

        if (!this.options.bypassNativeScroll) return;

        // this.$fixed = this.$contentWrap.find('.fixed, .fixed-footer');
        // this.fixedLength = this.$fixed.length;
    };

    /** ---------------------------------------------------------------------------*/
    /** -------------------------- PUBLIC API -------------------------------------*/
    /** ---------------------------------------------------------------------------*/

    // ScrollBehaviour.prototype.position = function (el, x, y) {

    //   if (support.transform) {

    //     if (y !== null && x !== null) {
    //       el.style[support.transform] = 'translate(' + x + 'px,' + y + 'px) ' + support.translateZ;
    //     } else if (x !== null) {
    //       el.style[support.transform] = 'translateX(' + x + 'px) ' + support.translateZ;
    //     } else if (y !== null) {
    //       el.style[support.transform] = 'translateY(' + y + 'px) ' + support.translateZ;
    //     }

    //   } else {

    //     if (x  || x === 0) {
    //       el.style.left = x + 'px';
    //     }

    //     if (y || y === 0) {
    //       el.style.top = y + 'px';
    //     }

    //   }

    // };

    // ScrollBehaviour.prototype.onScroll = function (scrollTop, transition) {

    // };

    // ScrollBehaviour.prototype.onScrollEnd = function (scrollTop) {

    // };

    // ScrollBehaviour.prototype.onScrollTo = function (target, jump) {

    // };

    module.exports = ScrollBehaviour;

    /***/ },
/* 21 */
/***/ function(module, exports) {

    "use strict";

    function Behaviour(options, view) {
        this.view = view;
    }

    module.exports = Behaviour;

    /***/ },