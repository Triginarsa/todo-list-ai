import { Button } from "@/components/ui/button";
import { signInAction } from "@/actions/auth-action";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>Logged In</h1>

      <form action={signInAction}>
        <Button>Log in</Button>
      </form>
    </main>
  );
}
