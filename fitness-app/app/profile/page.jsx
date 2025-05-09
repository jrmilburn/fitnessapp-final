"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { User, Camera, Upload, ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"
import UserProfile from "../../components/navbar/UserProfile"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [profileImage, setProfileImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [originalImageUrl, setOriginalImageUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [hasChanges, setHasChanges] = useState(false)

  const fileInputRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("/api/user/profile")
        if (!res.ok) {
          throw new Error("Failed to fetch profile")
        }

        const userData = await res.json()
        setUser(userData)
        setName(userData.name || "")

        // If user has a profile picture, create a URL for it
        if (userData.hasProfilePicture) {
          const imageUrl = `/api/user/profile-image?${new Date().getTime()}`
          setOriginalImageUrl(imageUrl)
          setPreviewUrl(imageUrl)
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Failed to load profile")
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    // Check if there are any changes to save
    if (user) {
      const nameChanged = name !== (user.name || "")
      const imageChanged = profileImage !== null
      setHasChanges(nameChanged || imageChanged)
    }
  }, [name, profileImage, user])

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

  const validateForm = () => {
    const newErrors = {}

    if (!name.trim()) {
      newErrors.name = "Please enter your name"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!hasChanges) return

    setIsSaving(true)

    try {
      const formData = new FormData()
      formData.append("name", name)

      if (profileImage) {
        formData.append("profilePicture", profileImage)
      }

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to update profile")
      }

      // Update was successful
      toast.success("Profile updated successfully")

      // If we updated the image, update the cache buster
      if (profileImage) {
        const newImageUrl = `/api/user/profile-image?${new Date().getTime()}`
        setOriginalImageUrl(newImageUrl)
        setPreviewUrl(newImageUrl)
        setProfileImage(null)
      }

      // Refresh user data
      const userData = await res.json()
      setUser(userData)
      setHasChanges(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back</span>
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex flex-col items-center sm:items-start sm:flex-row sm:space-x-6">
                  <div className="mb-4 sm:mb-0">
                    <div onClick={() => fileInputRef.current.click()} className="relative cursor-pointer group">
                      <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
                        <UserProfile 
                            userId={user?.id}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-300 rounded-full">
                          <Camera className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
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

                    <div className="mt-2 text-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                      >
                        Change picture
                      </button>
                    </div>

                    {errors.image && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400 text-center">{errors.image}</p>
                    )}
                  </div>

                  <div className="flex-1 w-full">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                          Your name
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`block w-full px-3 py-2 border ${
                            errors.name ? "border-red-300 dark:border-red-700" : "border-gray-300 dark:border-gray-600"
                          } rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 dark:text-white`}
                          placeholder="Your name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving || !hasChanges}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors ${
                      isSaving || !hasChanges ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
