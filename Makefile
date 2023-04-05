usage:
	echo "usage: make <command>"

BASE ?= /
OUT ?= ../miniserve/web-ui/

new-frontend:
	cd src/web-ui/; npm install; npm run build -- --base $(BASE) --outDir $(OUT)

install:
	./scripts/make-install.sh

update:
	./scripts/make-update.sh

clean:
	git clean -f && git reset --hard
