import React from 'react'

const FooterSpotlight = () => {
    return (
        <div className=''>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[50vh] bg-gradient-to-t from-gray-500/20 to-transparent" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 z-0 aspect-square w-[50vh] -translate-x-1/2 translate-y-1/2 rounded-full bg-gray-500 opacity-20 blur-[100px]" />
        </div>
    )
}

export default FooterSpotlight