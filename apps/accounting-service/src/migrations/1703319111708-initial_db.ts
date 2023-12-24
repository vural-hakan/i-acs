import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDb1703319111708 implements MigrationInterface {
  name = 'InitialDb1703319111708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "device" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint, CONSTRAINT "PK_2dc10972aa4e27c01378dad2c72" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "number" character varying NOT NULL, "user_id" integer, "created_at" bigint NOT NULL, "updated_at" bigint, CONSTRAINT "UQ_59e0ec91c0cc35060bb0da876f6" UNIQUE ("number"), CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "card" ADD CONSTRAINT "FK_00ec72ad98922117bad8a86f980" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(
      `INSERT INTO "user" ("name", "username", "password", "created_at", "updated_at") SELECT 'Default User' as name, 'default.user' as username, '$2b$10$SPbwHSG0XSKWw.zPVRE0peRG2WlAloY9I5UbKAQvqMyWsaHIbl8lq' as password, (EXTRACT(EPOCH FROM NOW()) * 1000)::bigint as created_at,(EXTRACT(EPOCH FROM NOW()) * 1000)::bigint as updated_at;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "card" DROP CONSTRAINT "FK_00ec72ad98922117bad8a86f980"`,
    );
    await queryRunner.query(`DROP TABLE "card"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "device"`);
  }
}
