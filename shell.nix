{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.jq
  ];

  shellHook =
  ''
    sudo corepack enable
  '';
}
