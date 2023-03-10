import React, { useEffect } from 'react'
import './Employee.css'
import { Link, useLocation } from "react-router-dom"
import Sidebar from '../Sidebar';
import NavBar from '../NavBar';
import { useState } from 'react';
import Loading from '../Loading';


const AddEmployee = () => {
    const [count,setCount] = useState();
    const [data,setData] = useState();
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem("EMSuser"));
    const location = useLocation();

    if(user) {
        window.history.pushState(null, null, location.href);
        window.onpopstate = function(event) {
          window.history.go(1);
        };
    }

    const userURL = 'http://localhost:8000/'
    useEffect(() => {
        const fetchurl= async ()=>{
             setLoading(true);

            const res = await fetch(userURL,{
                method: 'GET',
                headers: {
                    accept: 'application/json',
                },
            });
            const data = await res.json();
            setCount(data && data.count);
            setData(data && data.user);
            console.log(data);
            setLoading(false);
        }
        fetchurl();
      },[userURL]);
  return (
    <>
        <NavBar/>
        <Sidebar />
        {
            !loading ? 
        
        <div className='addEmployee'>
           <div className='employeeBG'>
                <div className='addButton'>
                    <p className='count'>People</p>
                    <p className='countNum'> {count}</p>
                </div> 

        <div className='overallCard'>
            {
            data && data.map((user,i)=>(
                <div className=" card1div " key={user._id}>
                        <img className="card-img-top" src={`data:image/png;base64,${user.image.data}`}  alt="Card image cap" />
                         <div className='mainCardContent'>
                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.empId} <br /> {user.oEmail} </p>
                            <Link to="/EmployeeDetails" className=" employeeButton" state={{ id: user._id }}>
                                        View
                            </Link>
                         </div>
                </div>
            ))}
        </div>
           </div>

        </div> : <Loading />
}
    </>
  )
}

export default AddEmployee