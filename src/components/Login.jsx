import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [img, setImg] = useState('')
    const [obj, setObj] = useState({})
    const handleimg = (e) => {
        const image = e.target.files[0]
        const reader = new FileReader()
        reader.readAsDataURL(image);
        reader.onload = function () {
            setImg(reader.result);
        };
    }
    const handleclick = () => {
        let errors={}
        if (name==='') {
            console.log('name');
            errors={...errors , name:"plz fill the name"}
        }
        if(img===''){
            console.log('img');
            errors={...errors , img:"plz select an image"}

        }
        if (name && img) {
            navigate('/chat', { state: { name: name, image: img } })
        }
        setObj(errors)
    }
    return (
        <div className=' flex flex-col h-[100svh] bg-[#212121] sm:items-center justify-center px-4 sm:px-0 gap-2'>
            <div className=' order-2 w-full sm:w-[20rem]'>
            <input type="text" className='w-full  border-2 rounded border-black border-solid pl-2 py-3 outline-none' placeholder='Enter your name...' onChange={(e) => setName(e.target.value)} />
            {obj.name && <p className=' font-medium text-red-600'>{obj.name}!</p>}
            </div>
           <div className='order-1 w-full sm:w-[20rem]'>
            <input type="file" onChange={handleimg} className='w-full text-white  ' />
            {obj.img && <p className=' font-medium text-red-600'>{obj.img}!</p>}
           </div>

            <button className=' order-3 bg-black text-white rounded sm:w-[20rem] py-2 text-lg' onClick={handleclick}>Enter chat</button>
        </div>
    )
}

export default Login
