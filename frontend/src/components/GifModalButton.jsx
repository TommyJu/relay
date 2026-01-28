import React from 'react'
import { Smile } from 'lucide-react';

export default function GifModalButton() {
  return (
      <button type="button" className="flex btn btn-circle text-zinc-400" onClick={()=>document.getElementById('gif_modal').showModal()}>
        <Smile size={20}/>
      </button>
  )
}