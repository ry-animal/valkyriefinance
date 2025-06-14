"use client"
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession();

  // TODO: Re-enable tRPC integration after fixing type issues
  // const privateData = useQuery({
  //   queryKey: ['privateData'],
  //   queryFn: () => trpc.privateData.query(),
  // });

  useEffect(() => {
    if (!session && !isPending) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome {session?.user.name}</p>
      {/* <p>privateData: {privateData.data?.message}</p> */}
    </div>
  );
}
