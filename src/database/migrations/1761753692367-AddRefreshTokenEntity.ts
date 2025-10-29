import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenEntity1761753692367 implements MigrationInterface {
  name = 'AddRefreshTokenEntity1761753692367';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refreshTokens" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, "tokenHash" character varying(500) NOT NULL, "isRevoked" boolean NOT NULL DEFAULT false, "expiresAt" TIMESTAMP NOT NULL, CONSTRAINT "UQ_3ad742609b3348764114f003409" UNIQUE ("tokenHash"), CONSTRAINT "PK_c4a0078b846c2c4508473680625" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_265bec4e500714d5269580a021" ON "refreshTokens" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3ad742609b3348764114f00340" ON "refreshTokens" ("tokenHash") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_409ab1618280a9ae854ec65868" ON "refreshTokens" ("isRevoked") `,
    );
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_265bec4e500714d5269580a0219" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_265bec4e500714d5269580a0219"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_409ab1618280a9ae854ec65868"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_3ad742609b3348764114f00340"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_265bec4e500714d5269580a021"`);
    await queryRunner.query(`DROP TABLE "refreshTokens"`);
  }
}
