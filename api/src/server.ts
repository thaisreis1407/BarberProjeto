import './config/global';
import app from './app';

function getArgByName(paramName: string): string {
  const args = process.argv.slice(2);
  const idx = args.indexOf(paramName);

  if (idx >= 0 && args[idx + 1]) {
    return args[idx + 1];
  }
  return '';
}

const port = getArgByName('-p') || process.env.APP_PORT;

app.listen(port);
