/* eslint-disable camelcase */
const mapAlbumsDBToModel = ({ id, name, year, created_at, updated_at, coverUrl }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
  coverUrl,
});
const mapSongsDBToModel = ({ id, title, performer, coverUrl }) => ({
  id,
  title,
  performer,
  coverUrl,
});

const mapSongDetailDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  created_at,
  updated_at,
  albumId,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  createdAt: created_at,
  updatedAt: updated_at,
  albumId,
});

const mapUsers = ({ id, username }) => ({
  id,
  username,
});

const mapPLaylists = ({ id, name, username }) => ({
  id,
  name,
  username,
});

module.exports = {
  mapUsers,
  mapAlbumsDBToModel,
  mapSongsDBToModel,
  mapSongDetailDBToModel,
  mapPLaylists,
};
