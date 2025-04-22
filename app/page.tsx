import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-primary py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Campus Desk</h1>
            <div className="space-x-2">
              <Button asChild variant="outline" className="text-white border-white hover:text-primary hover:bg-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" className="text-white border-white hover:text-primary hover:bg-white">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Leave Application Management System</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              A comprehensive platform for students to apply for leaves and for faculty to manage them efficiently.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Easy Leave Application</h3>
                <p>Students can easily apply for leaves with a simple form and track their status in real-time.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Efficient Management</h3>
                <p>Faculty can view, approve, or reject leave applications from a centralized dashboard.</p>
              </div>
              <div className="bg-card p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-3">Real-time Updates</h3>
                <p>Get instant notifications when your leave status changes or when new applications are submitted.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Campus Desk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
