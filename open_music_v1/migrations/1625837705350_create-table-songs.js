/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * 
 * @param {*} pgm 
 * {
    "title": string,
    "year": number,
    "performer": string,
    "genre": string,
    "duration": number
}
 */
exports.up = (pgm) => {
  pgm.createTable("songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    title: { type: "TEXT", notNull: true },
    year: { type: "INTEGER", notNull: true },
    performer: { type: "TEXT", notNull: true },
    genre: { type: "TEXT", notNull: false },
    duration: { type: "INTEGER", notNull: false },
    inserted_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("songs");
};
