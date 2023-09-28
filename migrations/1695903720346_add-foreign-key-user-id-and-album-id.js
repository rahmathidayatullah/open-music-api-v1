/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.album_id.album.id', 'FOREIGN KEY("album_id") REFERENCES albums(id) ON DELETE CASCADE');

  pgm.addConstraint('user_album_likes', 'fk_user_album_likes.user_id.users.id', 'FOREIGN KEY("user_id") REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.album_id.album.id');
  pgm.dropConstraint('user_album_likes', 'fk_user_album_likes.user_id.users.id');
};
