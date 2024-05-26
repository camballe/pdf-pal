import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'

const SubscribeButton = () => {
    return (
        <Button className="w-full">Subscribe now <ArrowRight className='h-5 w-5 ml-1.5' /></Button>
    )
}

export default SubscribeButton