.PHONY: build
build:
	cd src && jekyll build && cp -f -R _site/* ../

.PHONY: serve
serve:
	cd src && jekyll serve -w -l -D

.PHONY: static
static:
	ruby -rwebrick -e'WEBrick::HTTPServer.new(Port: 8000, DocumentRoot: Dir.pwd).start'

.PHONY: clean
clean:
	rm -rf *.html feed.xml blog/ assets/ src/_site
