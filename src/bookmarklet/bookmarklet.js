(function($, w, doc){
    var IFRAME_URL = 'http://localhost:8000/bookmarklet/bookmarklet.js',
        iframe;
    function attachListener(){

    }

    function injectIframe(){
        iframe = doc.createElement('iframe');
        iframe.setAttribute('frameborder', 0);
        iframe.className = 'cloudplayer-iframe';
        iframe.setAttribute('style', 'position:absolute;top:0;left:0;width:0;height:0;display:none');
        iframe.onload = attachListener;
        iframe.src = IFRAME_URL;
        $('body').append(iframe);
    }
})(jQuery, window, document);