---
title: How to Update
layout: default
---

* TOC
{:toc}

# How to install a never version

## Normal upgrade

```bash
make update
```

## With custom starting url

```bash
make clean
make update
make new-frontend BASE="[YOUR-URL]"
```
