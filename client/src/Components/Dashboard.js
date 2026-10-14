import Calendar from 'react-calendar';
import { useState } from 'react';
const Dashboard = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    return(
        <div style={{background: "white"}}>
            <div>
                <h2>EmployeeId : </h2>
                <h2>Name :</h2>
                <h2>Designation :</h2>
                <h2>Time & Date : {new Date().toString()}</h2>
            </div>
            <div>
                <div>
                    <h2>Total Employees</h2>
                    <p></p>
                </div>
                <div>
                    <h2>Present Today</h2>
                    <p></p>
                </div>
                <div>
                    <h2>Late Arrivals</h2>
                    <p></p>
                </div>
                <div>
                    <h2>WFH Requests Pending</h2>
                    <p></p>
                </div>
            </div>
            <div>
                <div style={{ maxWidth: '350px', borderRadius: '12px', overflow: 'hidden' }}>
        <Calendar 
          onChange={setSelectedDate} 
          value={selectedDate} 
        />
      </div>
            </div>
        </div>
    )
}
export default Dashboard