import { auth } from "@clerk/nextjs/server";
import { prisma } from "./db";
import { revalidatePath } from "next/cache";

export async function getUser() {
  const { userId } = auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
  });

  revalidatePath("/journal");

  return user;
}
