import React, { useState } from "react";
import { RiAddCircleLine, IoIosArrowDroprightCircle } from '../../components/icons';
import { cn } from "../../utils";
import { Modal, ContentCreate } from "../../components";


const Dashboard: React.FC = () => {
    const [loginIsOpen, setLoginIsOpen] = useState(false);
    return (
        <>
            <div className={cn('m-auto max-w-[1536px] w-full min-h-screen h-full flex justify-center items-center')}>
                <div className={cn('w-auto h-auto flex flex-col-reverse sm:flex-row justify-center items-center gap-8 sm:gap-4')}>
                    <div className={cn('flex justify-center items-center')}>
                        <p className={cn('text-[30px] bg-[#898989] text-white flex justify-center items-center rounded-full p-2')}> <IoIosArrowDroprightCircle /></p>
                        <h1 className={cn('text-[30px] text-[#898989] rounded-[5px] px-2')}>All Collection</h1>
                    </div>
                    <hr className={cn('text-[#898989] w-[250px] sm:w-[100px] sm:block sm:rotate-90')} />
                    <div>
                        <RiAddCircleLine className={cn(' text-[#898989] text-[5em]')} onClick={() => setLoginIsOpen(true)} />
                    </div>
                    <Modal isOpen={loginIsOpen} onClose={() => setLoginIsOpen(false)} onSubmit={() => setLoginIsOpen(false)}>
                        <ContentCreate onSuccess={() => setLoginIsOpen(false)} />
                    </Modal>
                </div>
            </div>
        </>
    )
}

export default Dashboard;