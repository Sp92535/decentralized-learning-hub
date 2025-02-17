import "../Category/category.css"
import "../../globals.css"

const Category = () => {
    return <div className="m-4">
      <h2 className="sidebar-title">Category</h2>

      <div>

        {/* <Input /> */}
         <label className="sidebar-label-container">
          <input type="radio" name="test" />
          <span className="checkmark"></span>All
         </label>
         <label className="sidebar-label-container">
          <input type="radio" name="test" />
          <span className="checkmark"></span>Technology
         </label>
         <label className="sidebar-label-container">
          <input type="radio" name="test" />
          <span className="checkmark"></span>Business
         </label>
         <label className="sidebar-label-container">
          <input type="radio" name="test" />
          <span className="checkmark"></span> Creative 
         </label>
      </div>
    </div>
  };
  
  export default Category; // Ensure this line exists
  