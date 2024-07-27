DO $$ BEGIN
 CREATE TYPE "public"."socials_enum" AS ENUM('vk', 'telegram', 'github', 'discord', 'hh');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "main_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"site_name" varchar(255) NOT NULL,
	"site_description" text NOT NULL,
	"open_graph_image" text NOT NULL,
	"hero_epithets" text[] NOT NULL,
	"hero_greeting" text NOT NULL,
	"about_hero" text NOT NULL,
	"phone" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"body" text NOT NULL,
	"role" text NOT NULL,
	"site_link" text NOT NULL,
	"github_link" text NOT NULL,
	"thumbnail_greeting" text NOT NULL,
	"thumbnail_preview" text NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "socials" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"iconify_id" varchar(255) NOT NULL,
	CONSTRAINT "socials_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "technologies" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"body" text NOT NULL,
	"link" text NOT NULL,
	"iconify_id" varchar(255) NOT NULL,
	"image" text NOT NULL,
	CONSTRAINT "technologies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "technologies_to_projects" (
	"technology_id" integer NOT NULL,
	"project_id" integer NOT NULL,
	CONSTRAINT "technologies_to_projects_technology_id_project_id_pk" PRIMARY KEY("technology_id","project_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "technologies_to_projects" ADD CONSTRAINT "technologies_to_projects_technology_id_technologies_id_fk" FOREIGN KEY ("technology_id") REFERENCES "public"."technologies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "technologies_to_projects" ADD CONSTRAINT "technologies_to_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
