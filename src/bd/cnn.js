const { exec } = require('child_process');
const path = require('path');

const changelogFile = path.join(__dirname, 'db.changelog-master.xml'); // Ruta al changelog
const dbUrl = 'jdbc:postgresql://localhost:5432/users_bd'; // URL de la base de datos
const dbUser = 'postgres'; // Usuario de la base de datos
const dbPassword = '1234'; // Contraseña de la base de datos

// Comando para ejecutar Liquibase
const command = `liquibase --url=${dbUrl} --username=${dbUser} --password=${dbPassword} --changeLogFile=${changelogFile} update`;

// Ejecutar el comando de Liquibase
exec(command, (err, stdout, stderr) => {
  if (err) {
    console.error(`Error al ejecutar Liquibase: ${stderr}`);
    return;
  }
  console.log(`Liquibase ejecutado correctamente: ${stdout}`);
});
