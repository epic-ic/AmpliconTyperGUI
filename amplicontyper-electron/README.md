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

You can also do a separate Typescript build with `npm run build` but this is not necessary for a dev run

### Troubleshooting

#### Electron uninstall error
If you see the following error on `npm run dev`:
```
error during start dev server and electron app:
Error: Electron uninstall
    at getElectronPath 
...    
```
then run `npm run install-electron` to rebuild and re-install the electron package. 

#### SUID sandbox error

Another error that may occur on set-up on Ubuntu 24.04 looks like this:

```
[<some numbers here>:FATAL:sandbox/linux/suid/client/setuid_sandbox_host.cc:166] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that /home/dmears/projects/polio-nanopore/piranhaNET/piranha-apps/node_modules/electron/dist/chrome-sandbox is owned by root and has mode 4755.
```

This can be addressed by following [this comment](https://github.com/electron/electron/issues/42510#issuecomment-2171583086)'s advice to first lift a restriction introduced by Ubuntu 24.04, and you should probably reset that setting once you have successfully started the app:

```sh
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0
```

Afterwards:

```sh
sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=1
```

## Tests

TODO