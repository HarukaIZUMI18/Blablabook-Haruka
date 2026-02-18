CREATE TABLE "USER" (
  "id" integer PRIMARY KEY,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "name" varchar(100) NOT NULL
);

CREATE TABLE "BOOK" (
  "id" integer PRIMARY KEY,
  "title" varchar(100) NOT NULL,
  "cover" vachar NOT NULL,
  "author" varchar(100) NOT NULL,
  "description" text NOT NULL,
  "publish_year" year NOT NULL
);

CREATE TABLE "COLLECT" (
  "user_id" integer,
  "book_id" integer,
  "status" varchar(50) NOT NULL
);

ALTER TABLE "COLLECT" ADD FOREIGN KEY ("user_id") REFERENCES "USER" ("id");

ALTER TABLE "COLLECT" ADD FOREIGN KEY ("book_id") REFERENCES "BOOK" ("id");
