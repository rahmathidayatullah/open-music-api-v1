/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('playlist_song_activities', {
    id: {
      type: 'TEXT',
      primaryKey: true,
    },
    playlist_id: {
      type: 'TEXT',
    },
    song_id: {
      type: 'TEXT',
    },
    user_id: {
      type: 'TEXT',
    },
    action: {
      type: 'TEXT',
    },
    time: {
      type: 'TIMESTAMPTZ',
      default: 'NOW()',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('playlist_song_activities');
};
