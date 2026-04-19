import { spawn } from 'node:child_process';

const action = process.argv[2] || 'help';

const commands = {
  up: ['compose', 'up', '--build'],
  down: ['compose', 'down'],
  reset: ['compose', 'down', '-v'],
  logs: ['compose', 'logs', '-f'],
  ps: ['compose', 'ps'],
  rebuild: ['compose', 'up', '--build', '--force-recreate'],
  config: ['compose', 'config'],
};

if (action === 'help' || !(action in commands)) {
  printHelp();
  process.exit(action === 'help' ? 0 : 1);
}

runDocker(commands[action]);

function runDocker(args) {
  const child = spawn('docker', args, {
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

function printHelp() {
  console.log('Docker helper commands:');
  console.log('  node scripts/docker.mjs up       # docker compose up --build');
  console.log('  node scripts/docker.mjs down     # docker compose down');
  console.log('  node scripts/docker.mjs reset    # docker compose down -v');
  console.log('  node scripts/docker.mjs logs     # docker compose logs -f');
  console.log('  node scripts/docker.mjs ps       # docker compose ps');
  console.log('  node scripts/docker.mjs rebuild  # docker compose up --build --force-recreate');
  console.log('  node scripts/docker.mjs config   # docker compose config');
}
