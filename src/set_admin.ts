import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function setAdminPassword() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);
  await db.update(users).set({ passwordHash }).where(eq(users.email, 'admin@lifestyle.com'));
  console.log('Password for admin@lifestyle.com successfully updated to admin123');
}

setAdminPassword().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
