var MOCKS = {};
MOCKS.singleSearchResult = {"kind":"track","id":14535304,"created_at":"2011/05/02 03:30:40 +0000","user_id":2569074,"duration":290852,"commentable":true,"state":"finished","original_content_size":102547500,"sharing":"public","tag_list":"buskers B-Siderz il circo degli orrori crazy-be ciangh maga j-mix boomslang","permalink":"buskers-feat-b-siderz-il-circo","streamable":true,"embeddable_by":"all","downloadable":true,"purchase_url":null,"label_id":null,"purchase_title":null,"genre":"Rap Hip-Hop","title":"Buskers feat. B-Siderz - Il Circo Degli Orrori","description":"","label_name":"","release":"","track_type":"podcast","key_signature":"","isrc":"","video_url":null,"bpm":null,"release_year":null,"release_month":null,"release_day":null,"original_format":"wav","license":"all-rights-reserved","uri":"http://api.soundcloud.com/tracks/14535304","user":{"id":2569074,"kind":"user","permalink":"buskerscrew","username":"Buskers","uri":"http://api.soundcloud.com/users/2569074","permalink_url":"http://soundcloud.com/buskerscrew","avatar_url":"http://i1.sndcdn.com/avatars-000003395956-x6pudb-large.jpg?cc07a88"},"permalink_url":"http://soundcloud.com/buskerscrew/buskers-feat-b-siderz-il-circo","artwork_url":"http://i1.sndcdn.com/artworks-000006878222-yk84h1-large.jpg?cc07a88","waveform_url":"http://w1.sndcdn.com/hw04yLsWS7DC_m.png","stream_url":"http://api.soundcloud.com/tracks/14535304/stream","download_url":"http://api.soundcloud.com/tracks/14535304/download","playback_count":453,"download_count":18,"favoritings_count":2,"comment_count":0,"attachments_uri":"http://api.soundcloud.com/tracks/14535304/attachments"};
MOCKS.sound = {
    play: jasmine.createSpy('Sound play'),
    pause: jasmine.createSpy('Sound pause'),
    resume: jasmine.createSpy('Sound resume'),
    stop: jasmine.createSpy('Sound stop')
};
MOCKS.localStorage = {
    getItem: jasmine.createSpy('localStorage getItem'),
    removeItem: jasmine.createSpy('localStorage removeItem')
};