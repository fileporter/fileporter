---
title: Deploy
layout: default
has_children: true
---

* TOC
{:toc}

# How to Deploy on a server

## Custom starting URL

If miniserve should run on a server under longer url.

<small>can be helpful if you have multiple services or instances running on one machine</small>

default: `http://localhost/`
eg custom: `http://localhost/miniserve/`

### How to

additional requirements: npm

```bash
make new-frontend BASE=/miniserve/
```
or
```bash
make new-frontend BASE=/miniserve/ OUT=~/miniserve-custom-ui/
```

{ .highlight }
> in case you want to run multiple instances at the same time (or don't want to change the default-web-ui folder) it is possible to specify a [custom web-ui directory](../configuration/index.md#web-ui)

{ .important }
> if your change the base-url your also need to specify that during the start if miniserve with the [`--root-path`](../configuration/index.md#root-path-and-uds) argument

## Behind a reverse Proxy

<!-- automatic TOC is here -->
