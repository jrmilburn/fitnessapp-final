"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Dumbbell, BarChart3, Calendar, Target, Menu, X } from "lucide-react"
import { useState } from "react"

export default function FitnessLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: "Program Builder",
      description: "Create custom workout programs tailored to your goals with our intuitive program builder",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Monitor your strength gains and performance with detailed analytics and visual progress charts",
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Workout Scheduling",
      description: "Plan your training sessions and stay consistent with smart scheduling and reminders",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Goal Setting",
      description: "Set specific fitness goals and track your journey with milestone achievements",
    },
  ]

  const benefits = [
    "Custom workout program creation",
    "Detailed exercise tracking",
    "Progress analytics and insights",
    "Personal record tracking",
    "Workout history and trends",
    "Mobile-optimized interface",
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content:
        "This app has completely transformed how I approach my workouts. The program builder is incredibly intuitive and the progress tracking keeps me motivated.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer",
      content:
        "I use this with all my clients. The ability to create custom programs and track their progress in real-time has been a game-changer for my business.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Powerlifter",
      content:
        "The detailed analytics help me understand my training patterns and optimize my performance. It's like having a coach in your pocket.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="font-bold text-xl text-gray-900">Fitness.jm</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#benefits" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Benefits
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Testimonials
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#features"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#benefits"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefits
              </a>
              <a
                href="#testimonials"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Testimonials
              </a>
              <Link
                href="/auth/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Build Programs,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Track Progress
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Create custom workout programs, track your lifts, and monitor your progress with our comprehensive
                fitness tracking platform designed for serious athletes.
              </p>
              <div className="mt-10 flex items-center justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors flex items-center gap-2"
                >
                  Start Training Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/auth/login"
                  className="rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  Sign In
                </Link>
              </div>
              <p className="mt-4 text-sm text-gray-500">Free to use • No credit card required</p>
            </div>

            {/* Hero Demo */}
            <div className="mt-16 flow-root sm:mt-24">
              <div className="relative rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl lg:p-4">
                <div className="rounded-md bg-white p-6 shadow-2xl ring-1 ring-gray-900/10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-sm text-gray-500">fitness.joemilburn.com</div>
                  </div>

                  {/* Mock App Interface */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Push Day - Week 1</h3>
                      <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Active Program</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Bench Press</span>
                            <span className="text-sm text-gray-500">4 sets</span>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Set 1:</span>
                              <span className="font-medium">225 lbs × 8</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Set 2:</span>
                              <span className="font-medium">225 lbs × 6</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>Set 3:</span>
                              <span>225 lbs × ?</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">Incline Press</span>
                            <span className="text-sm text-gray-500">3 sets</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <div>185 lbs × 10 reps</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-3">Progress This Week</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-blue-700">Total Volume:</span>
                            <span className="font-medium text-blue-900">12,450 lbs</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">Workouts:</span>
                            <span className="font-medium text-blue-900">3/4 completed</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-700">PRs Hit:</span>
                            <span className="font-medium text-blue-900">2 this week</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to excel in the gym
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Powerful tools designed to help you build better programs and track meaningful progress
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="mx-auto h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Why serious athletes choose our platform
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Join thousands of lifters who have transformed their training with our comprehensive tracking and
                program building tools.
              </p>

              <div className="mt-8 space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Start Building Programs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 p-8">
                <div className="h-full w-full rounded-xl bg-white shadow-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        F
                      </div>
                      <span className="font-semibold">Training Analytics</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-blue-600">156</div>
                        <div className="text-xs text-gray-600">Workouts Logged</div>
                      </div>
                      <div className="bg-gray-50 rounded p-3 text-center">
                        <div className="text-2xl font-bold text-green-600">+15%</div>
                        <div className="text-xs text-gray-600">Strength Gain</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                        🏋️ Bench Press: 225 lbs (+10)
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                        📈 Volume: 12,450 lbs this week
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded p-2 text-xs">
                        🎯 Goal: 315 lb deadlift (85% complete)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by athletes worldwide
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              See what our users have to say about their training transformation
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to transform your training?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of athletes who have already elevated their fitness journey with our platform.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200">Free to use • No setup fees • Start training immediately</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center">
                <Dumbbell className="h-3 w-3" />
              </div>
              <span className="font-semibold text-white">Fitness.jm</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/auth/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="text-sm text-gray-400 hover:text-white transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-800 pt-8 text-center">
            <p className="text-sm text-gray-400">
              © 2025 Joe Milburn. Built for athletes who demand more from their training.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
