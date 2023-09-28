/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns('albums', {
    coverUrl: { type: 'text' },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('albums', 'coverUrl');
};
