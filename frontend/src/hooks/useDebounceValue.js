
import { useState,useEffect  } from "react";


export default function useDebounceValue(value, delay=1000) {
  const [newValue, setNewValue] = useState(value)
  const [wait, setWait] =useState()

  useEffect(()=>{
      
  
    setWait(setTimeout(()=>{
        setNewValue(value)
    }, delay))

    return ()=>{
        clearTimeout(wait)
        
    }
  }, [value])

  return newValue
}
