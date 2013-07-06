doc:
	@./node_modules/.bin/docco -o docs js/*.js js/modules/*.js;

build:
	@./node_modules/.bin/r.js -o build.js

dist:
	@cd js; ../node_modules/.bin/r.js -o app.build.js