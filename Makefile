.PHONY: dist

doc:
	@./node_modules/.bin/docco -o src/docs src/js/*.js src/js/modules/*.js src/js/modules/ui/*.js src/bookmarklet/bookmarklet.js;

dist: doc
	@rm -rf dist; cd src/js; ../../node_modules/.bin/r.js -o app.build.js

#deploy application to Appfog (https://cpl.eu01.aws.af.cm)
deploy: dist
	@af update cpl