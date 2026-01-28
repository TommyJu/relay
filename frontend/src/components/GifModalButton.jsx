import React from 'react'

export default function GifModalButton() {
  return (
      <button className="btn" onClick={()=>document.getElementById('gif_modal').showModal()}>open modal</button>
  )
}