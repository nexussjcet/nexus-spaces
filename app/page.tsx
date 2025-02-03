import { auth } from "@/auth";
import { HomePage } from "@/components/custom/home-page";

export default async function Home() {
  const session = await auth();

  return (
    <>
      {session ? (
        <HomePage />
      ) : (
        <HomePage />
      )}
    </>
  );
}
