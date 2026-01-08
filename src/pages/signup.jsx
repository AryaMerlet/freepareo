import { SignupForm } from "@/components/signup-form";
import Users from "@/components/crudUsers";

export default function Page() {
  return (
    <div>
      <SignupForm />;
      <Users />
    </div>
  );
}
