
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import  Navbar  from './components/Navbar'
import { AuthContextProvider } from '@/context/AuthContext'
import { ToastContainer } from 'react-toastify'

import { useRouter } from 'next/router'
import Protectedroute from './components/protectedroute'
const noauth:any=['/','/login','/signup']


export default function App({ Component, pageProps }: AppProps) {
  const router=useRouter();
  return(
    <AuthContextProvider>
      <ToastContainer />
       <Navbar />
       {noauth.includes(router.pathname)?(
         <Component {...pageProps} />
       ):(
        <Protectedroute>
          <Component {...pageProps} />
          </Protectedroute>

       )}
            
    </AuthContextProvider>
    
    
     
     ) 
}
