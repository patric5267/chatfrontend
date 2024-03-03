import React, { useState } from 'react'

const Prac = () => {
    const[data , setData] = useState({
        first:"" , last:""
    })
    const[errors , setErrors] = useState({
        first:null , last:null
    })
    console.log(errors);
    console.log(data);
    const handleclick =()=>{
        let errors ={}
         if(data.first===""){
            errors={...errors , }
         }
         if(data.last===""){
            setErrors({...errors , last:"plz fill the last name"})
         }
        
    }
  return (
    <div className=' flex flex-col gap-2'>
      <input type="text" value={data.first} onChange={(e)=>setData({...data , first:e.target.value})} placeholder='first name' className=' border-2 border-black border-solid pl-2 py-2 my-2'/>
      <input type="text" value={data.last} onChange={(e)=>setData({...data , last:e.target.value})} placeholder='last name' className=' border-2 border-black border-solid pl-2 py-2 my-2'/>
      <button className=' bg-black text-white px-2 py-2' onClick={handleclick}>click</button>
    </div>
  )
}

export default Prac
