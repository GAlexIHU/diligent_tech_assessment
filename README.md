# Diligent Homework Assignment

## First Time Setup

> The development environment is abstracted away using [Nix](https://nixos.org/manual/nix/stable/command-ref/nix-shell), but it is completely optional to use. In case you want to use Nix for your local environment, first install Nix, (in case of VSCode also the recommended extensions), and then run `nix-shell` from the terminal.

Alternatively, the list of dependencies:

- Node 20
- Docker (not part of the Nix environment, needs to live on host)

The project uses `pnpm` as its package manager. PnPm is intalled using `corepack`.

> When using the Nix environment, `corepack enable` requires sudo privileges as `/nix/store` is group readonly.

1. Install dependencies with `pnpm i`
2. Set up environment files by copying `.env.example` to `.env`, `.env.local.example` to `.env.local`, `docker.env.example` to `docker.env` and filling in the necessary values
3. For external dependencies start up the docker containers with `docker compose --profile dev up -d`
4. Start the development server in two terminal sessions with `pnpm watch` & `pnpm dev`. A monorepo-wide watch script is configured via `trubowatch/turbotree` in `turbotree.ts` (check out [here](https://www.npmjs.com/package/turbotree))
5. Open the browser at `http://localhost:5173/` to access the frontend

## Build and Run

The two apps are dockerised, you can build and run them with the following commands:

```
pnpm i
docker compose --profile localstack up --build -d
```
