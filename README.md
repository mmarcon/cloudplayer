# Cloudplayer

Cloudplayer is a simple web application that allows users to create playlists with tracks from [Soundcloud](https://soundcloud.com).

Cloudplayer works on Chrome, Firefox, Safari, Opera (tested on 15) iOS and Android. From my test the optimal experience was on Samsung Galaxy S3 running Chrome, where the performance are so good that it feels almost like a native application.

## User Interface

### Search

In the search section users can search with any search term. The application contacts Soundcloud and returns tracks matching the search terms.

![Search](https://raw.github.com/mmarcon/cloudplayer/master/screenshots/search.png)

By touching/clicking the **+** button tracks are added to the playlist:

![Add to playlist](https://raw.github.com/mmarcon/cloudplayer/master/screenshots/addtoplaylist.png)

### Playlist

Once tracks are in the playlist they are ready to be played. Users can also reorganize the playlist by reordering and deleting tracks. At any time it is possible to go back to search and add more tracks.

![Playlist](https://raw.github.com/mmarcon/cloudplayer/master/screenshots/playlist.png)


## Tech stuff

Cloudplayer is built entirely in JavaScript. I chose not to use any MVC-kind-of frameworks beacuse it seemed an overkill for such a simple application.

jQuery was used for DOM manipulation, and in the attempt of keeping the code as clean as possible all the DOM-related code was kept in the same module. I decided to use **require.js** to modularize my code, and the related **r.js** to optimize the code and build the final distribution of Cloudplayer.

Cloudplayer relies completely on Soundcloud's JavaScript SDK for search and streaming of tracks.

All the shiny UI animations and transitions are done with CSS for better performance.

Unit testing is done with **Jasmine** with some tweaks to make it work properly with require.js modules.

## Assumptions

Cloudplayer has to work in modern browsers, and **when possible(*)** do continuos play of tracks.

**(*)** Continuos play is partially an issue on mobile Safari. Web Audio in mobile Safari is kind of tricky, Apple has decided that a user action is required to play sound. This means that code like

	SC.stream("/tracks/293", function(sound){
		sound.play();
	});
	
will not work **unless the application is started in standalone mode, i.e. from the Home Screen**. Therefore Cloudplayer detects when it is being run on mobile Safari in non-standalone mode and suggests the application is added to the home screen for a better experience.

![Add to home screen](https://raw.github.com/mmarcon/cloudplayer/master/screenshots/mobilesafari.png)

## Cloudplayer bookmarklet

To facilitate adding tracks to Cloudplayer users can use the [Cloudplayer Bookmarklet](https://cpl.eu01.aws.af.cm/bookmarklet/).

![Bookmarklet](https://raw.github.com/mmarcon/cloudplayer/master/screenshots/bookmarklet.png)

The bookmarklet communicates with Cloudplayer by saving data to local storage. To do that cross-domain an `iframe` is injected into the page with source set to a URL in Cloudplayer's domain, ready to receive data via `postMessage` and save it to local storage.

## Deployment

The application is deployed to Appfog. Deployments are done with:

	$ make deploy
	
this command generates the documentation for all the JS files, optimizes and minifies JavaScript with `r.js` and finally does the actual deployment.

## Show me!

### Live

 * [Cloudplayer](https://cpl.eu01.aws.af.cm)
 * [Bookmarklet](https://cpl.eu01.aws.af.cm/bookmarklet/)
 * [Documentation](https://cpl.eu01.aws.af.cm/docs.html)
 * [Tests](https://cpl.eu01.aws.af.cm/tests)

### On Youtube

 * [Cloudplayer on iOS](http://youtu.be/cI2Q1fZCf70)
 * [Cloudplayer bookmarklet](http://youtu.be/N46OgvOjEDE)
 
## Feedback on Soundcloud API
 
Easy to use, although documentation could be a bit easier to use, sometimes things are hard to find (e.g. I can never find *Search*, it takes me a while to go through all the sections and find it).

One minor issue is that even though framework is loaded from `HTTPS` (`https://connect.soundcloud.com/sdk`) and the current page is `HTTPS` resources are still loaded using `HTTP`, for example:

 * Search: `http://api.soundcloud.com/tracks?q=monkey&client_id=9cedb0d36189d0ab5a0c5f0e66e03a06&format=json&_status_code_map[302]=200`
 * Stream: `http://api.soundcloud.com/tracks/43676503/stream? client_id=9cedb0d36189d0ab5a0c5f0e66e03a06`
 * MP3: `http://ec-media.soundcloud.com/byHT6TmkDGkp.128.mp3?ff61182e3c2ecefa438cd02…IAZE5EOI7PA7VQ&Expires=1373261334&Signature=KGoZrk3rv6slN3RjLNa0LUru6jI%3D`
 
This makes browsers complain because non-secure resources are loaded from a secure page:

The page at `https://cpl.eu01.aws.af.cm/` displayed insecure content from `http://api.soundcloud.com/tracks?q=beer&client_id=9cedb0d36189d0ab5a0c5f0e66e03a06&format=json&_status_code_map[302]=200`.

