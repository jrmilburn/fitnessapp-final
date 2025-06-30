"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { ChevronDown, ChevronRight, LogOut, User, Settings, Menu, X } from 'lucide-react'
import NAVIGATION from "./Navigation"
import UserProfile from "./UserProfile"
import InstallPWAButton from "../InstallPWAButton"

const Sidebar = ({ children }) => {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [openMenus, setOpenMenus] = useState({})
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState({})
  const userMenuRef = useRef(null)
  const sidebarRef = useRef(null)

  // Determine which navigation to use based on user role
  const navigation =  NAVIGATION;

  useEffect(() => {
    fetch(`/api/user/${session.user.id}`)
    .then(resp => resp.json())
    .then(data => setUser(data))
  }, [])

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMobileSidebarOpen(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileSidebarOpen(false)
  }, [pathname])

  // Toggle submenu open/closed state
  const toggleSubmenu = (segment) => {
    setOpenMenus((prev) => ({
      ...prev,
      [segment]: !prev[segment],
    }))
  }

  // Check if a route is active
  const isActive = (segment) => {
    if (!segment) return false
    return pathname === `/${segment}` || pathname.startsWith(`/${segment}/`)
  }

  // Check if a parent route has an active child
  const hasActiveChild = (item) => {
    if (!item.children) return false
    return item.children.some((child) => isActive(child.segment) || (child.children && hasActiveChild(child)))
  }

  // Render navigation items recursively
  const renderNavItems = (items, level = 0) => {
    return items?.map((item, index) => {
      if (item.kind === "divider") {
        return <div key={`divider-${index}`} className="my-2 border-t border-slate-200 dark:border-slate-700" />
      }

      if (item.kind === "header") {
        return (
          <div
            key={`header-${index}`}
            className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            {item.title}
          </div>
        )
      }

      const isItemActive = isActive(item.segment)
      const hasActiveChildren = hasActiveChild(item)
      const isOpen = openMenus[item.segment]
      const isActiveOrOpen = isItemActive || hasActiveChildren || isOpen

      if (item.children) {
        return (
          <div key={item.segment} className={`${level > 0 ? "ml-4" : ""}`}>
            <button
              onClick={() => toggleSubmenu(item.segment)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                isActiveOrOpen 
                  ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2">{item.title}</span>
              </div>
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>

            {isOpen && <div className="mt-1 space-y-1">{renderNavItems(item.children, level + 1)}</div>}
          </div>
        )
      }

      return (
        <Link
          key={item.segment}
          href={`/${item.segment}`}
          className={`flex items-center rounded-md px-3 py-2 text-sm ${
            isItemActive 
              ? "bg-blue-50 text-blue-600 font-medium dark:bg-blue-900/20 dark:text-blue-400" 
              : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          } ${level > 0 ? "ml-4" : ""}`}
        >
          {item.icon}
          <span className="ml-2">{item.title}</span>
        </Link>
      )
    })
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar for desktop */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-slate-800 lg:relative lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-center border-b border-slate-200 px-4 dark:border-slate-700">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-500">Fitness.jm</span>
          </Link>
        </div>

        {/* Sidebar content */}
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-4">
          {status === "loading" ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded bg-slate-200 dark:bg-slate-700"></div>
              ))}
            </div>
          ) : status === "unauthenticated" ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-4">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Please sign in to access the application
              </p>
              <button
                onClick={() => signIn()}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-1">{renderNavItems(navigation)}</div>
          )}
        </div>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 w-full border-t border-slate-200 p-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400 flex flex-col">
          <InstallPWAButton />
          © Joe Milburn {new Date().getFullYear()}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-800">
          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          >
            {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Toggle menu</span>
          </button>

          {/* Page title */}
          <div className="text-lg font-medium text-slate-700 dark:text-slate-200">
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            {status === "authenticated" ? (
              <>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center rounded-full text-sm focus:outline-none"
                >
                  <div className="flex h-10 w-10 rounded-full items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 overflow-hidden">
                    <UserProfile
                      userId={session.user.id}
                    />
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800 dark:ring-slate-700 z-[10000]">
                    <div className="border-b border-slate-200 px-4 py-2 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{session.user.email}</p>
                      <p className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                        {session.user.role}
                      </p>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Your Profile
                      </div>
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700">
                      <div className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </div>
                    </Link>
                    <button 
                      onClick={() => signOut()} 
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100 dark:text-red-400 dark:hover:bg-slate-700"
                    >
                      <div className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </div>
                    </button>
                  </div>
                )}
              </>
            ) : status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
            ) : (
              <button
                onClick={() => signIn()}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Sign In
              </button>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto max-h-[calc(100vh-64px)] pb-2">{children}</main>
      </div>
    </div>
  )
}

export default Sidebar
