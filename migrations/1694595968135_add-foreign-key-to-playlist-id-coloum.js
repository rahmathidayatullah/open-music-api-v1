/* eslint-disable camelcase */

exports.up = (pgm) => {
  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlists.id', 'FOREIGN KEY("playlist_id") REFERENCES playlists(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlists.id', 'FOREIGN KEY("playlist_id") REFERENCES playlists(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist_id_playlists.id', 'FOREIGN KEY("playlist_id") REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  // menghapus constraint fk_playlist_songs.playlist_id_playlists.id pada tabel playlist_songs
  pgm.dropConstraint('playlist_songs', 'fk_playlist_songs.playlist_id_playlist.id');

  // menghapus constraint fk_playlist_song_activities.playlist_id_playlists.id pada tabel playlist_song_activities
  pgm.dropConstraint('playlist_song_activities', 'fk_playlist_song_activities.playlist_id_playlist.id');

  // menghapus constraint fk_collaborations.playlist_id_playlists.id pada tabel collaborations
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist_id_playlist.id');
};
