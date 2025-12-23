
import LoginPage from "@/app/login/page";

// Since we are using Google Auth, Signup is essentially the same flow.
// We can reuse the UI or provide a specific context. For now, reusing Login.
export default function SignupPage() {
    return <LoginPage />;
}
