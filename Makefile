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

password-encryption:
	test -n "$(PASSWORD)" || (echo "Please provider an password with the PASSWORD=\"[PW]\" option" && exit 1);
	python3 -c "import hashlib; pw = hashlib.sha256(\"$(PASSWORD)\".encode()).hexdigest(); print(f'hash:{pw}')";
