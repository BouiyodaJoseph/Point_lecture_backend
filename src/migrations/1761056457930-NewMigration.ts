import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1761056457930 implements MigrationInterface {
    name = 'NewMigration1761056457930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publishers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_39082806f986a63cd7dcf1782a5" UNIQUE ("name"), CONSTRAINT "PK_9d73f23749dca512efc3ccbea6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "coverImageUrl" character varying, "publisher_id" uuid, "category_id" uuid, CONSTRAINT "PK_2c4e732b044e09139d2f1065fae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "publication_packs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_a5ad58d678ac603f460acedf766" UNIQUE ("name"), CONSTRAINT "PK_b00a7c7f24b7bf59e9e557cd400" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "endDate" TIMESTAMP WITH TIME ZONE NOT NULL, "partner_id" uuid NOT NULL, "pack_id" uuid NOT NULL, CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "establishments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "apiKey" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "geofenceRadius" integer NOT NULL, "partner_id" uuid NOT NULL, CONSTRAINT "UQ_d2a77c3342ef58e61f5255a67b3" UNIQUE ("apiKey"), CONSTRAINT "PK_7fb6da6c365114ccb61b091bbdf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "analytics_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "establishmentId" uuid NOT NULL, "eventType" character varying NOT NULL, "eventData" jsonb, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_5d643d67a09b55653e98616f421" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pack_publications" ("pack_id" uuid NOT NULL, "publication_id" uuid NOT NULL, CONSTRAINT "PK_c6ad47d23fd9d09150be86c64bc" PRIMARY KEY ("pack_id", "publication_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_129989402e7506cb7b094d38fb" ON "pack_publications" ("pack_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_783b0f823645e1cf6458185ce8" ON "pack_publications" ("publication_id") `);
        await queryRunner.query(`ALTER TABLE "publications" ADD CONSTRAINT "FK_336954c7e234d832099a969253e" FOREIGN KEY ("publisher_id") REFERENCES "publishers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "publications" ADD CONSTRAINT "FK_c20d4e71122e8a19eb5a1870b03" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_00a30deec685f62b7f6abe7b109" FOREIGN KEY ("partner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subscriptions" ADD CONSTRAINT "FK_93abab8beac23fde4dd7cbbc843" FOREIGN KEY ("pack_id") REFERENCES "publication_packs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "establishments" ADD CONSTRAINT "FK_a84b2a5caf949b450109d01d3b8" FOREIGN KEY ("partner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pack_publications" ADD CONSTRAINT "FK_129989402e7506cb7b094d38fbe" FOREIGN KEY ("pack_id") REFERENCES "publication_packs"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pack_publications" ADD CONSTRAINT "FK_783b0f823645e1cf6458185ce84" FOREIGN KEY ("publication_id") REFERENCES "publications"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pack_publications" DROP CONSTRAINT "FK_783b0f823645e1cf6458185ce84"`);
        await queryRunner.query(`ALTER TABLE "pack_publications" DROP CONSTRAINT "FK_129989402e7506cb7b094d38fbe"`);
        await queryRunner.query(`ALTER TABLE "establishments" DROP CONSTRAINT "FK_a84b2a5caf949b450109d01d3b8"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_93abab8beac23fde4dd7cbbc843"`);
        await queryRunner.query(`ALTER TABLE "subscriptions" DROP CONSTRAINT "FK_00a30deec685f62b7f6abe7b109"`);
        await queryRunner.query(`ALTER TABLE "publications" DROP CONSTRAINT "FK_c20d4e71122e8a19eb5a1870b03"`);
        await queryRunner.query(`ALTER TABLE "publications" DROP CONSTRAINT "FK_336954c7e234d832099a969253e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_783b0f823645e1cf6458185ce8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_129989402e7506cb7b094d38fb"`);
        await queryRunner.query(`DROP TABLE "pack_publications"`);
        await queryRunner.query(`DROP TABLE "analytics_events"`);
        await queryRunner.query(`DROP TABLE "establishments"`);
        await queryRunner.query(`DROP TABLE "subscriptions"`);
        await queryRunner.query(`DROP TABLE "publication_packs"`);
        await queryRunner.query(`DROP TABLE "publications"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "publishers"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
