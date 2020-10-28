function ScrollBounds(w, d) {
    var w = w || window,
        d = d || document;
    var body = d.body,
        html = d.documentElement,
        debug = false,
        atTop = false,
        atBottom = false,
        reachBottomEvent = null,
        leaveBottomEvent = null,
        reachTopEvent = null,
        leaveTopEvent = null;

    var setDebug = function(value) {
        debug = !! value;
    };
    var startListen = function() {
        reachBottomEvent = new Event('scroll-reach-bottom');
        leaveBottomEvent = new Event('scroll-leave-bottom');
        reachTopEvent = new Event('scroll-reach-top');
        leaveTopEvent = new Event('scroll-leave-top');
        onScrolling();
        w.addEventListener('scroll', listenScroll);
    };
    var stopListen = function() {
        w.removeEventListener('scroll', listenScroll);
        reachBottomEvent = null;
        leaveBottomEvent = null;
        reachTopEvent = null;
        leaveTopEvent = null;
        atTop = false;
        atBottom = false;
    };
    var listenScroll = function() {
        w.requestAnimationFrame(onScrolling);
    };
    var getValues = function() {
        return {atTop: atTop, atBottom: atBottom};
    }

    var onScrolling = function() {
        // margin pixels (it seems it's needed on mobile)
        var isBottom = body.offsetHeight - (w.innerHeight + w.scrollY) < 3;
        var isTop = (w.pageYOffset || body.scrollTop) < 2;
        var hasChanged = false;

        if (isBottom && ! atBottom) {
            debug && console.log('reach bottom');
            atBottom = true;
            hasChanged = true;
            html.dispatchEvent(reachBottomEvent);
        } else if (! isBottom && atBottom) {
            debug && console.log('leave bottom');
            atBottom = false;
            hasChanged = true;
            html.dispatchEvent(leaveBottomEvent);
        }

        if (isTop && ! atTop) {
            debug && console.log('reach top');
            atTop = true;
            hasChanged = true;
            html.dispatchEvent(reachTopEvent);
        } else if (! isTop && atTop) {
            debug && console.log('leave top');
            atTop = false;
            hasChanged = true;
            html.dispatchEvent(leaveTopEvent);
        }

        if (debug && hasChanged) {
            console.log(getValues());
        }
    };

    // auto start
    startListen();

    return {
        get: getValues,
        startListen: startListen,
        stopListen: stopListen,
    };
}
