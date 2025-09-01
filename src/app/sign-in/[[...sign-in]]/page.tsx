import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back to SkillPilot</h1>
          <p className="mt-2 text-gray-600">Sign in to continue your learning journey</p>
        </div>
        <div className="w-full flex justify-center">
          <SignIn 
            routing="path"
            path="/sign-in"
            appearance={{
              elements: {
                rootBox: "mx-auto w-full max-w-sm",
                card: "shadow-lg w-full"
              }
            }}
            redirectUrl="/welcome"
          />
        </div>
      </div>
    </div>
  )
}
