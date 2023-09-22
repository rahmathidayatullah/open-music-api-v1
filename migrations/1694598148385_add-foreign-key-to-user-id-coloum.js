/* eslint-disable camelcase */

exports.up = (pgm) => {
  // memberikan constraint foreign key pada user_id terhadap kolom id dari tabel users
  pgm.addConstraint('collaborations', 'fk_collaborations.user_id_users.id', 'FOREIGN KEY("user_id") REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_collaborations.user_id_users.id pada tabel users
  pgm.dropConstraint('collaborations', 'fk_collaborations.user_id_users.id');
};
