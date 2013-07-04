doc:
	@./node_modules/.bin/docco -o docs js/*.js js/modules/*.js;

build:
	@./node_modules/.bin/r.js -o build.js