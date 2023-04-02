---
title: Getting Started
layout: default
nav_order: 0
---

* TOC
{:toc}

# Getting Started

**requirements:** python (>3.8)

## Setup

```
python3 -m pip install -r requirements.txt
```

in case you want to add miniserve to the path (executing everywhere)
you have to add the following line to `.bash_aliases`
```
alias miniserve='~/.commands/miniserve/miniserve'
```

### Configuration

[see here for configuration](../configuration/index.md)

### Autocompletion

Copy `scripts/miniserve-completion.sh` into `~/.bash_completion.d/`
```
mkdir -p ~/.bash_completion.d/ && cp scripts/miniserve-completion.sh ~/.bash_completion.d/
```
and add
```
source ~/.bash_completion.d/miniserve-completion.sh
```
to `.bashrc` or `.bash_aliases`.

## Running

```

```
