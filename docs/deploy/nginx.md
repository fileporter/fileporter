---
layout: default
title: NGINX
parent: Deploy
---

# Deploying with NGINX

links for more information:

* [uvicorn: running-behind-nginx](https://www.uvicorn.org/deployment/#running-behind-nginx){:target="_blank"}
* [fastapi: behind a proxy](https://fastapi.tiangolo.com/advanced/behind-a-proxy/#behind-a-proxy){:target="_blank"}

## NGINX example configuration

```nginx
http {
  server {
    listen 80;
    client_max_body_size 4G;

    server_name example.com;

    location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection $connection_upgrade;
      proxy_redirect off;
      proxy_buffering off;
      proxy_pass http://miniserve;
    }

    location /static {
      # path for static files
      root /path/to/app/static;
    }
  }

  map $http_upgrade $connection_upgrade {
    default upgrade;
    '' close;
  }

  upstream miniserve {
    server unix:/tmp/miniserve.sock;
  }
}
```

{.highlight}
> if this configuration is in `/etc/nginx/sites-available/` then you can ignore the `http {...}` block

### Sub-URL

{.note}
> important is the `/` at the end.<br/>
> This cuts the `/sub/*` path from the url so that the running miniserve will only receive the `/*` part at the end

```nginx
http {
  ...
  server {
      ...
      location /sub/ {
        ...
        proxy_pass http://miniserve/;
      }
      ...
  }
  ...
}
```
