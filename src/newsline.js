function NewsHeadline() {

    const title = "India Wins the Cricket World Cup!";
    const category = "Sports";
    const reporter = "John Raj";
    const date = "10 July 2026";
    const isBreaking = true;

    return (

        <div style={{
            border:"2px solid gray",
            padding:"20px",
            width:"500px",
            margin:"20px auto",
            borderRadius:"10px"
        }}>

            <h2>{title}</h2>

            <p><strong>Category:</strong> {category}</p>

            <p><strong>Reporter:</strong> {reporter}</p>

            <p><strong>Date:</strong> {date}</p>

            <h3>

                Status:

                {isBreaking ? " 🔴 Breaking News" : " Normal News"}

            </h3>

        </div>

    );

}

export default NewsHeadline;