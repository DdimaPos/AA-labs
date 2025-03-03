import { useState } from 'react'
import './App.css'
import MergeSortVisualizer from './sorts/mergesort'
import HeapSortVisualizer from './sorts/heapsort'
import QuickSortVisualizer from './sorts/quicksort'
import { Button } from './components/ui/button'
import RadixSortVisualizer from './sorts/radixsort'
type Variants = 0 | 1 | 2| 3;  
function App() {
  const [variant, setVariant] = useState<Variants>(0)
  const renderVisualizer = () =>{

        switch(variant){
          case 0:
            return <MergeSortVisualizer/>
          case 1:
            return <HeapSortVisualizer initialArray={[1,23,4,5,45,2,43,73,11]}/>
          case 2:
            return <QuickSortVisualizer/>
          case 3:
            return <RadixSortVisualizer/>
        }
  }
  return (
    <div>
      <div className='flex gap-2 justify-center'>
        <Button onClick={()=> setVariant(0)}>Merge Sort</Button>
        <Button onClick={()=> setVariant(1)}>Heap Sort</Button>
        <Button onClick={()=> setVariant(2)}>Quick Sort</Button>
        <Button onClick={()=> setVariant(3)}>Radix sort</Button>
      </div>
      {renderVisualizer()}
    </div>
  )
}

export default App
