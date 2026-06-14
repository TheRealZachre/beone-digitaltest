import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { googleEnabled } from "@/lib/auth/constants";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Register with email or Google to get started"
    >
      <RegisterForm googleEnabled={googleEnabled} />
    </AuthShell>
  );
}
