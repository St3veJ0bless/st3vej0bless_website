"use client"

import Link from "next/link"
import { ArrowUpRight, Circle, Square, Triangle, Sun, Moon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import CountUp from "react-countup"
import TextEncrypted from "./decrypted-text"
import { useTheme } from "next-themes"

export default function PortfolioClient({ settings }) {
  const [hoveredProject, setHoveredProject] = useState(null)
  const [activeSection, setActiveSection] = useState("header")
  const [skillAnimations, setSkillAnimations] = useState({})
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const sectionRefs = {
    header: useRef(null),
    skills: useRef(null),
    projects: useRef(null),
    contact: useRef(null),
  }

  const sections = [
    { id: "header", label: settings.sections.about.navigationLabel, ref: sectionRefs.header },
    { id: "skills", label: settings.sections.expertise.navigationLabel, ref: sectionRefs.skills },
    { id: "projects", label: settings.sections.projects.navigationLabel, ref: sectionRefs.projects },
    { id: "contact", label: settings.sections.contact.navigationLabel, ref: sectionRefs.contact },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const animateSkills = () => {
      const animations = {}
      settings.expertise.forEach((skill, index) => {
        setTimeout(() => {
          setSkillAnimations(prev => ({
            ...prev,
            [skill.name]: skill.level
          }))
        }, index * 100)
      })
    }

    const timer = setTimeout(animateSkills, 500)
    return () => clearTimeout(timer)
  }, [settings.expertise])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const isDarkMode = resolvedTheme === "dark"

  const themeColors = {
    bg: isDarkMode ? "#0a0a0a" : "#ffffff",
    text: isDarkMode ? "#f0f0f0" : "#1a1a1a",
    textSecondary: isDarkMode ? "#a0a0a0" : "#666666",
    textMuted: isDarkMode ? "#888888" : "#999999",
    border: isDarkMode ? "#222222" : "#e5e5e5",
    cardBg: isDarkMode ? "#111111" : "#f8f8f8",
    cardBorder: isDarkMode ? "#333333" : "#e0e0e0",
    skillBg: isDarkMode ? "#1a1a1a" : "#f0f0f0",
    primary: settings.theme.primaryColor,
  }

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "-10% 0px -60% 0px",
    }

    const observers = sections.map(({ id, ref }) => {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id)
        }
      }, observerOptions)

      if (ref.current) {
        observer.observe(ref.current)
      }

      return { observer, id }
    })

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        const element = section.ref.current
        if (element) {
          const { offsetTop } = element
          if (scrollPosition >= offsetTop) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    handleScroll()

    return () => {
      observers.forEach(({ observer }) => observer.disconnect())
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const section = sectionRefs[sectionId]
    if (section.current) {
      section.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div
      className="min-h-screen font-mono overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: themeColors.bg, color: themeColors.text }}
    >
      <div className="fixed top-1/2 -translate-y-1/2 z-50 hidden md:block left-1/2 translate-x-[calc(2rem+2rem+896px/2)] xl:translate-x-[calc(1024px/2)]">
        <div
          className="rounded-full p-3 backdrop-blur-sm transition-colors duration-300"
          style={{ backgroundColor: themeColors.cardBg, borderColor: themeColors.cardBorder, border: "1px solid" }}
        >
          <div className="space-y-3">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="group relative flex items-center"
                aria-label={`Go to ${section.label} section`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === section.id ? "scale-150" : "hover:opacity-80"
                    }`}
                  style={{
                    backgroundColor: activeSection === section.id ? themeColors.primary : themeColors.textMuted,
                  }}
                />
                <div
                  className={`absolute left-6 whitespace-nowrap text-xs font-medium px-3 py-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${activeSection === section.id
                    ? "opacity-100 translate-x-0 scale-100"
                    : "opacity-0 -translate-x-2 scale-95 group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100"
                    }`}
                  style={{
                    backgroundColor: activeSection === section.id ? themeColors.primary : themeColors.cardBg,
                    borderColor: activeSection === section.id ? themeColors.primary : themeColors.cardBorder,
                    border: "1px solid",
                    color: activeSection === section.id ? "#ffffff" : themeColors.text,
                    boxShadow:
                      activeSection === section.id
                        ? `0 4px 12px ${themeColors.primary}20`
                        : `0 2px 8px ${themeColors.cardBorder}40`,
                  }}
                >
                  {section.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div
          className="rounded-full px-4 py-3 backdrop-blur-sm transition-colors duration-300"
          style={{ backgroundColor: themeColors.cardBg, borderColor: themeColors.cardBorder, border: "1px solid" }}
        >
          <div className="flex space-x-4">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="group relative flex flex-col items-center"
                aria-label={`Go to ${section.label} section`}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSection === section.id ? "scale-150" : ""
                    }`}
                  style={{
                    backgroundColor: activeSection === section.id ? themeColors.primary : themeColors.textMuted,
                  }}
                />
                <div
                  className={`absolute -top-8 whitespace-nowrap text-xs font-medium px-2 py-1 rounded transition-all duration-200 ${activeSection === section.id ? "opacity-100" : "opacity-0"
                    }`}
                  style={{
                    backgroundColor: themeColors.cardBg,
                    borderColor: themeColors.cardBorder,
                    border: "1px solid",
                    color: themeColors.text,
                  }}
                >
                  {section.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-12 w-full overflow-x-hidden">
        <div ref={sectionRefs.header} className="grid grid-cols-12 gap-4 sm:gap-6 md:gap-8 mb-16">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: themeColors.primary }}></div>
              <span className="text-sm" style={{ color: themeColors.textMuted }}>
                {settings.personal.status}
              </span>
            </div>

            <h1 className="min-h-[6.2rem] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 tracking-tight break-words">
              <TextEncrypted
                text={settings.personal.name}
              />
              <br />
              <TextEncrypted
                style={{ color: themeColors.textMuted }}
                text={settings.personal.lastName}
              />
            </h1>

            <div className="space-y-4 leading-relaxed break-words" style={{ color: themeColors.textSecondary }}>
              <p className="">
                {settings.personal.title}
              </p>
              <p className="">
                {settings.personal.currentWork.split(" at ")[0]} at{" "}
                <Link
                  href={settings.personal.currentWorkUrl}
                  className="transition-colors underline decoration-2 underline-offset-4 hover:scale-105 "
                  style={{
                    color: themeColors.text,
                    textDecorationColor: themeColors.border,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = themeColors.primary
                    e.currentTarget.style.textDecorationColor = themeColors.primary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = themeColors.text
                    e.currentTarget.style.textDecorationColor = themeColors.border
                  }}
                >
                  {settings.personal.currentWork.split(" at ")[1]}
                </Link>
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 flex flex-col items-start md:items-end">
            <div className="text-left md:text-right space-y-2 text-sm mt-6 md:mt-0" style={{ color: themeColors.textMuted }}>
              <div>
                {settings.personal.location} - {settings.personal.timezone}
              </div>
              <div className="flex items-center justify-end gap-2 ">
                <Circle
                  size={8}
                  style={{ fill: themeColors.text, color: themeColors.text }}
                  className={settings.personal.isOnline ? "animate-pulse" : ""}
                />
                {settings.personal.isOnline ? "Online" : "Offline"}
              </div>
            </div>
          </div>
        </div>

        <div ref={sectionRefs.skills} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Square size={16} style={{ color: themeColors.textMuted }} />
            <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>
              {settings.sections.expertise.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {settings.expertise.map((skill, index) => (
              <div key={skill.name} className="group">
                <div className="flex justify-between items-center mb-2">
                  <span
                    className="font-medium "
                    style={{ color: themeColors.text }}
                  >
                    {skill.name}
                  </span>
                  <span
                    className="text-sm "
                    style={{ color: themeColors.textMuted }}
                  >
                    <CountUp
                      end={skill.level}
                      duration={1}
                      delay={0.5 + (index * 0.1)}
                      useEasing={true}
                    />
                    %
                  </span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: themeColors.skillBg }}>
                  <div
                    className="h-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${skillAnimations[skill.name] || 0}%`,
                      backgroundColor: themeColors.text
                    }}
                  />
                </div>
                <div
                  className="text-xs mt-1 capitalize "
                  style={{ color: themeColors.textMuted }}
                >
                  {skill.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={sectionRefs.projects} className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Triangle size={16} style={{ color: themeColors.textMuted }} />
            <h2 className="text-xl font-semibold" style={{ color: themeColors.text }}>
              {settings.sections.projects.title}
            </h2>
          </div>

          <div className="space-y-1">
            {settings.projects.map((project, index) => (
              <div
                key={project.name}
                className="group border-l-2 border-transparent transition-all duration-300 pl-6 py-4 min-w-0 overflow-hidden"
                style={{
                  borderLeftColor: hoveredProject === project.name ? themeColors.primary : "transparent",
                }}
                onMouseEnter={() => setHoveredProject(project.name)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 min-w-0">
                    <div
                      className="text-sm font-mono w-6 sm:w-8 md:w-12 flex-shrink-0"
                      style={{ color: themeColors.textMuted }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold transition-colors flex items-center gap-2 "
                        style={{ color: hoveredProject === project.name ? themeColors.primary : themeColors.text }}
                      >
                        {project.name}
                        <ArrowUpRight
                          size={16}
                          className={`transition-opacity ${hoveredProject === project.name ? "opacity-100" : "opacity-0"}`}
                        />
                      </Link>
                      <div
                        className="text-sm "
                        style={{ color: themeColors.textMuted }}
                      >
                        {project.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className="text-sm "
                      style={{ color: themeColors.textMuted }}
                    >
                      {project.year}
                    </span>
                    <div
                      className="px-2 py-1 rounded-full text-xs sm:text-sm font-medium "
                      style={{
                        backgroundColor: themeColors.skillBg,
                        color: themeColors.textMuted,
                        borderColor: themeColors.cardBorder,
                        border: "1px solid",
                      }}
                    >
                      {project.status}
                    </div>
                  </div>
                </div>


                <div
                  className="mt-3 text-sm transition-opacity duration-200 "
                  style={{ color: themeColors.textSecondary }}
                >
                  <div
                    className={` ${hoveredProject === project.name ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    {project.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={sectionRefs.contact}
          className="pt-12 transition-colors duration-300"
          style={{ borderTop: `1px solid ${themeColors.border}` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: themeColors.text }}>
                <Circle size={12} style={{ color: themeColors.textMuted }} />
                {settings.contact.title}
              </h3>
              <p
                className="mb-6 leading-relaxed break-words "
                style={{ color: themeColors.textSecondary }}
              >
                {settings.contact.description}
              </p>
              <Link
                href={`mailto:${settings.contact.email}`}
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 "
                style={{ backgroundColor: themeColors.primary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "#3a75e0" : "#2563eb"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.primary
                }}
              >
                {settings.contact.buttonText}
                <ArrowUpRight size={16} />
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>
                {settings.contact.socialTitle}
              </h3>
              <div className="space-y-3">
                {settings.contact.socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.url}
                    className="flex items-center justify-between p-3 rounded-lg transition-all group"
                    style={{
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.cardBorder,
                      border: "1px solid",
                    }}
                  >
                    <div>
                      <div
                        className="font-medium "
                        style={{ color: themeColors.text }}
                      >
                        {link.name}
                      </div>
                      <div
                        className="text-sm "
                        style={{ color: themeColors.textMuted }}
                      >
                        {link.handle}
                      </div>
                    </div>
                    <ArrowUpRight size={16} className="transition-colors" style={{ color: themeColors.textMuted }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 transition-colors duration-300" style={{ borderTop: `1px solid ${themeColors.border}` }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p
              className="text-sm  text-center sm:text-left"
              style={{ color: themeColors.textMuted }}
            >
              {settings.footer.text}
            </p>

            {settings.footer.showThemeToggle && (
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.cardBorder,
                  border: "1px solid",
                  color: themeColors.text,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = isDarkMode ? "#1a1a1a" : "#f0f0f0"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColors.cardBg
                }}
                aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
              >
                {isDarkMode ? (
                  <>
                    <Sun size={16} />
                    {settings.footer.themeToggleText.light}
                  </>
                ) : (
                  <>
                    <Moon size={16} />
                    {settings.footer.themeToggleText.dark}
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
