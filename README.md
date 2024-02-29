# Diligent Homework Assignment

## First Time Setup

> The development environment is abstracted away using [Nix](https://nixos.org/manual/nix/stable/command-ref/nix-shell), but it is completely optional to use. In case you want to use Nix for your local environment, first install Nix, (in case of VSCode also the recommended extensions), and then run `nix-shell` from the terminal.

Alternatively, the list of dependencies:

- Node 20
- Docker (not part of the Nix environment, needs to live on host)

The project uses `yarn V2` (4.1) as its package manager. Yarn is intalled using `corepack`.

> When using the Nix environment, `corepack enable` requires sudo privileges as `/nix/store` is group readonly.
