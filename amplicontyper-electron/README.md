# AmpliconTyperGUI: amplicontyper-electron

[Electron](https://www.electronjs.org/) app for running [AmpliconTyper](https://github.com/AntonS-bio/AmpliconTyper) with a front end implemented with [Svelte](https://svelte.dev/).

This approach is largely based on [PiranhaNET](https://github.com/polio-nanopore/piranhaNET/) with the exceptions that
here we are running a PyInstaller-built local executable rather than a docker container, and that we do not need to 
support a separate web application, so the Svelte app source is local to the renderer folder of the Electron app. 

## Prerequisites
- Node 26

## Local build and run

Before running the AmpliconTyperGUI you should do a local build of the AmpliconTyper installer. See that 
[README](../amplicontyper-installer/README.md) for details. 

Install deps: `npm ci`
Run Electron app in dev mode: `npm run dev`

You can also do a separate Typescript build with `npm run build` but this is not necessary for a dev run. 

## Tests

TODO