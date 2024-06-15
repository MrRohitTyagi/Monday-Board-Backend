import bcryptjs from "bcryptjs";

async function comparePassword(pass1, pass2) {
  console.log("{pass1,pass2}", { pass1, pass2 });
  return await bcryptjs.compare(pass1, pass2);
}
function hashPassword(pass) {
  return bcryptjs.hashSync();
}

export { comparePassword };
