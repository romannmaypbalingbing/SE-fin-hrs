import React, { useState } from "react"


const GuestNavBar = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }


  return (
    <>
      {/*<!-- Component: Navbar with Icons --> */}
      <header className="relative z-20 w-full border-b-4 border-b-amber-500 bg-white/90 shadow-lg shadow-amber-700/5 after:absolute after:left-0 after:top-full after:z-10 after:block after:h-px after:w-full after:bg-slate-200 lg:backdrop-blur-sm lg:after:hidden">
        <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-7xl 2xl:max-w-[96rem]">
          <nav
            aria-label="main navigation"
            className="flex h-[5.5rem] items-stretch justify-between font-medium text-slate-500"
            role="navigation"
          >
            {/*      <!-- Brand logo --> */}
            <a
              id="Marison"
              aria-label="Marison logo"
              aria-current="page"
              className="flex items-center gap-2 whitespace-nowrap py-3 text-lg focus:outline-none lg:flex-1"
              href="javascript:void(0)"
            >
              <img
                src="src/assets/MARISON-LOGO.png"
                alt="Marison Hotel Logo"
                className="h-12 w-auto"
              />
            </a>
            {/*      <!-- Mobile trigger --> */}
            <button
              className={`relative order-10 block h-10 w-10 self-center lg:hidden
              ${
                isToggleOpen
                  ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(2)]:-rotate-45 [&_span:nth-child(3)]:w-0 "
                  : ""
              }
            `}
              onClick={() => setIsToggleOpen(!isToggleOpen)}
              aria-expanded={isToggleOpen ? "true" : "false"}
              aria-label="Toggle navigation"
            >
              <div className="absolute left-1/2 top-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                ></span>
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-6 transform rounded-full bg-slate-900 transition duration-300"
                ></span>
                <span
                  aria-hidden="true"
                  className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-slate-900 transition-all duration-300"
                ></span>
              </div>
            </button>
            {/*      <!-- Navigation links --> */}
            <ul
              role="menubar"
              aria-label="Select page"
              className={`absolute left-0 top-0 z-[-1] h-[28.5rem] w-full justify-center overflow-hidden  overflow-y-auto overscroll-contain bg-white/90 px-8 pb-12 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0  lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0  lg:pt-0 lg:opacity-100 ${
                isToggleOpen
                  ? "visible opacity-100 backdrop-blur-sm"
                  : "invisible opacity-0"
              }`}
            >
              <li role="none" className="flex items-stretch">
                <a
                  role="menuitem"
                  aria-haspopup="false"
                  className="flex items-center gap-2 py-4 transition-colors duration-300 hover:text-amber-600 focus:text-amber-600 focus:outline-none focus-visible:outline-none lg:px-8"
                  href="javascript:void(0)"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                    aria-label="Menu item icon"
                    role="graphics-symbol"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                    />
                  </svg>
                   <span>Currency</span> {/*display current currency selected */}
                </a>
              </li>
            </ul>

            <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
              <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded bg-red-700 px-5 text-sm font-medium tracking-wide text-white shadow-md shadow-dark red-800 transition duration-300 hover:bg-red-800 hover:shadow-sm hover:shadow-red-700 focus:bg-red-700 focus:shadow-sm focus:shadow-emerald-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
                <span>Contact us</span>
              </button>

              {/* Guest Avatar with dropdown menu */}
              <div className="relative ml-4">
                <button
                  onClick={toggleMenu}
                  className="flex items-center gap-2 p-1 rounded-full focus:outline-none focus-visible:outline-none"
                  >
                    {/* Guest Avatar Image*/}
                    <div className="relative w-12 h-12 ml-6 overflow-hidden bg-gray-100 rounded-full ring-2 ring-offset-2 ring-gray-300 dark:ring-slate-400 dark:bg-slate-400 hover:ring-red-700">
                      <svg
                        className="absolute w-14 h-14 text-slate-300 -left-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>


                  </button>
                  {/* Dropdown menu */}
                  {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                    <ul className="text-sm">
                      <li>
                        <a
                          href="#profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </a>
                      </li>
                      <li>
                        <a
                          href="#check-booking"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Check Booking Status
                        </a>
                      </li>
                      <li>
                        <a
                          href="#settings"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </a>
                      </li>
                      <li>
                        <a
                          href="#logout"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Log Out
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>
      </header>
      {/*<!-- End Navbar with Icons --> */}
    </>
    // add logo
  )
} 
export default GuestNavBar;