usage:
	echo "usage: make <command>"

BASE ?= /
OUT ?= src/miniserve/web-ui/

new-frontend:
	./scripts/make-new-frontend $(BASE) $(OUT)

install:
	./scripts/make-install

update:
	./scripts/make-update

clean:
	git clean -f && git reset --hard

password-encryption:
	./scripts/make-password-encryption "$(PW)"
