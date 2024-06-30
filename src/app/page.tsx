import { Button } from "@/components/ui/button";
import { signInAction } from "@/actions/auth-action";

export default function Home() {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
          <h1>Logged In</h1>

          <form action={signInAction}>
            <Button>Log in</Button>
          </form>
        </main>
      </div>
    </div>
  );
}
