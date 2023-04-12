---
title: Configuration
layout: default
---

* TOC
{:toc}

# Options to configure

## host
where to bind to

* `0.0.0.0` means globally (can be access over the local internet)
* `127.0.0.1` means locally (only the host-machine can access the site)

default: `0.0.0.0`

## port
which port to bind to

recommended ports:

* 80 (often times blocked)
* 3000
* 5000
* 8000
* 8080 (sometimes blocked by other software)

<sup>note: 80 is the default port to allow url's without port (eg `http://10.20.30.40/` instead of `http://10.20.30.40:8000/`) but is often blocked</sup>

default: `8000`

## root
the directory which should be served

default: `.` (current working directory)

## username
which username the authentication process requires

<sup>note: only works if password is supplied</sup>

default: default to currently logged in user

## password
which password the authentication process requires

it is possible to provide the `sha256`-hexdigest hashed version of the password.
This password-version has to begin with `hash:` and can be generated with `make password-encryption PW="[YOUR PASSWORD]"`.
This is meant for you to not store/use your plain password and is recommended to use.

<sup>note: if password is `yes`|`true` it falls back to the system-password of the current user</sup>

default: no authentication

## cache
miniserve cached previews or low-resolution versions of files in a cache directory.
(This gets cleared every system-start)

If your don't want the cache because of security or other reasons you can disable this option.<br/>
<sup>note: this requires more system-resources</sup>

default: `true`

## root-path and uds
this options are helpful if miniserve should run behind a reverse-proxy like nginx

links for more information:

* [uvicorn: running-behind-nginx](https://www.uvicorn.org/deployment/#running-behind-nginx){:target="_blank"}
* [fastapi: behind a proxy](https://fastapi.tiangolo.com/advanced/behind-a-proxy/#behind-a-proxy){:target="_blank"}

default: not used

## logs
whether or not to log startup and access information

default: `no`

## dotall
files that start with `.` are not shown in the UI. This is UNIX behavior that this files are marked as "hidden". If your want to see them you have to enable them here.

default: `no`

## dependencies
whether or not to show missing dependencies for previews during the startup process

default: `no`

## web-ui
custom directory to use for the frontend (related to `root-path`-option and [custom starting url](../deploy/index.md))

default: `{APP}/web-ui/`

# Configuration via CLI

see `miniserve --help` for more information

# Configuration via `config.ini`

{. note }
> you can specify a path a `config.ini` file with the `--config` CLI options

* `~/.config/miniserve/config.ini`
* `/etc/miniserve/config.ini`

## Example Configuration File

```ini
[SERVER]
;host: 0.0.0.0
;port: 8000
;root: .
;username: 
;password: 

[CUSTOMIZATION]
;cache: no
;web-ui: ${HOME}/miniserve-custom/

[PROXY]
;root-path: /custom/
;uds: /tmp/miniserve.sock

[DEBUG]
;logs: yes
;dotall: yes
;dependencies: yes
```

### .ini specification

```ini
; Comment like this
# or like this

# separate key and value like this
key: value
key = value  # the space is irrelevant (but try to keep a standard)
key=value  # btw. this is an inline comment

key:
    multiline values
    are allowed

# you can also use interpolation
path: src
file: ${path}/file.txt
```
