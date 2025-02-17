import "../Recommended/recommended.css"
import "../globals.css"

export const Recommended = () => {
  return (
    <>
    <div>
        <h2 className='recommended-title'>Recommended</h2>
        <div className="recommended-flex">
            <button className='btns'>All Courses</button>
            <button className='btns'>Technology & IT</button>
            <button className='btns'>Business & Management</button>
            <button className='btns'>Healthcare & Medicine</button>
            <button className='btns'>Arts & Design</button>
        </div>
    </div>
    </>
  )
}
