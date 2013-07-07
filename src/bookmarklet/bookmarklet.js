//Crunch with http://ted.mielczarek.org/code/mozilla/bookmarklet.html
(function($, w, doc){
    var IFRAME_URL = 'https://cpl.eu01.aws.af.cm/bookmarklet/bookmarklet.html',
        iframe;

    function injectIframe(onload){
        iframe = doc.createElement('iframe');
        iframe.setAttribute('frameborder', 0);
        iframe.className = 'cloudplayer-iframe';
        iframe.setAttribute('style', 'position:absolute;top:0;left:0;width:0;height:0;display:none');
        iframe.onload = onload;
        iframe.src = IFRAME_URL;
        $('body').append(iframe);
    }

    function post(message) {
        iframe.contentWindow.postMessage(message, '*');
    }

    $(document).on('click', '.cloud-player', function(e){
        e.preventDefault();
        var $this = $(this);
        if($this.hasClass('cloud-player-added')) {
            return false;
        }
        var sibling = $this.siblings('.sc-button-share').click();
        $('.dialog').hide();
        var wpcode = $('.shareContent__wordpressCodeField').val();
        sibling.click();
        $this.css('opacity', 0.5).addClass('cloud-player-added');
        //I need to use a RegExp object due to a bug in the bookmarklet crunchinator
        var scURL = wpcode.match(new RegExp('.+url="([^"]+)".+'));
        scURL = scURL ? scURL[1] : null;
        if(scURL) {
            var trackId = scURL.substring(scURL.lastIndexOf('/') + 1);
            post(trackId);
        }
    });

    var appender = function(){
        var b = $('<button title="Share" class="sc-button sc-button-small cloud-player">Cloudplayer</button>');
        $('.sc-button-group').not('.cloud-player-enabled').append(b.clone()).addClass('cloud-player-enabled');
        setTimeout(appender, 1500);
    };

    injectIframe(function(){
        appender();
    });

})(jQuery, window, document);