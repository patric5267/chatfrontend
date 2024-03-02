import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import bg from '../assets/bg.png'
import { IoIosSend } from "react-icons/io";

const Chat = () => {
    const location = useLocation()
    const [input, setInput] = useState("")
    const [message, setMessage] = useState([])
    const socket = useMemo(() =>
        io("https://chatbackend-1.onrender.com/", {
            withCredentials: true
        })
        , [])
    const handleclick = () => {
        socket.emit("message", { msg: input, name: location.state.name, img: location.state.image })
        setInput("")
    }
    useEffect(() => {
        const element = document.getElementById('text')
        element.scrollTop = element.scrollHeight;
    })
    useEffect(() => {
        socket.on("connect", () => {
            socket.emit("usersent", location.state.name)
            socket.on("welcome", (msg) => {
                setMessage((message) => [...message, { msg: msg, name: "server", align: "center" }])
            })
            socket.on("userjoined", (msg) => {
                setMessage((message) => [...message, { msg: msg, name: "server", align: "center" }])
            })
        })
        socket.on("recieve-message", (data) => {
            if (socket.id === data.id) {
                setMessage((message) => [...message, { msg: data.msg, name: data.img, align: "left" }])
            }
            else {
                setMessage((message) => [...message, { msg: data.msg, name: data.img, align: "right" }])

            }
        })
        socket.on("disconnect-message", (msg) => {
            setMessage((message) => [...message, { msg: msg, name: "server", align: "center" }])
        })
        return () => {
            socket.disconnect()
        }
    }, [socket, name])
    return (
        <>
            <div className='maincontainer h-[100svh] relative' >
                <img className='h-full w-full' src={bg} alt="" />
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
                                            <div key={index} className=" my-2   flex justify-center   ">
                                                <p className=' text-white text-xl'>{i.msg}</p>
                                            </div>
                                        )
                                    }
                                    else if (i.align === "right") {
                                        return (
                                            <div key={index} className=" my-2  right flex justify-start px-2 " >
                                                <div className='    overflow-hidden flex justify-start gap-1 items-start  w-[50%]  text-lg'>
                                                    <img src={i.name} alt="" className=' w-10 bg-white rounded-full  h-10' />

                                                    <p className=' px-2 py-1 bg-black rounded inline-block text-white'>{i.msg}</p> </div>
                                            </div>
                                        )
                                    }
                                    else {
                                        return (
                                            <div key={index} className=" my-2  left flex justify-end px-2 ">
                                                <div className='    overflow-hidden flex justify-end  gap-1 items-start w-[50%]  text-lg'>
                                                    <p className=' px-2 py-1 bg-white rounded inline-block text-black'>{i.msg}</p>
                                                    <img src={i.name} alt="" className=' w-10 bg-white rounded-full h-10' />
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div className="inputbox w-full relative">
                            <input type="text" value={input} placeholder='Type message...' className=' w-full py-2 pl-1 bg-slate-700 rounded-br rounded-bl text-white outline-none' onChange={(e) => setInput(e.target.value)} />
                            <IoIosSend className=' absolute top-[0.7rem] text-white text-xl right-1' onClick={handleclick} />
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Chat
