import "./Teammember.css";

function TeamMember(props){

    return(

        <div className="card">

            <h2>{props.name}</h2>

            <p>
                <strong>ID:</strong> {props.id}
            </p>

            <p>
                <strong>Designation:</strong> {props.designation}
            </p>

            <p>
                <strong>Department:</strong> {props.department}
            </p>

            <p>
                <strong>Email:</strong> {props.email}
            </p>

        </div>

    );

}

export default TeamMember;