"use client";

import { signOut } from "@/actions/auth.action";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SignOutDialog() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      return router.push("/");
    } catch (error) {
      toast.error("Error occured while signing out");
    } finally {
      setIsSigningOut(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-sm font-normal cursor-pointer px-1 w-full justify-start"
        >
          Sign Out
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Are you sure you want to sign out?</p>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => setIsSigningOut(false)}
              disabled={isSigningOut}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={isSigningOut} onClick={handleSignOut}>
            {isSigningOut && <Loader className="size-4 animate-spin" />} Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SignOutDialog;
