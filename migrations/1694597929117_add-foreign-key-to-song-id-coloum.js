/* eslint-disable camelcase */

exports.up = (pgm) => {
  // memberikan constraint foreign key pada song_id terhadap kolom id dari tabel songs
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id', 'FOREIGN KEY("song_id") REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlist_songs.song_id_songs.id pada tabel songs
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.song_id_songs.id');
};
