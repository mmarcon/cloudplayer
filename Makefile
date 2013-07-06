doc:
	@./node_modules/.bin/docco -o src/docs src/js/*.js src/js/modules/*.js;

dist:
	@cd src/js; ../../node_modules/.bin/r.js -o app.build.js