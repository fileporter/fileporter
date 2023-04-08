usage:
	echo "usage: make <command>"

BASE ?= /
OUT ?= ../miniserve/web-ui/

new-frontend:
	cd src/web-ui/; npm install; npm run build -- --base $(BASE) --outDir $(OUT)

install:
	./scripts/make-install

update:
	./scripts/make-update

clean:
	git clean -f && git reset --hard

password-encryption:
	./scripts/make-password-encryption "$(PW)"
