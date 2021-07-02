module.exports = {
   extends: ['stylelint-config-recommended'],
   rules: {
      'at-rule-no-unknown': [
         true,
         {
            ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer', 'extends', /\.Mui/, /Mui.*/],
         },
      ],
      'property-no-unknown': [
         true,
         {
            ignoreProperties: ['label', /\.Mui.*/, /Mui.*/],
         },
      ],
      'selector-type-no-unknown': null,
      'declaration-block-trailing-semicolon': null,
   },
   ignoreFiles: ['**/*.ts', '**/*.test.*', '**/*.stories.*', '**/*.js'],
};
