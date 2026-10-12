# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Updating product prices and sales

Edit the per-product `price_`, `oldPrice_`, and `discount_` constants in `src/data/productControl.js`.
Each product in `src/data/products.js` uses its matching constants, so changing them updates the
price and sale shown across the store. Use `null` for `oldPrice_` and `0` for `discount_` when a
product has no sale.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
