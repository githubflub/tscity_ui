const babel_loader_options = {
   presets: [
      [
         '@babel/preset-env',
         {
            useBuiltIns: 'usage',
            corejs: '3.1.2',
            targets: {
               chrome: '41',
            }
         }
      ],
      '@babel/preset-react',
      '@babel/preset-typescript'
   ],

   plugins: [
      'lodash',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-syntax-dynamic-import'
   ]
}

export default babel_loader_options