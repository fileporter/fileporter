# <img src="https://raw.githubusercontent.com/fileporter/fileporter/master/README.assets/repo-icon.png" alt="" style="display: inline-block; height: 30px;" /> fileporter
Serve a directory in your local network for view over the browser

[![pages-build-deployment](https://github.com/fileporter/docs/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/fileporter/docs/actions/workflows/pages/pages-build-deployment)
[![CodeQL](https://github.com/fileporter/fileporter/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/fileporter/fileporter/actions/workflows/github-code-scanning/codeql)

![repo size](https://img.shields.io/github/repo-size/fileporter/fileporter?logo=github)
![code size](https://img.shields.io/github/languages/code-size/fileporter/fileporter?logo=github)
![total lines](https://img.shields.io/tokei/lines/github/fileporter/fileporter?logo=github)

See [the documentation](https://fileporter.github.io/docs/) for more information.

After installation you also have access to the `fileporter --help` or `man fileporter` commands.

## More

> fileporter can be used to quickly share a directory for a good read-only browser view on mobile, desktop or other devices.
> though a [password]([https://](https://fileporter.github.io/docs/configuration/#password)) you are able to ensure that your files don't enter the wrong hands.

> fileporter also supports the deployment on a server

# Example usage

```shell
user@pc:~/path/to/folder$ fileporter
<args {'host': '0.0.0.0', 'port': 8000, 'root': '.', 'username': 'user', 'auth': None, 'worker': 8, 'root_path': '/', 'uds': None, 'logs': None, 'dotall': False, 'dependencies': False, 'cache': True}>

                                 
    █▀▀▀▀▀█ ▀▀▀  ▄▄▀  █▀▀▀▀▀█    
    █ ███ █ ▄▄▀▄▄▄  ▀ █ ███ █    
    █ ▀▀▀ █ █▀▄▄ █▄▀  █ ▀▀▀ █    
    ▀▀▀▀▀▀▀ █ ▀▄▀ ▀▄▀ ▀▀▀▀▀▀▀    
    ▀  ▄▀ ▀▀█▀██▀▄▀▄█▀▀▀██ ▄▀    
    ▄▄██▀█▀ ▀▄▀██  ▀▄▀▄██▀█▄     
    █ ▄▄▄▀▀▄▀█▄▀▀▄▀▄█▀▀▀▄▀▀█▀    
      ▀▄▄█▀▀▀   ▄  ▀ ▀ ▄▄██▄     
    ▀▀ ▀ ▀▀▀▄ ▀▀▄▀█▀█▀▀▀█▀█      
    █▀▀▀▀▀█ ▀ ▄█▀█▀ █ ▀ ██▄      
    █ ███ █ ▀   ▀█▄ ▀███▀▄███    
    █ ▀▀▀ █   █ ▄ ▄█ ▀██▄▄▄█     
    ▀▀▀▀▀▀▀ ▀  ▀ ▀▀▀  ▀   ▀▀▀    
                                      
    http://10.20.30.40:8000
```

![eg. fresh start](README.assets/eg-start.png)

![eg. settings](README.assets/eg-settings.png)

![eg. code file](README.assets/eg-code-file.png)

# ~~Development Notes~~

<!--
after the clone to complete the setup
```bash
ln -rs "$PWD/scripts/dev/pre-push" ".git/hooks/"
```
-->
