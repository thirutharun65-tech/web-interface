function EmployeeRow(props) {

    return (
        <>
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.department}</td>
            <td>{props.salary}</td>
        </>
    );

}

export default EmployeeRow;