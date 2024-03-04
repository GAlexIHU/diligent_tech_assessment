{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs_20
    pkgs.jq
    pkgs.redli
  ];

  shellHook =
  ''
    sudo corepack enable
  '';
}
