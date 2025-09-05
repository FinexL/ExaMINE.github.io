//temporary script to delete later
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");

async function hashPasswords() {
  const connection = await mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "Capstone2025",
    database: "examine_db"
  });

  const [users] = await connection.execute("SELECT user_id, user_password FROM users");

  for (let user of users) {
    // Only hash if not already hashed
    if (!user.user_password.startsWith("$2a$")) {
      const hashed = await bcrypt.hash(user.user_password, 10);
      await connection.execute("UPDATE users SET user_password = ? WHERE user_id = ?", [hashed, user.user_id]);
      console.log(`Updated password for user_id ${user.user_id}`);
    }
  }

  await connection.end();
}

hashPasswords().catch(err => console.error(err));
