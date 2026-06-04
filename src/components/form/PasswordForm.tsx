"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import InputWithLabel from "@/components/InputWithLabel";
import { Loader } from "lucide-react";

function PasswordForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const isDisabled =
    isSaving ||
    formData.currentPassword === "" ||
    formData.newPassword === "" ||
    formData.confirmPassword === "";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await updatePassword(formData);
      if (response?.error) return toast.error(response.error);
      if (response?.success) {
        toast.success("Password updated.");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch {
      toast.error("An error occurred while updating password.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Update your account password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithLabel
            id="currentPassword"
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={formData.currentPassword}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                currentPassword: value as string,
              }))
            }
            required
          />
          <InputWithLabel
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                newPassword: value as string,
              }))
            }
            required
          />
          <InputWithLabel
            id="confirmPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                confirmPassword: value as string,
              }))
            }
            required
          />
          <Button type="submit" disabled={isDisabled}>
            {isSaving && <Loader className="size-4 animate-spin" />}
            Update Password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default PasswordForm;
