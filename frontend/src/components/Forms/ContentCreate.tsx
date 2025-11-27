import { cn } from "../../utils";

interface ContentCreateProps {
    onSuccess?: () => void;
}

const ContentCreate: React.FC<ContentCreateProps> = () => {

    return(
        <>
            <div className={cn('h-50 w-150 bg-green-300')} >
                <input type="text" placeholder="title" className={cn('h-10 w-50 m-10')} />
                <input type="text" placeholder="content" className={cn('h-10 w-50 m-10')} />
                <input type="text" placeholder="url" className={cn('h-10 w-50 m-10')} />
                <select name="tag" id="">
                    <option value="Select" >Select</option>
                    <option value="video" >video</option>
                    <option value="post" >post</option>
                    <option value="links" >links</option>
                </select>
            </div>
        </>
    )
}

export default ContentCreate;