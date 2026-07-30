import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Heart, TrendingUp, Users, Shield, Zap, Star } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track your fitness goals with precision and motivation."
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Monitor your vital health metrics and maintain optimal wellness."
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Visualize your progress with detailed charts and insights."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with like-minded individuals on their fitness journey."
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "Your health data is protected with enterprise-grade security."
    },
    {
      icon: Zap,
      title: "AI Recommendations",
      description: "Get personalized recommendations powered by artificial intelligence."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "FitTracker has completely transformed my fitness routine. The insights are incredible!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer",
      content: "I recommend FitTracker to all my clients. It's the best fitness tracking app I've used.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Wellness Coach",
      content: "The AI recommendations are spot-on and have helped me achieve my health goals faster.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-in-right">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 animate-fade-in">
            <Activity className="h-8 w-8 text-primary animate-pulse" />
            <span className="text-2xl font-bold">FitTracker</span>
          </div>
          <div className="flex items-center gap-4 animate-fade-in">
            <Button asChild variant="ghost" className="hover-scale">
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild className="hover-scale">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 animate-fade-in">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4 animate-scale-in">
            🚀 New AI Features Available
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-fade-in [animation-delay:200ms]">
            Transform Your Health Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:400ms]">
            Track your fitness, monitor your health, and achieve your goals with our comprehensive 
            health and fitness management platform powered by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:600ms]">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 hover-scale transition-all duration-300 hover:shadow-lg">
              <Link to="/signup">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="hover-scale transition-all duration-300 hover:shadow-lg">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Optimal Health
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to track, 
              analyze, and improve your health and fitness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
                  <CardTitle className="group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in hover-scale transition-all duration-300 cursor-pointer" style={{ animationDelay: '100ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">10k+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="animate-fade-in hover-scale transition-all duration-300 cursor-pointer" style={{ animationDelay: '200ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">1M+</div>
              <div className="text-muted-foreground">Workouts Tracked</div>
            </div>
            <div className="animate-fade-in hover-scale transition-all duration-300 cursor-pointer" style={{ animationDelay: '300ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">95%</div>
              <div className="text-muted-foreground">User Satisfaction</div>
            </div>
            <div className="animate-fade-in hover-scale transition-all duration-300 cursor-pointer" style={{ animationDelay: '400ms' }}>
              <div className="text-4xl font-bold text-primary mb-2 animate-pulse">24/7</div>
              <div className="text-muted-foreground">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied users who have transformed their health
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover-scale animate-fade-in group"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star 
                        key={i} 
                        className="h-5 w-5 fill-yellow-400 text-yellow-400 transition-transform duration-300 group-hover:scale-110" 
                        style={{ animationDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic group-hover:text-foreground transition-colors duration-300">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold group-hover:text-primary transition-colors duration-300">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground animate-scale-in hover-scale transition-all duration-500">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
                Ready to Transform Your Health?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in [animation-delay:200ms]">
                Join thousands of users who have already started their journey to better health. 
                Start your free trial today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in [animation-delay:400ms]">
                <Button asChild size="lg" variant="secondary" className="hover-scale transition-all duration-300 hover:shadow-lg">
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary hover-scale transition-all duration-300 hover:shadow-lg">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 py-12 px-4 animate-fade-in">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-primary animate-pulse" />
                <span className="text-xl font-bold">FitTracker</span>
              </div>
              <p className="text-muted-foreground">
                The ultimate health and fitness management platform.
              </p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/features" className="story-link hover:text-primary transition-colors duration-300">Features</Link></li>
                <li><Link to="/pricing" className="story-link hover:text-primary transition-colors duration-300">Pricing</Link></li>
                <li><Link to="/integrations" className="story-link hover:text-primary transition-colors duration-300">Integrations</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="story-link hover:text-primary transition-colors duration-300">Help Center</Link></li>
                <li><Link to="/contact" className="story-link hover:text-primary transition-colors duration-300">Contact</Link></li>
                <li><Link to="/status" className="story-link hover:text-primary transition-colors duration-300">Status</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="story-link hover:text-primary transition-colors duration-300">About</Link></li>
                <li><Link to="/privacy" className="story-link hover:text-primary transition-colors duration-300">Privacy</Link></li>
                <li><Link to="/terms" className="story-link hover:text-primary transition-colors duration-300">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground animate-fade-in" style={{ animationDelay: '500ms' }}>
            <p>&copy; 2024 FitTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;