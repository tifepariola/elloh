import { completeLogin, login } from "@/api/auth"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { AlertCircleIcon, Loader2Icon } from "lucide-react"
import { useState } from "react"
import SvgLogo from "./SvgLogo"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/store/authContext"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await login(email);
      console.log(response);
      if (response.challengeID) {
        setChallengeId(response.challengeID);
      }
    } catch (error) {
      setError("An error occured.");
    } finally {
      setIsLoading(false);
    }
  }
  const handleCompleteLogin = async () => {
    setIsLoading(true);
    try {
      const response = await completeLogin(challengeId, code);
      if (response.token) {
        authLogin(response.token, email);
        navigate("/inbox");
      }
    } catch (error) {
      setError("That doesn't seem to be the right code.");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={(e) => {
        e.preventDefault();
      }}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <SvgLogo className="h-8 w-auto fill-mine-shaft-800" />
              <span className="sr-only">Elloh</span>
            </a>
            <h1 className="text-xl font-bold">Welcome back</h1>

          </div>
          {error && <div className="grid w-full max-w-xl items-start gap-4">

            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </div>}
          {challengeId === "" ? (
            <div className="flex flex-col gap-6">
              <div className="text-center text-sm">
                Enter your email to continue
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="button" onClick={() => handleLogin()} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2Icon className="animate-spin" /> : "Continue"}
              </Button>
            </div>) : (
            <div className="flex flex-col gap-6">
              <div className="text-center text-sm">
                Enter the code sent to your email to continue
              </div>
              <div className="grid gap-3 justify-center">
                <InputOTP maxLength={6} value={code} onChange={(e) => setCode(e)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="button" onClick={() => handleCompleteLogin()} className="w-full" disabled={isLoading || code.length !== 6}>
                {isLoading ? <Loader2Icon className="animate-spin" /> : "Login"}
              </Button>
            </div>)}

        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
