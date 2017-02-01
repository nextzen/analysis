var through = require('through2');
var Token = require('../../lib/Token');
var split = require('../../analyzer/split');

module.exports.interface = function(test, util) {
  test('factory', function(t) {
    t.equal(typeof split, 'function', 'factory is a function');
    t.equal(split.length, 1, 'factory accepts options arg');
    t.end();
  });
  test('analyzer', function(t) {
    var analyzer = split( null );
    t.equal(typeof analyzer, 'object', 'returns an analyzer stream');
    t.equal(analyzer.constructor.name, 'DestroyableTransform', 'valid stream');
    t.end();
  });
};

module.exports.split = function(test, util) {
  test('test split', function(t) {

    var analyzer = split();
    analyzer.pipe( util.collect( function( tokens ){

      // total token count
      t.equal( tokens.length, 2, 'two tokens produced' );

      // first token
      t.equal( tokens[0].body, 'Hello', 'first token' );
      t.equal( tokens[0].position, 1, 'first token' );
      t.equal( tokens[0].count, 2, 'first token' );
      t.equal( tokens[0].isComplete, true, 'first token' );

      // second token
      t.equal( tokens[1].body, 'World!', 'second token' );
      t.equal( tokens[1].position, 2, 'second token' );
      t.equal( tokens[1].count, 2, 'second token' );
      t.equal( tokens[1].isComplete, false, 'second token' );

      t.end();
    }));

    analyzer.write( new Token( 'Hello World!' ) );
    analyzer.end();
  });

  test('markAllComplete', function(t) {

    var analyzer = split({ markAllComplete: true });
    analyzer.pipe( util.collect( function( tokens ){

      // marked as complete (would usually be false, now true)
      t.equal( tokens[1].isComplete, true, 'second token' );
      t.end();

    }));

    analyzer.write( new Token( 'Hello World!' ) );
    analyzer.end();
  });
};
