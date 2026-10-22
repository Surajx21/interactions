// Ambient module declarations for CSS and style assets
// Resolves TypeScript TS2882: "Cannot find module or type declarations for side-effect import"

declare module "*.css" {}
declare module "*.scss" {}
declare module "*.sass" {}
declare module "*.less" {}

declare module "*.module.css" {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module "*.module.scss" {
  const classes: { readonly [key: string]: string };
  export default classes;
}
