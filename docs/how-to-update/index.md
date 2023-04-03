---
title: How to Update
layout: default
---

* TOC
{:toc}

# How to install a never version

## Normal upgrade

```bash
./scripts/make-update.sh
```

## With custom starting url

```bash
git clean -f && git reset --hard
./scripts/make-update.sh
make new-frontend BASE="[YOUR-URL]"
```
