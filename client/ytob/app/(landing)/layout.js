

function LandingLayout({children}) {
  return (
    <main className="h-full bg-[#020710] overflow-auto">
        <div className="mx-auto max-w-screen-xl h-full w-full">
            {children}
        </div>
    </main>
  )
}

export default LandingLayout;