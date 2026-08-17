import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Board, Comment, Issue, IssueUser, Organization, OrganizationUser, Section, User } from "./data";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  // Create multiple users
  await prisma.user.createMany({
    data: User,
    skipDuplicates: true, // prevents errors if you run the seed multiple times
  });

  await prisma.organization.createMany({
    data: Organization,
    skipDuplicates: true
  })

  await prisma.organizationUser.createMany({
    data: OrganizationUser,
    skipDuplicates: true
  })

  await prisma.board.createMany({
    data: Board,
    skipDuplicates: true
  })

  await prisma.section.createMany({
    data: Section,
    skipDuplicates: true
  })

  await prisma.issue.createMany({
    data: Issue,
    skipDuplicates: true
  })

  await prisma.issueUser.createMany({
    data: IssueUser,
    skipDuplicates: true
  })

  await prisma.comment.createMany({
    data: Comment,
    skipDuplicates: true
  })

  console.log("Seed data inserted!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
