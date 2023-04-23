miniserve(1) -- small readonly fileserver
=============================================

## SYNOPSIS

`miniserve [-h] [-v] [--config CONFIG] [--local] [-p PORT] [--pw PASSWORD] [--dotall | --no-dotall] [root]`

## DESCRIPTION

Serve a directory in your local network for view over the browser

## OPTIONS

* root:
the directory which should be served
(default: current directory)

* -h, --help:
show the help message and exit

* -v, --version:
show program's version number and exit

* --config:
configuration file to use

* -p, --port:
port to serve on
(default: 8000)

* --pw, --password:
requires the user to login

* --dotall, --no-dotall:
serve also dot-files
(default: false)

## HIDDEN OPTIONS

(some options are hidden in the `--help` message but are still useable)

* --user, --username:
specify the username to use

* --local, --global:
only host the directory locally
(default: global)

* -w, --worker:
number of workers
(default: a calculated number based on your pc)

* --root-path:
is used with a custom base-url
(see https://playerg9.github.io/miniserve/configuration#root-path-and-uds)

* --uds:
UNIX-Domain-Socket
(see https://playerg9.github.io/miniserve/configuration#root-path-and-uds)

* --logs, --no-logs:
give access output into the console
(default: false)

* --dependencies, --no-dependencies:
print at startup what dependencies are missing for a better browser experience
(default: false)

* --cache, --no-cache:
whether or not previews and low-resolution versions of files should be cached in a `/tmp` directory. (can be disabled for private data)
(default: true)

* --web-ui:
custom web-ui build.
see the `--root-path` option

## EXAMPLES

    $ miniserve

    $ miniserve --dotall ~

    $ miniserve --user hello --password world ./prvt

<!--
## SYNTAX

## ENVIRONMENT

## RETURN VALUES

## STANDARDS

## SECURITY CONSIDERATIONS

## BUGS

## HISTORY
-->

## AUTHOR

PlayerG9 - https://github.com/PlayerG9/

## COPYRIGHT

Copyright © 2023 PlayerG9.

## SEE ALSO

### Repository

https://github.com/PlayerG9/miniserve

### Documentation

https://playerg9.github.io/miniserve/
