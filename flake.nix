{
  description = "Papeleria ecommerce web - Angular SSR application";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
  };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      packages.${system} = {
        default = pkgs.buildNpmPackage {
          pname = "papeleria-ecomerce-web";
          version = "0.0.0";

          src = ./web;

          npmDepsHash = "sha256-Am3pkloF5rl6XBuQ2EVXwr6T7LW5BwQ4TKUu1c8UrNM=";

          nodejs = pkgs.nodejs_22;

          npmBuildScript = "build";
          npmBuildFlags = [ "--" "--configuration" "production" ];

          installPhase = ''
            runHook preInstall
            mkdir -p $out
            cp -r dist/web/* $out/
            runHook postInstall
          '';
        };
      };

      devShells.${system}.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_22
        ];
      };
    };
}
