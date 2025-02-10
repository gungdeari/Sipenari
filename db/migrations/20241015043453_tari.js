/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tari', function(table) {
      table.increments('id').primary(); 
      table.string('nama_tari').notNullable();
      table.string('gambar_banner').notNullable(); 
      table.string('desc_singkat').notNullable();
      table.text('desc_lengkap'); 
      table.string('asal').notNullable(); 
      table.string('jenis').notNullable(); 
      table.string('tokoh_penting'); 
      table.timestamps(true, true); 
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('tari');
  };
  