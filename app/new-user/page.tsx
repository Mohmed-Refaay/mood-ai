import { prisma } from "@/utils/db";
import { auth } from "@clerk/nextjs/server";
import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const { userId } = auth();

  let user = await prisma.user.findUnique({
    where: {
      clerkId: userId as string,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId as string,
      },
    });
  }

  redirect("/journal");
};

export default async function NewUserPage() {
  await createNewUser();

  return (
    <>
      <h1>Hello, new user! Welcome to the app!</h1>
    </>
  );
}
