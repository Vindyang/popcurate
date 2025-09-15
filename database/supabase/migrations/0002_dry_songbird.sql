CREATE TABLE "movies" (
	"movie_id" integer PRIMARY KEY NOT NULL,
	"overview" text,
	"title" text,
	"genres" text,
	"release_date" timestamp,
	"poster_path" text,
	"tmdb_data" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
