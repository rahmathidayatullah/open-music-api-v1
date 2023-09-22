/* eslint-disable camelcase */
const mapAlbumsDBToModel = ({ id, name, year, created_at, updated_at }) => ({
  id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});
const mapSongsDBToModel = ({ id, title, performer }) => ({
  id,
  title,
  performer,
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

const mapPLaylists = ({ id, name, owner }) => ({
  id,
  name,
  username: owner,
});

module.exports = {
  mapUsers,
  mapAlbumsDBToModel,
  mapSongsDBToModel,
  mapSongDetailDBToModel,
  mapPLaylists,
};
