import { Html, Head, Main, NextScript } from 'next/document'
import  Navbar  from './components/Navbar'
import  Footer  from './components/Footer'
import { SessionProvider } from 'next-auth/react'


export default function Document() {
  return (
    <Html lang="en">
      <Head />
      
      <body>
     
     
      <Main />
       
       <NextScript />
     
       
        
        <Footer />
      </body>
    </Html>
  )
}
