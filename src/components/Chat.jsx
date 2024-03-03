import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import Background from '../assets/Background.png'
import { IoIosSend } from "react-icons/io";
import { motion } from 'framer-motion'
const Chat = () => {
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        if (!location.state) {
            navigate("/")
        }
    }, [location])
    const [input, setInput] = useState("")
    const [message, setMessage] = useState([])
    const socket = useMemo(() =>
        io("https://chatbackend-sray.onrender.com", {
            withCredentials: true
        })
        , [])
    const handleclick = () => {
        socket.emit("message", { msg: input, name: location.state.name , img:location.state.image})
        setInput("")
    }
    useEffect(() => {
        const element = document.getElementById('text')
        element.scrollTop = element.scrollHeight;
    })
    useEffect(() => {
      location.state &&  socket.emit("usersent", location.state.name)
        socket.on("welcome", (msg1) => {
            setMessage((message)=>[...message , {name:"server" , msg:msg1 , align:'center'} ])
        })
        socket.on("otheruserhasjoined", (msg2) => {
            setMessage((message)=>[...message , {name:"server" , msg:msg2 , align:'center'} ])
        })
        socket.on("recieve-message", (data) => {
            if (socket.id === data.id) {
            setMessage((message)=>[...message , {name:location.state.image , msg:data.msg , align:'left'} ])

                // console.log({ name: location.state.image, msg: data.msg });
            }
            else {
                setMessage((message)=>[...message , {name:data.img , msg:data.msg , align:'right'} ])
                // console.log({ name: location.state.image, msg: data.msg });
            }
        })
        socket.on("disconnect-message", (data) => {
            setMessage((message)=>[...message , {name:"server" , msg:data , align:'center'} ])
            console.log(data);
        })

        return () => {
            socket.disconnect()
        }
    }, [socket])
    return (
        <>
            <div className='maincontainer h-[100svh] relative' >
                <img className='h-full w-full' src={Background} alt="" />
                <div className='chatcontainer absolute px-3 lg:px-0 flex w-full h-full  justify-center items-center    top-0 left-0'>
                    <div className='flex flex-col justify-center items-center  w-full md:w-[48rem]'>
                        <div className="goback w-full bg-slate-400 py-2 pl-1">
                            <Link to='/' className=' font-medium text-xl hover:bg-black hover:text-white px-3 py-1 roudned'>Go Back
                            </Link>
                        </div>
                        <div id="text" className="chats w-full h-[80svh] overflow-y-auto">
                            {
                                message.map((i, index) => {
                                    if (i.align === 'center') {
                                        return (
                                            <motion.div
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    scale: 1,
                                                    opacity: 1
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    type: "spring"
                                                }}
                                                key={index} className=" my-2   flex justify-center   ">
                                                <p className=' text-white text-xl'>{i.msg}</p>
                                            </motion.div>
                                        )
                                    }
                                    else if (i.align === "right") {
                                        return (
                                            <motion.div
                                                initial={{
                                                    x: "-100vw",
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    x: 0,
                                                    opacity: 1
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    type: "spring"
                                                }}
                                                key={index} className=" my-2  right flex justify-start px-2 " >
                                                <div className='    overflow-hidden flex justify-start gap-1 items-start  w-[50%]  text-lg'>
                                                    <img src={i.name} alt="" className=' w-10 bg-white rounded-full  h-10' />
                                                    <p className=' px-2 py-1 bg-black rounded inline-block text-white'>{i.msg}</p> </div>
                                            </motion.div>
                                        )
                                    }
                                    else {
                                        return (
                                            <motion.div
                                                initial={{
                                                    x: "100vw",
                                                    opacity: 0
                                                }}
                                                animate={{
                                                    x: 0,
                                                    opacity: 1
                                                }}
                                                transition={{
                                                    duration: 1,
                                                    type: "spring"
                                                }}
                                                key={index} className=" my-2  left flex justify-end px-2 ">
                                                <div className='    overflow-hidden flex justify-end  gap-1 items-start w-[50%]  text-lg'>
                                                    <p className=' px-2 py-1 bg-white rounded inline-block text-black'>{i.msg}</p>
                                                    <img src={i.name} alt="" className=' w-10 bg-white rounded-full h-10' />
                                                </div>
                                            </motion.div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className="inputbox w-full relative">
                            <input type="text" value={input} placeholder='Type message...' className=' w-full py-2 pl-1 bg-slate-700 rounded-br rounded-bl text-white outline-none' onChange={(e) => setInput(e.target.value)} />
                            <IoIosSend className=' absolute top-[0.7rem] text-white text-xl right-1' onClick={input === "" ? () => alert("Message is required") : handleclick} />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Chat