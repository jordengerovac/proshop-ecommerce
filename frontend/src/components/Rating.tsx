import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import IRating from "../types/rating.type";

function Rating({ rating }: { rating: IRating }) {
  return (
    <div className="rating">
      <span>
        {rating.value >= 1 ? (
          <FaStar />
        ) : rating.value >= 0.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {rating.value >= 2 ? (
          <FaStar />
        ) : rating.value >= 1.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {rating.value >= 3 ? (
          <FaStar />
        ) : rating.value >= 2.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {rating.value >= 4 ? (
          <FaStar />
        ) : rating.value >= 3.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      <span>
        {rating.value >= 5 ? (
          <FaStar />
        ) : rating.value >= 4.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      {rating.text && <span className="ms-2">{rating.text}</span>}
    </div>
  );
}

export default Rating;
