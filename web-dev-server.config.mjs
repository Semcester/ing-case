import { fromRollup } from '@web/dev-server-rollup';
import nodeResolve from '@rollup/plugin-node-resolve';

const nodeResolvePlugin = fromRollup(nodeResolve);

export default {
  plugins: [nodeResolvePlugin()],
  nodeResolve: true,
 middleware: [
  function spaFallback(ctx, next) {
    if (ctx.method === 'GET' && !ctx.url.includes('.') && !ctx.url.startsWith('/__')) {
      ctx.url = '/index.html';
    }
    return next();
  },
],
};
