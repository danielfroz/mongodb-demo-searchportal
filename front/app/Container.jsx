'use client'

const Container = ({ children }) => {
  return (
    <div className='flex justify-center'>
      <div className='w-full md:w-2/3'>
        {children}
      </div>
    </div>
  )
}

export default Container