import React from 'react'
import Avatar from '@mui/material/Avatar';
import { motion } from 'framer-motion';

const About = ({ content, experience }) => {
    return (

        <div id='about' className='w-full md:h-screen p-2 flex items-center '>
            <div className='max-w-[1240px] m-auto md:grid grid-cols-3 gap-8'>
                <div

                    className='col-span-2'>
                    <motion.div
                        initial={{ x: 0, opacity: 0 }}
                        whileInView={{ x: [-250, 0], opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <p className='uppercase text-xl tracking-widest font-bold-200 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
                            {content?.hero?.title || 'About'}
                        </p>
                        <h2 className='py-4'>{content?.whoAmI?.title || 'Who I Am'}</h2>
                    </motion.div>
                    <motion.div
                        initial={{ x: 0, opacity: 0 }}
                        whileInView={{ x: [-250, 0], opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        <p className='py-2 text-gray-600'>
                            {content?.whoAmI?.description || 
                            `I am a Software Engineer who's passionate & enthusiastic about creating web applications. I am into web development from past years and I have experience working on several real-world end-to-end projects using HTML, CSS, JavaScript, React JS, Redux, Web3.js, React Context API.\n\nI am a quick learner & have a good problem-solving mindset. I am a result-oriented person and have an always learning attitude. I love to learn new technologies & keep upgrading my skills!`}
                        </p>
                        
                        {/* Show experience summary if available */}
                        {experience && experience.length > 0 && (
                            <div className='py-4'>
                                <h3 className='font-semibold text-gray-900 mb-2'>Professional Experience:</h3>
                                <div className='space-y-2'>
                                    {experience.slice(0, 3).map((exp) => (
                                        <div key={exp._id} className='flex items-center space-x-2'>
                                            <span className='font-medium'>{exp.title}</span>
                                            <span className='text-gray-500'>@ {exp.company}</span>
                                            <span className='text-sm text-gray-400'>
                                                {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {content?.resume?.fileUrl && (
                            <a
                                download
                                href={content.resume.fileUrl}
                                alt='Download Resume'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                <button className='text-sm p-3 my-6 hover:scale-105 ease-in duration-300 bg-blue-600 text-white rounded-lg px-6 py-3'>
                                    {content.resume.buttonText || 'Download Resume'}
                                </button>
                            </a>
                        )}
                    </motion.div>


                </div>
                <motion.div
                    initial={{ x: 0, opacity: 0 }}
                    whileInView={{ x: [250, 0], opacity: 1 }}
                    transition={{ duration: 1 }}
                    className='w-full h-auto m-auto  flex items-center justify-center p-4 hover:scale-105 ease-in duration-300'>

                    <Avatar sx={{ width: 260, height: 260 }}
                        alt="Baweke" src="bawe.jpg" />
                </motion.div>
            </div >
        </div>

    )
}
export default About;
