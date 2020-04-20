'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utilities = require('../utilities');

var schema = [{
  enum: ['always', 'never'],
  type: 'string'
}];

var create = function create(context) {
  var always = (context.options[0] || 'always') === 'always';

  if (always) {
    return {
      ObjectTypeIndexer(node) {
        var id = (0, _utilities.getParameterName)(node, context);
        var rawKeyType = context.getSourceCode().getText(node.key);
        if (id === null) {
          context.report({
            fix(fixer) {
              return fixer.replaceText(node.key, 'key: ' + rawKeyType);
            },
            message: 'All indexers must be declared with key name.',
            node
          });
        }
      }
    };
  } else {
    return {};
  }
};

exports.default = {
  create,
  schema
};
module.exports = exports.default;