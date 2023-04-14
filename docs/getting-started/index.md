---
title: Getting Started
layout: default
nav_order: 0
---

* TOC
{:toc}

# Getting Started

**requirements:** python (>3.8), cat, bash, git

# Setup

## Installation

```bash
cat https://github.com/PlayerG9/miniserve/raw/main/scripts/installer | bash
```

it is also possible to pass some arguments
```bash
cat https://github.com/PlayerG9/miniserve/raw/main/scripts/installer | bash -s -- {directory-name}
```

## Adding miniserve to the path

in case you want to add miniserve to the path (executing everywhere)
you have to add the following line to `.bash_aliases`

```bash
alias miniserve='~/.commands/miniserve/miniserve'
```

## Configuration

[see here for configuration](../configuration/index.md)

## Autocompletion

Copy `scripts/miniserve-completion.sh` into `~/.bash_completion.d/`
```bash
mkdir -p ~/.bash_completion.d/ && cp scripts/miniserve-completion.sh ~/.bash_completion.d/
```
and add
```bash
source ~/.bash_completion.d/miniserve-completion.sh
```
to `.bashrc` or `.bash_aliases`.

# Running

```bash
miniserve [ARGS]
```
or (if not added to the path)
```bash
/path/to/miniserve/miniserve [ARGS] 
```
