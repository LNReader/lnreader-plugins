import { TscWatchClient } from 'tsc-watch/client';

const nodeVersion = Number(process.versions.node.split('.')[0]);

if (nodeVersion < 18) {
  console.error(
    `\nYou are using Node.js ${process.versions.node}. For lnreader-plugins, Node.js version >= v18.0.0 is required.`,
  );

  process.exit(1);
}

const watch = new TscWatchClient();

let port = Number(process.argv[2]);

if (!port) {
  console.log(
    `No port specified; defaulting to 3000. Change it with 'npm start -- <PORT>'.`,
  );

  port = 3000;
}

watch.start('--onSuccess', `node ./.js/index.js ${port}`);
