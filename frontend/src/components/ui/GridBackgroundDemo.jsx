import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CodeSnippet from "./CodeSnippet";
import { cn } from "./utils";
import { Link } from "react-router";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

const pulse = {
  animate: {
    scale: [1, 1.1, 1],
    transition: { repeat: Infinity, duration: 2, ease: "easeInOut" },
  },
};

const floatUpDown = {
  animate: {
    y: [0, -8, 0],
    transition: { repeat: Infinity, duration: 3, ease: "easeInOut" },
  },
};

const bounce = {
  whileHover: {
    scale: [1, 1.1, 1.05, 1.1, 1],
    transition: { duration: 0.6, ease: "easeInOut" },
  },
};

// -------------------------
// Grid Background Hero Section
// -------------------------
export function GridBackgroundDemo() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-white dark:bg-black overflow-hidden px-4 pb-6 pt-10">
      <motion.div
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div className="relative z-10 md:-top-15 flex flex-col lg:flex-row items-start justify-between w-full max-w-7xl px-1 gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={1}
          className="flex flex-col items-start text-left max-w-lg space-y-6 "
        >
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-[57px] font-bold text-white leading-tight whitespace-normal">
              Master Coding Challenges <br />
              with <span className="text-blue-600">AI-Powered</span> Learning
            </h2>
          </div>
          <div>
            <p className="text-gray-400 max-w-md">
              Practice with over 2,500 coding challenges, get instant feedback,
              and improve your skills with personalized learning paths. Perfect
              for interviews, competitions, and skill development.
            </p>
            <div className="mt-6 flex gap-4">
              <Link to="/learn">
              <motion.button
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                whileHover={bounce.whileHover}
              >
                Get Free Resources
              </motion.button>
              </Link>
              <button className="px-6 py-3 bg-gray-800 text-gray-300 font-semibold rounded-lg hover:bg-gray-700 transition">
               <Link to="/practice-problems">
                  Explore Problems
               </Link> 
              </button>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          custom={2}
          className="w-full max-w-xl"
        >
          <CodeSnippet />
        </motion.div>
      </div>
    </div>
  );
}

// -------------------------
// Features Section
// -------------------------
export function FeaturesSection() {
  const features = [
    {
      title: "Practice Problems",
      description:
        "Access 2,500+ coding challenges across 30+ categories with detailed solutions and explanations.",
      action: "Start Practicing",
    },
    {
      title: "Mock Interviews",
      description: "Learn From Resources",
      action: "Try Mock Interview",
    },
    {
      title: "Contests & Challenges",
      description:
        "Participate in weekly coding contests and compete with developers from around the world.",
      action: "Join Contest",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your improvement with detailed analytics and personalized learning paths.",
      action: "View Analytics",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-black pt-6 pb-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl md:text-[40px] font-bold text-gray-900 dark:text-white mb-4">
          Unlock Your Developer Potential
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Everything you need to become a better programmer and ace your next
          technical interview.
        </p>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={index + 1}
              animate={floatUpDown.animate}
              className="bg-gray-100 dark:bg-[#111] rounded-xl p-6 text-left shadow-sm hover:shadow-lg transition"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59,130,246,0.5)" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {feature.description}
              </p>
              <a
                href="#"
                className="text-blue-600 dark:text-blue-500 text-sm font-medium hover:underline"
              >
                {feature.action} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------
// How It Works Section
// -------------------------
export function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Create Account",
      description: "Sign up and set up your profile with your coding preferences",
      color: "bg-blue-600",
    },
    {
      number: 2,
      title: "Access Resource",
      description: "Learn from best resource and given DSA Sheets for interview",
      color: "bg-purple-700",
    },
    {
      number: 3,
      title: "Practice Daily",
      description: "Solve problems tailored to your skill level and interests",
      color: "bg-purple-700",
    },
    {
      number: 4,
      title: "Join Contests",
      description: "Test your skills in competitive programming challenges",
      color: "bg-pink-600",
    },
  ];

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  return (
    <div className="w-full bg-black dark:bg-black py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto text-center text-white">
        <h2 className="text-4xl md:text-4xl font-bold mb-2">How It Works</h2>
        <p className="text-sm text-gray-400 mb-12">
          Start your coding journey in four simple steps
        </p>

        <div className="relative flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto">
          <motion.div
            className="absolute top-7 left-0 right-0 h-[2px] bg-gray-700 origin-left"
            initial="hidden"
            animate="visible"
            variants={lineVariants}
          />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={index + 1}
              className="flex flex-col items-center text-center max-w-xs px-4 relative z-10"
              whileHover={{ scale: 1.1, boxShadow: "0 0 8px rgba(255,255,255,0.4)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white font-bold mb-2 ${step.color}`}
                animate={pulse.animate}
              >
                {step.number}
              </motion.div>
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-gray-400 max-w-[150px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------
// Popular Coding Problems Section (NEW)
// -------------------------
export function PopularCodingProblems() {
  const problems = [
    {
      title: "Two Sum",
      level: "Easy",
      description:
        "Return indices of the two numbers such that they add up to a specific target.",
      rate: "78%",
      color: "text-green-400",
    },
    {
      title: "Longest Substring Without Repeating Characters",
      level: "Medium",
      description:
        "Find the length of the longest substring without repeating characters.",
      rate: "52%",
      color: "text-yellow-400",
    },
    {
      title: "Median of Two Sorted Arrays",
      level: "Hard",
      description:
        "Find the median of two sorted arrays in O(log(min(m,n))).",
      rate: "34%",
      color: "text-red-400",
    },
    {
      title: "Valid Parentheses",
      level: "Easy",
      description:
        "Determine if a string has valid parentheses ordering.",
      rate: "82%",
      color: "text-green-400",
    },
    {
      title: "LRU Cache",
      level: "Medium",
      description: "Design a Least Recently Used (LRU) cache.",
      rate: "45%",
      color: "text-yellow-400",
    },
    {
      title: "Merge K Sorted Lists",
      level: "Hard",
      description: "Merge k sorted linked lists into one sorted list.",
      rate: "38%",
      color: "text-red-400",
    },
  ];

  return (
    <div className="w-full bg-black text-white py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl md:text-4xl font-bold mb-2">
          Popular Coding Problems
        </h2>
        <p className="text-gray-400">
          Challenge yourself with these frequently asked interview questions
        </p>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 justify-self-center">
          {problems.map((p, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={i + 1}
            className="bg-[#111] w-full max-w-[360px] rounded-xl p-6 shadow hover:shadow-lg transition border border-gray-800"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <span className={`text-xs font-bold ${p.color}`}>
                {p.level}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">{p.description}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>✅ {p.rate} Success Rate</span>
              <a href="#" className="text-blue-500 hover:underline">
                Try Problem
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// -------------------------
// Learning Paths Section
// -------------------------
export function LearningPathsSection() {
  const paths = [
    {
      title: "Frontend Development",
      duration: "12 weeks",
      level: "Beginner to Intermediate",
      topics: ["HTML/CSS", "JavaScript", "React", "Web APIs"],
      color: "from-blue-500 to-cyan-500",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    {
      title: "Backend Development",
      duration: "14 weeks",
      level: "Intermediate",
      topics: ["Node.js", "Databases", "APIs", "System Design"],
      color: "from-green-500 to-emerald-500",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      )
    },
    {
      title: "Data Structures & Algorithms",
      duration: "16 weeks",
      level: "All Levels",
      topics: ["Arrays & Strings", "Trees & Graphs", "Dynamic Programming", "Advanced Algorithms"],
      color: "from-purple-500 to-indigo-500",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      )
    },
    {
      title: "System Design",
      duration: "10 weeks",
      level: "Advanced",
      topics: ["Scalability", "Microservices", "Database Design", "Cloud Architecture"],
      color: "from-pink-500 to-rose-500",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-black py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Follow structured learning paths designed by industry experts to achieve your career goals
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {paths.map((path, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={index + 1}
              className="relative group"
            >
              <div className="relative z-10 bg-[#111] border border-gray-800 rounded-xl p-8 hover:bg-[#1a1a1a] transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r ${path.color} mb-4`}>
                      {path.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {path.title}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-400">{path.duration}</span>
                    <p className="text-sm font-medium text-blue-500">{path.level}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {path.topics.map((topic, i) => (
                    <div key={i} className="flex items-center text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={bounce.whileHover}
                  className={`w-full py-3 bg-gradient-to-r ${path.color} text-white rounded-lg font-medium transition-all duration-300 hover:opacity-90`}
                >
                  Start This Path
                </motion.button>
              </div>

              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-6">
            Not sure which path to choose? Take our assessment to get personalized recommendations.
          </p>
          <motion.button
            whileHover={bounce.whileHover}
            className="px-8 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            Take Skill Assessment
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

// -------------------------
// -------------------------
// FAQ Section
// -------------------------
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      question: "What programming languages are supported?",
      answer: "We support all major programming languages including Python, Java, C++, JavaScript, Ruby, and more. Our platform is constantly updating to include new language support."
    },
    {
      question: "How does the AI-powered learning work?",
      answer: "Our AI system analyzes your coding patterns, strengths, and areas for improvement to create personalized learning paths. It provides targeted feedback on your solutions and suggests problems that will help you grow."
    },
    {
      question: "Can I prepare for technical interviews?",
      answer: "Absolutely! We offer mock interviews, company-specific problem sets, and a vast collection of interview questions from top tech companies. You'll also get detailed explanations and optimal solutions."
    },
    {
      question: "Are there any collaborative features?",
      answer: "Yes! You can join study groups, participate in pair programming sessions, and engage in discussion forums. Our community features help you learn from peers and share knowledge."
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-black py-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={index + 1}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                <span className="font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-blue-600"
                >
                  ▼
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-gray-50 dark:bg-gray-900"
                  >
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------
// Testimonials Section
// -------------------------
export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      image: "https://api.dicebear.com/6.x/personas/svg?seed=1",
      content: "This platform helped me crack my dream job! The structured learning path and real interview problems made all the difference.",
      company: "google.svg"
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer",
      image: "https://api.dicebear.com/6.x/personas/svg?seed=2",
      content: "The AI-powered feedback is like having a personal coding mentor. It's incredibly helpful in identifying areas for improvement.",
      company: "meta.svg"
    },
    {
      name: "Priya Patel",
      role: "Tech Lead",
      image: "https://api.dicebear.com/6.x/personas/svg?seed=3",
      content: "The community here is amazing! I've learned so much from participating in contests and discussing solutions with others.",
      company: "microsoft.svg"
    }
  ];

  return (
    <div className="w-full bg-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          What Our Users Say
        </h2>
        <p className="text-gray-400">
          Join thousands of developers who have improved their coding skills with us
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={index + 1}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="relative group"
          >
            <div className="relative z-10 h-full bg-[#111] border border-gray-800 rounded-xl p-6 hover:bg-[#1a1a1a] transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-600/10 flex items-center justify-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-10 h-10"
                  />
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-semibold text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-blue-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <div className="relative">
                <svg className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4 text-blue-600/20 w-8 h-8" 
                     fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
                <p className="text-gray-400 text-left mb-4 pl-2">
                  {testimonial.content}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// -------------------------
// Learn from Resources Section
// -------------------------
export function LearnFromResources() {
  const resources = [
    {
      title: "Data Structures & Algorithms",
      description: "Master fundamental DSA concepts with our comprehensive guides, practice problems, and visual explanations.",
      icon: (
        <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 6V4M12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12M12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12M12 12V14M12 14C10.3431 14 9 15.3431 9 17C9 18.6569 10.3431 20 12 20M12 14C13.6569 14 15 15.3431 15 17C15 18.6569 13.6569 20 12 20M12 20V22M21 12H19M19 12C17.3431 12 16 10.6569 16 9C16 7.34315 17.3431 6 19 6M19 12C17.3431 12 16 13.3431 16 15C16 16.6569 17.3431 18 19 18M5 12H3M5 12C3.34315 12 2 10.6569 2 9C2 7.34315 3.34315 6 5 6M5 12C3.34315 12 2 13.3431 2 15C2 16.6569 3.34315 18 5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      features: [
        "Array & String Manipulation",
        "Tree & Graph Algorithms",
        "Dynamic Programming",
        "Sorting & Searching"
      ]
    },
    {
      title: "System Design",
      description: "Learn to design scalable systems through real-world case studies and architectural patterns.",
      icon: (
        <svg className="w-12 h-12 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 6H20M9 12H20M9 18H20M5 6V6.01M5 12V12.01M5 18V18.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      features: [
        "Distributed Systems",
        "Database Design",
        "Load Balancing",
        "Caching Strategies"
      ]
    },
    {
      title: "Interview Preparation",
      description: "Get ready for technical interviews with our curated content and mock interview scenarios.",
      icon: (
        <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      features: [
        "Company-specific Questions",
        "Mock Interviews",
        "Time Complexity Analysis",
        "Problem-solving Patterns"
      ]
    },
    {
      title: "Advanced Topics",
      description: "Dive deep into advanced programming concepts and specialized areas of computer science.",
      icon: (
        <svg className="w-12 h-12 text-rose-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14H11V21L20 10H13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      features: [
        "Machine Learning Basics",
        "System Architecture",
        "Design Patterns",
        "Cloud Computing"
      ]
    }
  ];

  return (
    <div className="w-full bg-black py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Learn from Resources
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Access our comprehensive collection of learning resources designed to help you master different aspects of programming
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {resources.map((resource, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              custom={index + 1}
              className="relative group"
            >
              <div className="relative z-10 h-full bg-[#111] border border-gray-800 rounded-xl p-6 hover:bg-[#1a1a1a] transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="mb-6">{resource.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {resource.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {resource.description}
                  </p>
                  <ul className="space-y-2">
                    {resource.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button
                  whileHover={bounce.whileHover}
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200 mt-6"
                >
                  Start Learning
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------
// Statistics Section
// -------------------------
export function StatisticsSection() {
  const stats = [
    {
      number: "50K+",
      label: "Active Users",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      number: "2.5M+",
      label: "Problems Solved",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      number: "100+",
      label: "Companies Hiring",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full bg-[#111] py-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={index + 1}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-blue-600/10 text-blue-500">
              {stat.icon}
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stat.number}</h3>
            <p className="text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// -------------------------
// Newsletter Section
// -------------------------
export function NewsletterSection() {
  return (
    <div className="w-full bg-[#111] py-20 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Stay Updated with Latest Resources
          </h2>
          <p className="text-gray-400 mb-8">
            Get weekly updates on new coding challenges, tutorials, and programming tips directly in your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-black border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <motion.button
              whileHover={bounce.whileHover}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </motion.button>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            No spam ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
}



// Page Component
// -------------------------
export default function HomePage() {
  return (
    <>
      <GridBackgroundDemo />
      <FeaturesSection />
      <HowItWorks />
      <StatisticsSection />
      <PopularCodingProblems />
      <LearnFromResources />
      <TestimonialsSection />
      <NewsletterSection />
      <FAQSection />
    </>
  );
}
