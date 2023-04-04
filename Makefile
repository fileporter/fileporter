usage:
	echo "usage: make <command>"

BASE ?= /

new-frontend:
	cd src/web-ui/; npm install; npm run build -- --base $(BASE)

install:
	./scripts/make-install.sh

update:
	./scripts/make-update.sh

clean:
	git clean -f && git reset --hard
