
import Navbar from '@/components/ui/Navbar';
import Sidebar from '@/components/ui/Sidebar';

function DashboardLayout({children}) {
  return (
    <div className='h-full relative'>
      <div className='hidden h-full md:flex md:w-20 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900'>
        <Sidebar />
      </div>
      <div className='sm:ml-20 ml-0'>
        <Navbar />
        
          {children}
        
      </div>
    </div>
  )
}

export default DashboardLayout;