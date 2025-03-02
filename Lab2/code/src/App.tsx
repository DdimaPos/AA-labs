import { useState } from 'react'
import './App.css'
import MergeSortVisualizer from './sorts/mergesort'
import HeapSortVisualizer from './sorts/heapsort'

function App() {

  return (
    <>
      {/*<MergeSortVisualizer/>*/}
      <HeapSortVisualizer initialArray={[1,23,4,5,45,2,43,73,11]}/>
    </>
  )
}

export default App
