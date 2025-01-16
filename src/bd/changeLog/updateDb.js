const liquibase = require('liquibase-node');


const liquibaseConfig = {
  url: 'jdbc:postgresql://localhost:5432/users_bd', // URL de la base de datos
  username: 'postgres', // Usuario de la base de datos
  password: '1234', // Contraseña de la base de datos
  driver: 'org.postgresql.Driver', // Driver de PostgreSQL
  changeLogFile: './db.changelog-master.xml', // Ruta al archivo de changelog
};

// Ejecutar Liquibase
liquibase.update(liquibaseConfig)
  .then(() => {
    console.log('Base de datos actualizada correctamente');
  })
  .catch((err) => {
    console.error('Error al ejecutar Liquibase:', err);
  });
