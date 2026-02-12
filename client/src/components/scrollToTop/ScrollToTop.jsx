import React, {useState, useEffect} from 'react'
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import './scrollToTop.css'

const ScrollToTop = () => {
    const [scroll, setScroll] = useState(false)

    useEffect(()=>{
        const onScroll = () => {
            setScroll(window.scrollY > 1500);
        };

        window.addEventListener('scroll', onScroll);
        // run once to set initial state
        onScroll();

        return () => window.removeEventListener('scroll', onScroll);
    }, [])

    const handleClick = () => {
        window.scrollTo({top: 0, left: 0, behavior: 'smooth' })
    }

  return (
    <div>
        <div className={scroll ? "goUpBox" : "null"} onClick={handleClick}>
            <KeyboardDoubleArrowUpIcon className='goUpIcon' />
        </div>
    </div>
  )
}

export default ScrollToTop