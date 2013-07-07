//Crunch with http://ted.mielczarek.org/code/mozilla/bookmarklet.html
(function($, w, doc){
    var IFRAME_URL = 'https://cpl.eu01.aws.af.cm/bookmarklet/bookmarklet.html',
        iframe;

    //I am going to use local storage to get tracks to be enqueued from Soundcloud
    //therefore I will use an iframe to do local storage cross domain.
    //Chrome will complain in the console, but it's a bookmarklet, it'll be fine.
    function injectIframe(onload){
        iframe = doc.createElement('iframe');
        iframe.setAttribute('frameborder', 0);
        iframe.className = 'cloudplayer-iframe';
        iframe.setAttribute('style', 'position:absolute;top:0;left:0;width:0;height:0;display:none');
        iframe.onload = onload;
        iframe.src = IFRAME_URL;
        $('body').append(iframe);
    }

    //iframe content is listening for messages, so use
    //`postMessage` to communicate with it.
    function post(message) {
        iframe.contentWindow.postMessage(message, '*');
    }

    //I could not find any reference to track ids in Soundcloud's pages.
    //Once upon a time waveforms were included as images so id could be extracted from
    //there however it's no longer the case as waveforms are rendered on canvas.
    //The easiest way I found was therefore the following:
    //
    // 0. Wait for iframe to load
    // 1. Append button to each track, next to the share button in pages like [this one](https://soundcloud.com/user4953664)
    // 2. When button is clicked, clicked on the share sibling and hide the resulting dialog
    // 3. Grab Wordpress sharing code (could use the permalink instead, but using IDs seemed cleaner)
    // 4. Click share button again and toggle display property (`show`) so next time user clicks on share dialog is visible
    // 5. Do some RegExping and substringing to get track ID.
    // 6. Post message to iframe.
    // 7. Every 1.5 secs look at the page again and see if more *Cloudplayer* buttons need to be added. This is to cope with infinite scrolling.
    $(document).on('click', '.cloud-player', function(e){
        e.preventDefault();
        var $this = $(this);
        if($this.hasClass('cloud-player-added')) {
            return false;
        }
        var sibling = $this.siblings('.sc-button-share').click();
        $('.dialog').hide();
        var wpcode = $('.shareContent__wordpressCodeField').val();
        $('.dialog').show();
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