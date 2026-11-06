import "./Product.css";

function Product(props){

    const finalPrice =
    props.price - props.discount;

    return(

        <div className="card">

            <h2>{props.name}</h2>

            <p>

                <strong>Brand:</strong>

                {props.brand}

            </p>

            <p>

                <strong>Price:</strong>

                ₹{props.price}

            </p>

            <p>

                <strong>Discount:</strong>

                ₹{props.discount}

            </p>

            <h3>

                Final Price:

                ₹{finalPrice}

            </h3>

        </div>

    );

}

export default Product;