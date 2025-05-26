import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplet, ArrowRight, Check, Star, Shield, Calendar, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

function LandingPage() {
  const navigate = useNavigate();
  
  const features = [
    {
      title: 'Track Your Routines',
      description: 'Log your morning and evening skincare routines and track your progress over time.',
      icon: <Droplet className="h-6 w-6 text-lavender-500" />
    },
    {
      title: 'Manage Products',
      description: 'Keep track of your skincare products, their expiration dates, and usage history.',
      icon: <Sparkles className="h-6 w-6 text-lavender-500" />
    },
    {
      title: 'Schedule Tasks',
      description: 'Set reminders for special treatments and never miss a skincare appointment.',
      icon: <Calendar className="h-6 w-6 text-lavender-500" />
    },
    {
      title: 'Research Ingredients',
      description: 'Learn about product ingredients and get safety information.',
      icon: <Shield className="h-6 w-6 text-lavender-500" />
    }
  ];

  // Demo user data
  const demoUser = {
    name: 'Sarah',
    skinType: 'Combination',
    routines: ['Morning Routine', 'Evening Routine', 'Weekly Exfoliation'],
    products: 12,
    tasks: 4
  };

  const handleDemoView = () => {
    // Store demo state in localStorage to indicate we're in demo mode
    localStorage.setItem('demoMode', 'true');
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-transparent absolute w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Droplet className="h-8 w-8 text-lavender-500" />
                <span className="ml-2 text-2xl font-display font-bold text-lavender-700">Porefect</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-lavender-600 px-3 py-2 rounded-md text-sm font-medium">
                  Sign In
                </Link>
                <Link to="/register">
                  <Button variant="primary">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 bg-gradient-to-br from-lavender-50 via-white to-mint-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left animate-slide-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-800 leading-tight">
                Your <span className="text-lavender-500">Skincare Journey</span>, Perfectly Tracked
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
                Log routines, track products, schedule tasks, and discover what works best for your skin—all in one place.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleDemoView}
                >
                  View Demo
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative animate-fade-in">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-64 h-64 bg-lavender-200 rounded-full opacity-30 filter blur-3xl animate-pulse-subtle"></div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-rose-200 rounded-full opacity-30 filter blur-3xl animate-pulse-subtle delay-700"></div>
                <div className="rounded-2xl shadow-lg bg-white p-6 z-10 relative">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-lavender-100 flex items-center justify-center">
                      <Droplet className="h-6 w-6 text-lavender-500" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">Evening Routine</h3>
                      <p className="text-sm text-gray-500">3 steps • Last completed today</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-mint-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Gentle Cleanser</p>
                        <p className="text-xs text-gray-500">CeraVe Hydrating Cleanser</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-mint-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Hydrating Toner</p>
                        <p className="text-xs text-gray-500">Laneige Cream Skin Toner</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Check className="h-5 w-5 text-mint-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">Moisturizer</p>
                        <p className="text-xs text-gray-500">Neutrogena Hydro Boost</p>
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
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-800">All Your Skincare Needs in One App</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Porefect helps you maintain a consistent skincare routine and track your progress over time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="h-12 w-12 rounded-full bg-lavender-100 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-lavender-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold text-center text-gray-800 mb-12">
            People Love Their Porefect Routines
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "Porefect has completely transformed my skincare routine. I finally understand what works for my skin and why."
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-lavender-200 flex items-center justify-center">
                    <span className="text-lavender-700 font-medium">
                      {['AJ', 'TK', 'MR'][i-1]}
                    </span>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-gray-800">
                      {['Alex Johnson', 'Taylor Kim', 'Morgan Reed'][i-1]}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {['Combination Skin', 'Sensitive Skin', 'Acne-Prone Skin'][i-1]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-lavender-500 to-lavender-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-display font-bold">Ready to transform your skincare routine?</h2>
              <p className="mt-4 text-lavender-100">
                Join Porefect today and take control of your skincare journey.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button 
                  variant="secondary" 
                  size="lg"
                >
                  Get Started
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-lavender-400 focus:ring-white"
                onClick={handleDemoView}
              >
                Try Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center">
                <Droplet className="h-6 w-6 text-lavender-300" />
                <span className="ml-2 text-xl font-display font-bold text-white">Porefect</span>
              </div>
              <p className="mt-4 text-sm">
                Your personal skincare companion for tracking routines, products, and progress.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Features</h3>
              <ul className="mt-4 space-y-2">
                {features.map(feature => (
                  <li key={feature.title}>
                    <a href="#" className="text-sm text-gray-300 hover:text-white">
                      {feature.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-center">
            <p>© {new Date().getFullYear()} Porefect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;