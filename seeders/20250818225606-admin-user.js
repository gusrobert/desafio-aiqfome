'use strict';

const { hash } = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Cria a role admin
    await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Busca o id da role admin
    const [role] = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin' LIMIT 1;",
    );
    const roleId = role[0]?.id;

    // Cria o usuário admin
    const password = await hash('admin', 10);
    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@example.com',
        password,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Busca o id do usuário admin
    const [user] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@example.com' LIMIT 1;",
    );
    const userId = user[0]?.id;

    // Vincula o usuário admin à role admin
    if (userId && roleId) {
      await queryInterface.bulkInsert('user_roles', [
        {
          userId,
          roleId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },
  async down(queryInterface, Sequelize) {
    // Remove o vínculo user_roles
    const [user] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = 'admin@exemplo.com' LIMIT 1;",
    );
    const userId = user[0]?.id;
    if (userId) {
      await queryInterface.bulkDelete('user_roles', { userId }, {});
    }
    // Remove o usuário admin
    await queryInterface.bulkDelete(
      'users',
      { email: 'admin@exemplo.com' },
      {},
    );
    // Remove a role admin
    await queryInterface.bulkDelete('roles', { name: 'admin' }, {});
  },
};
