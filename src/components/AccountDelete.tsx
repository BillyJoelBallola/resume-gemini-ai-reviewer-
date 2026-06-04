"use client";

import { deleteAccount } from "@/actions/user.action";
import { useState } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputWithLabel from "@/components/InputWithLabel";

function AccountDelete({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ username: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDeleting(true);

    try {
      const response = await deleteAccount(userId, formData.username);
      if (response.error) return toast.error(response.error);

      toast.success("Account deleted permanently.");
      return (window.location.href = "/");
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader>
        <CardTitle className="text-red-500">Danger Zone</CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data (Invoice &
          Clients).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer">
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              To confirm, type your{" "}
              <span className="font-semibold">username</span> in the box below.
            </DialogDescription>
            <form id="confirmationForm" onSubmit={handleDelete}>
              <InputWithLabel
                id="username"
                placeholder=""
                value={formData.username}
                onChange={(value) =>
                  setFormData((_) => ({ username: value as string }))
                }
                required
              />
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                form="confirmationForm"
                type="submit"
                variant="destructive"
                disabled={isDeleting || formData.username === ""}
              >
                {isDeleting && <Loader className="size-4 animate-spin" />}{" "}
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

export default AccountDelete;
