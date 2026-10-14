const Login = () => {
    return(
        <div style={{display: "flex", justifyContent: "center", alignItems : "center", flexDirection: "column", padding: "150px 0px"}}>
        <div style={{backgroundColor : "white", maxWidth : "450px", display : "flex", flexDirection: "column", margin: "auto", padding: "50px 40px", gap: "15px"} }>
            <div>
                <h2 >Employee Attendance System</h2>
            </div>
            <div>
                <form style={{display: "flex", flexDirection: "column"}}>
                    <label htmlFor="EmpId">EmployeeID</label><br/>
                    <input type="text" placeholder="Enter Your Employee ID"/><br/>
                    <label htmlFor="Password">Password</label><br/>
                    <input type="Password" placeholder="Enter Your Password"/><br/>
                    <button>Login</button>
                </form>
            </div>
            </div>
        </div>
    )
}
export default Login