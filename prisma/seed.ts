import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { company } from "@western-mass-septic/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@westernmassseptic.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@westernmassseptic.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log(`Created admin: ${admin.email} (password: admin123)`);

  const stages = company.pipeline.stages.map((s) => s.key);
  const sampleLeads = [
    { name: "Jane Doe", email: "jane@example.com", phone: "(413) 555-0001", stage: stages[0] ?? "lead", source: "website" },
    { name: "Bob Smith", email: "bob@example.com", phone: "(413) 555-0002", stage: stages[1] ?? "contacted", source: "phone" },
    { name: "Alice Jones", email: "alice@example.com", phone: "(413) 555-0003", stage: stages[2] ?? "scheduled", source: "website" },
  ];

  for (const leadData of sampleLeads) {
    await prisma.lead.create({
      data: { ...leadData, customFields: {} },
    });
    console.log(`Created lead: ${leadData.name}`);
  }

  console.log("\nSeed complete. Login: admin@westernmassseptic.com / admin123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
