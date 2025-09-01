import Link from 'next/link'

const HeroContact = () => {
  return (
    <div className="mt-20 text-center">
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Get In Touch
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Let's connect and build something amazing together
        </p>
      </div>
      
      <div className="flex justify-center gap-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-4xl mb-4">📧</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Email
          </h3>
          <Link 
            href="mailto:your.email@example.com" 
            className="text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            your.email@example.com
          </Link>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="text-4xl mb-4">🐙</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            GitHub
          </h3>
          <Link 
            href="https://github.com/yourusername" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            @yourusername
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroContact
