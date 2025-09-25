import React from 'react'
import Navbar from '../components/section/Navbar'
import Footer from '../components/section/Footer'
import TabDropdown from '../components/section/TabDropDown'


function Learn() {
  return<>
   <Navbar />
   <div className='min-h-[60vh] bg-black flex items-center justify-center'>
    <TabDropdown />
    </div>
   <Footer />
  </>
}

export default Learn