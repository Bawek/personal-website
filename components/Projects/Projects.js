import React from 'react'
import ProjectItem from './ProjectItem'
import mingoImg from '../../public/assets/mingo.png'
import blinkImg from '../../public/assets/store.png'
import expensoImg from '../../public/assets/expenso.png'
import mailImg from '../../public/assets/mail.png'
import { motion } from 'framer-motion';

const Projects = () => {
    return (
        <div id='projects' className='w-full'>
            <div className='max-w-[1240px] mx-auto px-2 py-16'>
                <motion.div
                    initial={{ x: 0, opacity: 0 }}
                    whileInView={{ x: [-250, 0], opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <p className='text-xl tracking-widest uppercase font-bold-200 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                        Projects
                    </p>
                    <h2 className='py-4'>What I&apos;ve Built</h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ y: [-50, 0], opacity: 1 }}
                    className='grid md:grid-cols-2 gap-8'>

                    <ProjectItem
                        title=' Ecommerce Application'
                        projectUrl='/blink-it'
                        backgroundImg={blinkImg}
                        desc=' c where users can buy blackpink products.'
                        tech=' React JS, React Context API, Rest Authentication,express,tailwind.'
                        sourceLink='https://github.com/Bawek/ECOMMERCE-APP/'

                    />
                    <ProjectItem
                        title='Blog App '
                        projectUrl='/mingo'
                        backgroundImg={mingoImg}
                        desc='A Blog App is a web application that enables users to create, manage, and read blog posts. It provides a platform for writers to share their thoughts, articles, tutorials, or any form of content in a structured and user-friendly format.'
                        tech='React JS,  Redux, tailwind ,mongodb database, Google Authentication & express.'
                        sourceLink='https://github.com/Bawek/Blog-App'
                    />
                    <ProjectItem
                        title='UMS'
                        projectUrl='/expenso'
                        backgroundImg={expensoImg}
                        desc='User Management System (UMS) is a software application designed to manage users, their roles, and permissions within a digital platform or organization. It allows administrators to control who can access the system, what actions they can perform, and ensures secure authentication and authorization of users.'
                        tech='React Js , Redux/Thunk,Express , MongoDb Database and tailwind.'
                        sourceLink='https://github.com/Bawek/UserManegmentSyStem'

                    />
                    <ProjectItem
                        title='Mail-Box Client'
                        projectUrl='/mailbox-client'
                        backgroundImg={mailImg}
                        desc='In mailbox client users can compose mail to anyone, view all received, sent &  unread mail.'
                        tech='React, Redux, Custom Hooks, , Real-time database, Tailwind , Exspress.'
                        sourceLink='https://github.com/Bawek/MERN'

                    />
                </motion.div>
            </div>
        </div>
    )
}

export default Projects