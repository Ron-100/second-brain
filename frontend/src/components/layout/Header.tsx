import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { logoutUser } from '../../redux/slices/AuthSlice';
import { Modal, ThemeToggle, SignInUp } from '../../components';
import { CiMenuKebab, RxCross2 } from '../icons'
import { motion } from 'framer-motion';
import { cn } from '../../utils';

const Header: React.FC = () => {
    const [loginIsOpen, setLoginIsOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const status = useSelector((state: RootState) => state.auth.status)
    const navItems = [
        { name: "All Collection", path: "/dashboard/all", active: true },
        { name: "Social Post", path: "/dashboard/twitter", active: true},
        { name: "Videos", path: "/dashboard/youtube", active: true},
        { name: "Docs", path: "/dashboard/docs", active: true},
        { name: "Links", path: "/dashboard/links", active: true}
    ]
    const handelLogout = () => {
        dispatch(logoutUser())
        navigate('/')
    }

    return (
        <>
            <div className={cn('fixed w-full h-16 flex justify-between items-center bg-header-background dark:bg-header-background-dark px-10 z-50')} >
                {status ? (
                    <>
                        <div className={cn('lg:hidden')}>
                            <button onClick={() => setIsOpen(!isOpen)}> <CiMenuKebab fontSize="35px" className={cn('text-text-300 dark:text-text-dark-100 cursor-pointer')}/> </button>
                        </div>
                        <div id="logo" className={cn('hidden lg:block')}>
                            <h1 onClick={() => navigate('/')} className={cn('text-text-300 dark:text-text-dark-100 font-bold tracking-widest')}>S-BRAIN</h1>
                        </div>
                        <div id="nav-items" className={cn('hidden lg:block')}>
                            {status && (
                                <div className={cn('m-auto max-w-[640px] w-full h-[45px] bg-nav-background-light dark:bg-nav-background-dark-light rounded-full flex justify-between items-center px-[6px]')}>
                                    {navItems.map((item) => (
                                        <NavLink key={item.name} to={item.path} className={({ isActive }) => cn(`rounded-full px-4 py-1 text-text-300 dark:text-text-dark-100 flex justify-center items-center gap-1 transition-all duration-150 ${isActive ? "bg-black text-white" : "bg-transparent"}`)}>
                                            <p className={cn("cursor-pointer")}>{item.name}</p>
                                        </NavLink>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div id="logo">
                        <h1 onClick={() => navigate('/')} className={cn('text-text-300 dark:text-text-dark-100 font-bold tracking-widest')}>S-BRAIN</h1>
                    </div>
                )}

                <div id="auth-items" className={cn('flex items-center gap-4')}>
                    <div>
                        <ThemeToggle />
                    </div>
                    <div className={cn('rounded-sm py-2 px-4 cursor-pointer')}>
                        {status ? (
                            <button onClick={handelLogout} className={cn('font-medium text-[#ff0000] cursor-pointer')}>
                                Logout
                            </button>
                        ) : (
                            <>
                                <button onClick={() => setLoginIsOpen(true)} className={cn('font-medium text-text-300 dark:text-text-dark-100 cursor-pointer')}>
                                    Login
                                </button>
                                <Modal isOpen={loginIsOpen} onClose={() => setLoginIsOpen(false)} onSubmit={() => setLoginIsOpen(false)}>
                                    <SignInUp onSuccess={() => setLoginIsOpen(false)} />
                                </Modal>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <motion.nav
                className={cn("lg:hidden fixed top-0 left-0 h-full w-80 bg-header-background dark:bg-header-background-dark z-50")}
                initial={{ x: '-100%' }}
                animate={{ x: isOpen ? 0 : '-100%' }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                }}
            >
                <div className={cn("p-6 ")}>
                    <div className={cn("flex justify-between items-center mb-8")}>
                        <h1 className={cn("text-text-300 dark:text-text-dark-100")}>S-BRAIN</h1>
                        <h1 onClick={() => setIsOpen(false)} ><RxCross2 fontSize="35px" className={cn('text-text-300 dark:text-text-dark-100 cursor-pointer')}/></h1>
                    </div>
                    <div className={cn("border-t pt-6 text-text-300 dark:text-text-dark-100")}> </div>
                    {status && (
                        <div className={cn("mb-8")}>
                            <ul className={cn("space-y-4")}>
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        <NavLink
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={({ isActive }) => cn(`text-text-300 dark:text-text-dark-300 flex items-center gap-3 p-3 rounded-lg transition-all duration-150 ${isActive ? "bg-black dark:bg-white text-white dark:text-black" : "hover:bg-gray-100"}`)} >
                                            <span>{item.name}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </motion.nav>
        </>
    )
}

export default Header;