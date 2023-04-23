---
title: How to Update
layout: default
---

* TOC
{:toc}

# How to install a never version

## Normal upgrade

under normal circumstances it should be enough to call
```bash
make update
```

## With custom starting url

if you have a custom base-url the following commands are needed
```bash
make clean
make update
make new-frontend BASE="[YOUR-URL]"
```
