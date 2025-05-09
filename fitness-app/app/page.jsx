"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Dumbbell,
  ChevronRight,
  BarChart3,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Smartphone,
  LineChart,
  Layers,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [showJoke, setShowJoke] = useState(false)
  const { scrollYProgress } = useScroll()
  const router = useRouter()
  const showcaseRef = useRef(null)

  const featureOpacity = useTransform(scrollYProgress, [0.05, 0.15], [0, 1])
  const showcaseOpacity = useTransform(scrollYProgress, [0.2, 0.3], [0, 1])
  const testimonialOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])
  const ctaOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])

  // Mock workout data for the animated chart
  const workoutData = [65, 40, 70, 55, 80, 60, 90]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Dumbbell className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">FitTrack</span>
              </div>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#app-showcase"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                App Showcase
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Pricing
              </a>
              <Link
                href="/auth/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#app-showcase"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                App Showcase
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </a>
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center text-blue-600 dark:text-blue-400">
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 md:pt-40 md:pb-32 lg:min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Transform your</span>
                  <span className="block text-blue-600 dark:text-blue-400">fitness journey</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 sm:text-xl max-w-3xl">
                  Track your workouts, analyze your progress, and achieve your fitness goals with our comprehensive
                  workout tracking platform.
                </p>
                <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/auth/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Get started for free
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <a
                      href="#features"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Learn more
                    </a>
                  </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:mt-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Easy to Use</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Designed for simplicity so you can focus on your workout, not the app.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    className="flex items-start w-full h-full"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Track Progress</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        See your gains with beautiful charts and detailed analytics.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <Calendar className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stay Consistent</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Schedule workouts and build habits that last with reminders.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 group self-start">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative mx-auto w-full rounded-lg shadow-lg"
              >
                <div className="relative group-hover:scale-120 transition-all duration-300">
                  <Image 
                    src='/images/analytics.png'
                    height={800}
                    width={1200}
                    alt="hero"
                    className=""
                  />
                </div>

                {/* Floating workout card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-48 hover:scale-110 transition-all duration-300 group-hover:translate-x-[50%] group-hover:translate-y-[50%]"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Dumbbell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Chest Day</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">4 exercises</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Bench Press</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">3 × 8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">Incline Press</span>
                      <span className="text-xs font-medium text-gray-900 dark:text-white">3 × 10</span>
                    </div>
                  </div>
                </motion.div>

                {/* Floating achievement card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 transition-all duration-300 group-hover:-translate-x-[50%] group-hover:-translate-y-[50%]"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">New Record!</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Bench Press: 225 lbs</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section id="features" className="py-16 bg-gray-50 dark:bg-gray-900" style={{ opacity: featureOpacity }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to reach your fitness goals
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
              Our comprehensive platform provides all the tools you need to track, analyze, and improve your workouts.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
              >
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                      <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">Workout Tracking</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                    Log your exercises, sets, reps, and weights with our intuitive interface. Track your rest times and
                    supersets with ease.
                  </p>
                </div>
                <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center"
                    >
                      Learn more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
              >
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">Progress Analytics</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                    Visualize your progress with detailed charts and graphs. Track your strength gains, volume, and
                    one-rep max over time.
                  </p>
                </div>
                <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center"
                    >
                      Learn more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Feature 3 */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
              >
                <div className="px-6 py-8">
                  <div className="flex items-center">
                    <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-md flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="ml-4 text-xl font-medium text-gray-900 dark:text-white">Workout Programs</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-600 dark:text-gray-300">
                    Create custom workout programs or choose from our library of pre-built routines. Schedule your
                    workouts and stay consistent.
                  </p>
                </div>
                <div className="px-6 py-2 bg-gray-50 dark:bg-gray-700/50">
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 flex items-center"
                    >
                      Learn more <ChevronRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* App Showcase Section */}
      <motion.section
        id="app-showcase"
        ref={showcaseRef}
        className="py-16 bg-white dark:bg-gray-800"
        style={{ opacity: showcaseOpacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Experience the FitTrack App
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
              Designed for serious athletes and fitness enthusiasts who want to take their training to the next level.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      <Smartphone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Intuitive Mobile Interface</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                      Our clean, user-friendly interface makes tracking your workouts a breeze, whether you're at the
                      gym or at home.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      <LineChart className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Detailed Analytics</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                      Visualize your progress with comprehensive charts and metrics that help you understand your
                      performance trends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                      <Layers className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customizable Workouts</h3>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-300">
                      Create and customize your workout routines with our extensive exercise library and flexible
                      programming tools.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* App Screenshot Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative mx-auto w-full max-w-md">
                  {/* Main App Screenshot */}
                  <div className="relative z-10 overflow-hidden rounded-xl shadow-2xl">
                    {/* This is where you would insert your app screenshot */}
                    <div className="aspect-w-9 aspect-h-16 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Image 
                        src="/images/create.png"
                        width={1000}
                        height={1000}
                        alt="demo"
                      />
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute -bottom-8 right-4 w-72 h-72 bg-blue-300/30 dark:bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-blue-500/30 dark:bg-blue-700/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                </div>

                {/* Floating Feature Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  viewport={{ once: true }}
                  className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-20 max-w-xs"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Real-time Progress</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">See your improvements as they happen</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        id="testimonials"
        className="py-16 bg-gray-50 dark:bg-gray-900"
        style={{ opacity: testimonialOpacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Trusted by fitness enthusiasts worldwide
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
              See what our users have to say about their experience with our platform.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Fitness Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "This app has completely transformed my workout routine. The analytics help me understand my progress
                and the program builder makes it easy to plan my workouts."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Michael Chen</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Personal Trainer</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "As a personal trainer, I recommend this app to all my clients. It's easy to use and provides detailed
                insights that help me tailor their training programs effectively."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div whileHover={{ scale: 1.03 }} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=48&width=48"
                    alt="User avatar"
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">David Rodriguez</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Bodybuilder</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The detailed analytics and progress tracking have been game-changers for my competition prep. I can see
                exactly how I'm progressing and make adjustments as needed."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section with Humor */}
      <section id="pricing" className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-600 dark:text-gray-300 mx-auto">
              Choose the plan that works for you
            </p>
          </div>

          {/* Initial Pricing Display */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: showJoke ? 0 : 1, height: showJoke ? 0 : "auto" }}
            transition={{ duration: 0.5 }}
            className={`mt-16 grid gap-8 lg:grid-cols-3 ${showJoke ? "hidden" : "block"}`}
          >
            {/* Free Plan */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Basic</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$9</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400 self-end">/month</span>
                </div>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  Perfect for beginners starting their fitness journey
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Track up to 10 workouts per month</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Basic progress analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Access to 10+ workout templates</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => setShowJoke(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Select plan
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-blue-500 dark:border-blue-400"
            >
              <div className="px-6 py-8">
                <div className="flex justify-center">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold tracking-wide uppercase bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    Most Popular
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white text-center">Pro</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$19</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400 self-end">/month</span>
                </div>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  For dedicated fitness enthusiasts who want more insights
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Unlimited workout tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Advanced analytics and insights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Access to 50+ workout templates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Custom workout program builder</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => setShowJoke(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Select plan
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Elite Plan */}
            <motion.div
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Elite</h3>
                <div className="mt-4 flex justify-center">
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">$39</span>
                  <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400 self-end">/month</span>
                </div>
                <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
                  For serious athletes and professionals
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-8">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Everything in Pro plan</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">AI workout recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Nutrition tracking and analysis</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Priority support</span>
                  </li>
                </ul>
                <div className="mt-8">
                  <button
                    onClick={() => setShowJoke(true)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Select plan
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Joke Reveal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: showJoke ? 1 : 0, scale: showJoke ? 1 : 0.9 }}
            transition={{ duration: 0.5 }}
            className={`mt-16 ${showJoke ? "block" : "hidden"}`}
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-900 rounded-xl shadow-xl overflow-hidden">
              <div className="px-8 py-12 text-center">
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="inline-block text-6xl mb-4">🎉</span>
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">Just kidding!</h3>
                <p className="text-xl text-blue-100 mb-6">
                  FitTrack is completely <span className="font-bold underline">FREE</span> during our beta period!
                </p>
                <p className="text-lg text-blue-100 mb-8">
                  We believe fitness should be accessible to everyone. Enjoy all premium features without paying a dime.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                  >
                    Sign up for free
                  </Link>
                  <button
                    onClick={() => setShowJoke(false)}
                    className="px-8 py-3 bg-blue-800 text-white font-medium rounded-lg shadow-md hover:bg-blue-900 transition-colors"
                  >
                    Show me the pricing again
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section className="py-16 bg-blue-600 dark:bg-blue-700" style={{ opacity: ctaOpacity }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ready to transform your fitness journey?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join thousands of users who have already improved their workouts and achieved their fitness goals with
                our platform.
              </p>
              <div className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
                  >
                    Get started for free
                    <ArrowRight className="ml-2 -mr-1 h-5 w-5 text-blue-600" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <form className="sm:max-w-md sm:mx-auto lg:mx-0">
                <div className="sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    />
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault()
                        if (email) {
                          router.push(`/auth/register?email=${encodeURIComponent(email)}`)
                        }
                      }}
                      className="block w-full py-3 px-4 rounded-md shadow bg-blue-800 text-white font-medium hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      Sign up
                    </button>
                  </div>
                </div>
                <p className="mt-3 text-sm text-blue-100">Start your free trial today. No credit card required.</p>
              </form>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                Product
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                Company
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider uppercase">
                Connect
              </h3>
              <ul className="mt-4 space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-base text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-base text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} FitTrack. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
