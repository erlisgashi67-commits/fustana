/**
 * Helper script to create a custom admin account.
 *
 * Usage:
 *   1. Edit the email, name, and password below
 *   2. Run: bun run prisma/add-admin.ts
 *
 * NEVER commit real credentials to the repository.
 * Always use placeholder values here and set real values locally.
 */

import { db } from "../src/lib/db";
import { hashPassword } from "../src/lib/auth";

async function main() {
  // ⚠️  EDIT THESE VALUES LOCALLY — do not commit real credentials!
  const email = "your-email@example.com";
  const name = "Your Name";
  const password = "your-strong-password";

  const existing = await db.admin.findUnique({ where: { email } });
  if (existing) {
    await db.admin.update({
      where: { email },
      data: { passwordHash: hashPassword(password), name },
    });
    console.log(`✅ Admin updated: ${email}`);
  } else {
    await db.admin.create({
      data: {
        email,
        name,
        passwordHash: hashPassword(password),
      },
    });
    console.log(`✅ New admin created: ${email}`);
  }
  console.log(`   Change the credentials above before running this script.`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
