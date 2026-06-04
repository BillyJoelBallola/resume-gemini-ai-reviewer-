"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfile } from "@/actions/user.action";
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

type User = {
  id: string;
  username: string;
  email: string;
  businessName?: string | null;
  address?: string | null;
  phone?: string | null;
};

function ProfileForm({ user }: { user: User }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    businessName: user.businessName ?? "",
    address: user.address ?? "",
    phone: user.phone ?? "",
  });

  const isDisabled =
    isSaving || formData.username === "" || formData.email === "";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await updateProfile(formData);
      if (response?.error) return toast.error(response.error);
      if (response?.success) {
        toast.success("Profile updated.");
        router.refresh();
      }
    } catch {
      toast.error("An error occurred while saving changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>
          Update your profile and business information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputWithLabel
              id="username"
              label="Username"
              placeholder="Enter username"
              value={formData.username}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, username: value as string }))
              }
              required
            />
            <InputWithLabel
              id="email"
              label="Email"
              placeholder="Enter email"
              value={formData.email}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, email: value as string }))
              }
              required
            />
            <InputWithLabel
              id="businessName"
              label="Business Name"
              placeholder="Enter business name (optional)"
              value={formData.businessName}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  businessName: value as string,
                }))
              }
            />
            <InputWithLabel
              id="phone"
              label="Phone"
              placeholder="Enter phone (optional)"
              value={formData.phone}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, phone: value as string }))
              }
            />
          </div>
          <InputWithLabel
            id="address"
            label="Address"
            placeholder="Enter address (optional)"
            value={formData.address}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, address: value as string }))
            }
          />
          <Button type="submit" disabled={isDisabled}>
            {isSaving && <Loader className="size-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProfileForm;
