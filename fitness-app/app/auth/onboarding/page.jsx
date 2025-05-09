"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Dumbbell, User, Camera, Upload, Check, ArrowRight } from "lucide-react"
import { toast } from "react-hot-toast"

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [profileImage, setProfileImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const fileInputRef = useRef(null)
  const router = useRouter()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrors({ image: "Image must be less than 5MB" })
      return
    }

    if (!file.type.startsWith("image/")) {
      setErrors({ image: "File must be an image" })
      return
    }

    setProfileImage(file)
    setPreviewUrl(URL.createObjectURL(file))
    setErrors({})
  }

  const validateStep = () => {
    const newErrors = {}

    if (step === 1) {
      if (!name.trim()) {
        newErrors.name = "Please enter your name"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (!validateStep()) return
    setStep(step + 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      if (profileImage) {
        formData.append("profilePicture", profileImage)
      }

      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Failed to complete onboarding")
        setIsLoading(false)
        return
      }

      toast.success("Profile setup complete!")
      router.push("/workout")
    } catch (error) {
      toast.error("An error occurred during profile setup")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 fixed inset-0 z-[10000]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                <Dumbbell className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>

            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 1
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : 1}
                </div>
                <div className={`w-12 h-1 ${step > 1 ? "bg-emerald-600" : "bg-gray-200 dark:bg-gray-700"}`}></div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 2
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step > 2 ? <Check className="h-5 w-5" /> : 2}
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
              {step === 1 ? "What should we call you?" : "Add a profile picture"}
            </h1>

            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              {step === 1
                ? "Let us know your name so we can personalize your experience"
                : "Upload a profile picture to make your account more personal"}
            </p>

            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2.5 border ${
                        errors.name ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                      } rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 dark:text-white`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                <div className="flex flex-col items-center">
                  <div onClick={() => fileInputRef.current.click()} className="relative cursor-pointer group">
                    <div
                      className={`h-32 w-32 rounded-full flex items-center justify-center overflow-hidden border-2 ${
                        previewUrl ? "border-emerald-500" : "border-dashed border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {previewUrl ? (
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Profile preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Camera className="h-12 w-12 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 h-8 w-8 bg-emerald-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                      <Upload className="h-4 w-4 text-white" />
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="mt-4 text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    {previewUrl ? "Change picture" : "Upload a picture"}
                  </button>

                  {errors.image && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image}</p>}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Complete
                        <Check className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                  You can skip this step and add a profile picture later
                </p>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Skip for now
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
