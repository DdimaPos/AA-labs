import { useState } from 'react'
import './App.css'
import MergeSortVisualizer from './sorts/mergesort'
import HeapSortVisualizer from './sorts/heapsort'
import QuickSortVisualizer from './sorts/quicksort'

function App() {

  return (
    <>
      {/*<MergeSortVisualizer/>*/}
      {/*<HeapSortVisualizer initialArray={[1,23,4,5,45,2,43,73,11]}/>*/}
      <QuickSortVisualizer/>
    </>
  )
}

export default App
