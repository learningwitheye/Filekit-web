import { Hero } from "@/components/home/hero"
import { PopularTools } from "@/components/home/popular-tools"
import { AllCategories } from "@/components/home/all-categories"
import { Pricing } from "@/components/home/pricing"

export default function HomePage() {
  return (
    <>
      <Hero />
      <PopularTools />
      <AllCategories />
      <Pricing />
    </>
  )
}
