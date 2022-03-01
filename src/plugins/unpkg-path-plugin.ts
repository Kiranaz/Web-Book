import * as esbuild from 'esbuild-wasm';
 
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //hijacking esbuild onResolve and onLoad methods that instead of looking into file system, do what we are saying and providing
      //i.e, attempt to load that imported file  
        
      //we can have multiple onResolve methods for different files, so filter: ..... helps to figure out for which files it should be executed
      
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        return { path: args.path, namespace: 'a' };
      });
      //onLoad will only be executed if it has similar namespace as of onResolve
      build.onLoad({ filter: /.*/, namespace: 'a' }, async (args: any) => {
        console.log('onLoad', args);
 
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from './message';
              console.log(message);
            `,
          };
        } else {
          return {
            loader: 'jsx',
            contents: 'export default "hi there!"',
          };
        }
      });
    },
  };
};