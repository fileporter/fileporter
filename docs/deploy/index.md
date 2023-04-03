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

<sup>can be helpful if you have multiple services or instances running on one machine</sup>

default: `http://localhost/`
custom: `http://localhost/miniserve/`

### How to

additional requirements: [npm](https://www.npmjs.com/){:target="_blank"}

```commandline
make new-frontend BASE="/miniserve/"
```

## Behind a reverse Proxy
