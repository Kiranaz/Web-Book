import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
 
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      //hijacking esbuild onResolve and onLoad methods that instead of looking into file system, do what we are saying and providing
      //i.e, attempt to load that imported file  
        
      //we can have multiple onResolve methods for different files, so filter: ..... helps to figure out for which files it should be executed
      
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
            return { path: args.path, namespace: 'a' };
          } else if (args.path === 'tiny-test-pkg') {
            return {
              path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
              namespace: 'a',
            };
          }  
      });
      //onLoad will only be executed if it has similar namespace as of onResolve
      build.onLoad({ filter: /.*/, namespace: 'a' }, async (args: any) => {
        console.log('onLoad', args);
 
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              const message = require('tiny-test-pkg');
              console.log(message);
            `,
          };
          } 
          const { data } = await axios.get(args.path);
          return {
            loader: 'jsx',
            contents: data,
          };
      });
    },
  };
};