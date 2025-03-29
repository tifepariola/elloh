import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 378.03 146.46" className="h-8 w-auto fill-mine-shaft-800">
                <g id="Layer_1-2" data-name="Layer 1"><path d="M86.57 130.36c-10.22 10.22-22.27 15.7-35.17 15.94-13.39.49-25.31-4.87-36.02-15.58S-.56 107.96.05 94.7 5.53 70 14.78 60.75c9.37-9.37 20.57-14.48 32.61-15.33 12.53-.85 23.61 3.65 33.47 13.51L93.03 71.1 76.36 87.77l26.29.97v3.65c-.49 14.85-5.84 27.75-16.06 37.97Zm-38.7-14.12c2.31.61 4.62.73 7.06.24 4.62-.73 8.4-2.8 11.68-6.08 5.48-5.48 8.15-11.56 8.03-18.74v-2.19l-26.77 26.77Zm3.65-39.43c-2.31-1.1-4.38-1.46-6.81-1.46-3.41.49-6.69 2.07-9.61 4.99s-4.62 6.33-5.35 10.71c-.49 2.43-.24 4.87.61 6.94l21.17-21.17ZM140.88 146.46h-37.86V0h37.86v146.46ZM182.18 146.46h-37.86V0h37.86v146.46ZM182.18 96.55c0-27.54 22.37-49.74 49.91-49.74S282 69.01 282 96.55s-22.37 49.91-49.91 49.91-49.91-22.37-49.91-49.91Zm49.74 14.8c8.09 0 14.63-6.54 14.63-14.63s-6.54-14.63-14.63-14.63-14.46 6.54-14.46 14.63 6.54 14.63 14.46 14.63ZM343.61 146.46V91.9c0-5.51-1.03-9.81-2.93-12.05-.52-.69-2.24-2.75-7.92-2.75-4.13 0-7.4 1.21-10.5 3.96-3.96 3.61-3.96 9.64-3.96 11.53v53.87h-34.42V0h34.42v49.22a41.04 41.04 0 0 1 19.62-4.99c11.7 0 21.51 3.79 28.91 11.19s11.19 17.9 11.19 31.15v59.89H343.6Z"/></g>
              </svg>
              <span className="sr-only">Acme Inc.</span>
            </a>
            <h1 className="text-xl font-bold">Welcome back</h1>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <Button type="button" onClick={() => navigate("/inbox")} className="w-full">
              Login
            </Button>
          </div>
          {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div> */}
        </div>
      </form>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
