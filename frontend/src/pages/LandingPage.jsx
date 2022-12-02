import Hero from "../components/section/homepage/Hero";
import useUser from "../hooks/useUser";

export default function LandingPage() {
  const {user, isAdmin, isAuthenticating} = useUser()
  return (
   <>
    <Hero />
   </>
  )
}
