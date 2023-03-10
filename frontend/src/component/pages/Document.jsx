import React, { useEffect, useState } from 'react'
import './Document.css'
import Sidebar from '../Sidebar';
import NavBar from '../NavBar';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChain, faClock, faFile, faSortAmountDesc, faUpload } from '@fortawesome/free-solid-svg-icons';

const Document = () => {
  const [file,setFile] = useState();
  const [lastModified,setlastModified] = useState()
  const [experience,setExperience] = useState();
  const user = JSON.parse(localStorage.getItem("EMSuser"));

  const [status,setStatus] = useState('');
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1;
  var yyyy = today.getFullYear();
  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'-'+mm+'-'+yyyy;

  const id = JSON.parse(localStorage.getItem("EMSuser")).id;

  const fileHandler=(e)=>{
    setFile(e.target.files[0]);
  }

  useEffect(()=>{
    const fetchDocuments= async()=>{
        const data = await fetch(`http://localhost:8000/documents/${id}`);
        const res = await data.json();
        console.log(res[0].documents,"res");
        console.log(res[0].lastModified);
        setExperience(res[0].experience)
        res[0].documents && setStatus(res[0].documents)
        res[0].lastModified && setlastModified(res[0].lastModified)
    }
    fetchDocuments();
  },[])

  const uploadFile=(name)=>{
    console.log(file,name);
    const formData= new FormData();
    formData.append("file", file);

    axios
        .post(`http://localhost:8000/uploadFile/${id}/${name}/${today}`, formData)
        .then(async (res) => {
          console.log(res);
          alert("File Upload success");

          const notifi = {
              type:"Doc uploaded",
              message:`${user.name}(${user.empId}) uploaded a document.`,
              date:today,
              role:"admin",
              status:"unseen"
            }
          console.log(notifi);
    
          // update all users notifications
          const generateNotifi = await fetch('http://localhost:8000/admin/user/addnotifi',{
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(notifi)
            });
            const Notifi = await generateNotifi.json();
            console.log(Notifi);
            window.location.href='/document'
        })
        .catch((err) => {
          alert('File Upload Failed! Please upload file in PDF format.')
        });
    }
  
  return (
    <>
        <Sidebar />
        <NavBar />
        <div className='documentBg'>
        <div className='document'>
            <h2>Hey, {user.name}!</h2>
            <p>Please upload your documents in PDF format only.</p>
            <div className='documentClass'>
                {/* <select  name='experience' onChange={(e)=>setRole(e.target.value)} required>
                  <option value="none" selected disabled hidden>Select ---</option>
                  <option value="fresher">Fresher</option>
                  <option value="experienced">Experienced</option>
                </select> */}
              <form action="">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col"> <FontAwesomeIcon icon={faFile} /> Document Name</th>
                    <th scope="col"> <FontAwesomeIcon icon={faUpload} /> Upload</th>
                    <th scope="col"> <FontAwesomeIcon icon={faChain} /> Attach</th>
                    <th scope="col"> <FontAwesomeIcon icon={faSortAmountDesc} /> Status</th>
                    <th scope="col"> <FontAwesomeIcon icon={faClock} /> Last Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    experience=='experienced' &&
                    <tr>
                      <th scope="row">Relieving Letter</th>
                      <td> <input type="file" name={file} onChange={fileHandler} required /> </td>
                      <td> <button onClick={()=>{uploadFile('relievingLetter')}} >Upload</button> </td>
                      {status.relievingLetter ? '': <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>}
                      {
                        status.relievingLetter && status.relievingLetter=='pending' && 
                        <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>
                      }
                      {
                        status.relievingLetter && status.relievingLetter=='uploaded' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Uploaded</div> </td>
                      }
                      {
                        status.relievingLetter && status.relievingLetter=='failed' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Failed</div> </td>
                      }
                      {
                        status.relievingLetter && status.relievingLetter=='rejected' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Rejected</div> </td>
                      }
                      {
                        status.relievingLetter && status.relievingLetter=='approved' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Approved</div> </td>
                      }
                      {
                        lastModified.relievingLetter ?
                        <td>  <div className='lastDate'>{lastModified.relievingLetter}</div> </td>
                        : <td>---</td>
                      }
                    </tr>
                  }
                  <tr>
                    <th scope="row">  Aadhar Card</th>
                    <td><input type="file" name={file} onChange={(e)=>setFile(e.target.files[0])} required /></td>
                    <td><button onClick={()=>{uploadFile('aadharCard')}}>Upload</button></td>
                    {status.aadharCard ? '': <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>}
                      {
                        status.aadharCard && status.aadharCard=='pending' && 
                        <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>
                      }
                      {
                        status.aadharCard && status.aadharCard=='uploaded' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Uploaded</div> </td>
                      }
                      {
                        status.aadharCard && status.aadharCard=='rejected' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Rejected</div> </td>
                      }
                      {
                        status.aadharCard && status.aadharCard=='failed' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Failed</div> </td>
                      }
                      {
                        status.aadharCard && status.aadharCard=='approved' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Approved</div> </td>
                      }
                      {
                        lastModified && lastModified.aadharCard ?
                        <td>  <div className='lastDate'>{lastModified.aadharCard}</div> </td>
                        : <td>---</td>
                      }
                  </tr>
                  <tr>
                    <th scope="row">  Pan Card</th>
                    <td><input type="file" onChange={(e)=>setFile(e.target.files[0])} required /></td>
                    <td><button onClick={()=>{uploadFile('panCard')}}>Upload</button></td>
                    {status.panCard ? '': <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>}
                    {
                        status.panCard && status.panCard=='pending' && 
                        <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>
                      }
                      {
                        status.panCard && status.panCard=='uploaded' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Uploaded</div> </td>
                      }
                      {
                        status.panCard && status.panCard=='failed' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Failed</div> </td>
                      }
                      {
                        status.panCard && status.panCard=='rejected' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Rejected</div> </td>
                      }
                      {
                        status.panCard && status.panCard=='approved' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Approved</div> </td>
                      }
                      {
                        lastModified && lastModified.panCard ?
                        <td>  <div className='lastDate'>{lastModified.panCard}</div> </td>
                        : <td>---</td>
                      }
                  </tr>

                  <tr>
                    <th scope="row">  Graduation Marksheet</th>
                    <td><input type="file" onChange={(e)=>setFile(e.target.files[0])} required/></td>
                    <td><button onClick={()=>{uploadFile('graduate')}}>Upload</button></td>
                    {status.graduate ? '': <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>}
                    {
                        status.graduate && status.graduate=='pending' && 
                        <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>
                      }
                      {
                        status.graduate && status.graduate=='uploaded' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Uploaded</div> </td>
                      }
                      {
                        status.graduate && status.graduate=='rejected' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Rejected</div> </td>
                      }
                      {
                        status.graduate && status.graduate=='failed' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Failed</div> </td>
                      }
                      {
                        status.graduate && status.graduate=='approved' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Approved</div> </td>
                      }
                    { 
                    lastModified && lastModified.graduate ?
                      <td>  <div className='lastDate'>{lastModified.graduate}</div> </td>
                      : <td>---</td>
                    }
                  </tr>

                  <tr>
                    <th scope="row">  Senior Secondary Marksheet</th>
                    <td><input type="file" onChange={(e)=>setFile(e.target.files[0])} required /></td>
                    <td><button onClick={()=>{uploadFile('twelth')}}>Upload</button></td>
                    {status.twelth ? '': <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>}
                    {
                        status.twelth && status.twelth=='pending' && 
                        <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>
                      }
                      {
                        status.twelth && status.twelth=='uploaded' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Uploaded</div> </td>
                      }
                      {
                        status.twelth && status.twelth=='failed' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Failed</div> </td>
                      }
                      {
                        status.twelth && status.twelth=='rejected' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Rejected</div> </td>
                      }
                      {
                        status.twelth && status.twelth=='approved' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Approved</div> </td>
                      }
                      {
                        lastModified && lastModified.twelth ?
                        <td>  <div className='lastDate'>{lastModified.twelth}</div> </td>
                        : <td>---</td>
                      }
                  </tr>

                  <tr>
                    <th scope="row">  Secondary Marksheet</th>
                    <td><input type="file" onChange={(e)=>setFile(e.target.files[0])} required/></td>
                    <td><button onClick={()=>{uploadFile('tenth')}}>Upload</button></td>
                    {status.tenth ? '': <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>}
                    {
                        status.tenth && status.tenth=='pending' && 
                        <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>
                      }
                      {
                        status.tenth && status.tenth=='uploaded' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Uploaded</div> </td>
                      }
                      {
                        status.tenth && status.tenth=='failed' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Failed</div> </td>
                      }
                      {
                        status.tenth && status.tenth=='rejected' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Rejected</div> </td>
                      }
                      {
                        status.tenth && status.tenth=='approved' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Approved</div> </td>
                      }
                    {
                        lastModified && lastModified.tenth ?
                        <td>  <div className='lastDate'>{lastModified.tenth}</div> </td>
                        : <td>---</td>
                      }
                  </tr>

                  <tr>
                    <th scope="row">  Resume</th>
                    <td><input type="file" onChange={(e)=>setFile(e.target.files[0])} required/></td>
                    <td><button onClick={()=>{uploadFile('resume')}}>Upload</button></td>
                      {status.resume ? '': <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td>}
                      {
                        status.resume && status.resume=='pending'  && 
                        <td> <div className='status' style={{'color' : '#084cdf'}}>Pending</div> </td> 
                      }
                      {
                        status.resume && status.resume=='uploaded' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Uploaded</div> </td>
                      }
                      {
                        status.resume && status.resume=='failed' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Failed</div> </td>
                      }
                      {
                        status.resume && status.resume=='rejected' &&
                        <td> <div className='status' style={{'color' : 'red'}}>Rejected</div> </td>
                      }
                      {
                        status.resume && status.resume=='approved' &&
                        <td> <div className='status' style={{'color' : 'green'}}>Approved</div> </td>
                      }
                      {
                        lastModified && lastModified.resume ?
                        <td>  <div className='lastDate'>{lastModified.resume}</div> </td>
                        : <td>---</td>
                      }
                    
                  </tr>

                </tbody>
              </table>
              {/* <div className={isDisabled ? 'documentSubmitN' : 'documentSubmit'}> */}
              {/* <div className='documentSubmit'>

                <button disabled={isDisabled}> SUBMIT </button>
              </div> */}
              </form>
            </div>
            </div>
        </div>
    </>
  )
}

export default Document