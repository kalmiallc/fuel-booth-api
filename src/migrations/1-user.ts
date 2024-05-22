export async function upgrade(
  queryFn: (query: string, values?: any[]) => Promise<Array<any>>
) {
  await queryFn(`
    CREATE TABLE IF NOT EXISTS \`user\` (
      \`id\` INT NOT NULL AUTO_INCREMENT,
      \`email\` VARCHAR(255) NULL,
      \`username\` VARCHAR(255) NOT NULL,
      \`username_hash\` VARCHAR(255) NULL,
      \`username_email_hash\` VARCHAR(255) NULL,
      \`high_score\` INT NULL,
      \`damage\` INT NULL,
      \`distance\` INT NULL,
      \`speed\` INT NULL,
      \`time_seconds\` INT NULL,
      \`score_type\` VARCHAR(255) NULL,
      \`register_transaction_id\` VARCHAR(255) NULL,
      \`player_contract_index_id\` INT NULL,
      \`status\` INT NULL,
      \`createTime\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
      \`updateTime\` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (\`id\`));
  `);

  await queryFn(`
    CREATE UNIQUE INDEX \`email_UNIQUE\` ON \`user\` (\`email\` ASC) VISIBLE;
  `);
}
export async function downgrade(
  queryFn: (query: string, values?: any[]) => Promise<Array<any>>
) {
  await queryFn(`
    DROP TABLE IF EXISTS \`user\` ;
  `);
}
