usage:
	echo "usage: make <command>"

BASE ?= /

new-frontend:
	cd src/web-ui/; npm install; npm run build -- --base $(BASE)
