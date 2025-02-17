import "../components/Products/products.css"
import "../components/globals.css"
import { AiFillStar } from "react-icons/ai";
import { BsFillBagHeartFill } from "react-icons/bs";
export const Card = () => {
  return (
    <section className="card">
        <img src="Udemy Course Completion Certificate.jpeg" alt="Some Course" className="card-img" />

        <div className="card-details">
          <h3 className="card-title">COURSE</h3>

          <section className="card-reviews">
            <AiFillStar className="ratings-start" />
            <AiFillStar className="ratings-start" />
            <AiFillStar className="ratings-start" />
            <AiFillStar className="ratings-start" />
            <span className="total-reviews">4</span>
          </section>

          <section className="card-price">
            <div className="price">
              <del>300$</del>200
            </div>

            <div className="bag">
              <BsFillBagHeartFill className="bag-icon" />
            </div>
          </section>
        </div>
      </section>
  )
}
