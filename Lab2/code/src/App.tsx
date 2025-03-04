//import { useState } from 'react'
//import './App.css'
//import MergeSortVisualizer from './sorts/mergesort'
//import HeapSortVisualizer from './sorts/heapsort'
//import QuickSortVisualizer from './sorts/quicksort'
//import { Button } from './components/ui/button'
//import RadixSortVisualizer from './sorts/radixsort'
//type Variants = 0 | 1 | 2| 3;  
//function App() {
//  const [variant, setVariant] = useState<Variants>(0)
//  const renderVisualizer = () =>{
//        switch(variant){
//          case 0:
//            return <MergeSortVisualizer initialArray={[1,23,4,5,45,2,43,73,11]}/>
//          case 1:
//            return <HeapSortVisualizer initialArray={[1,23,4,5,45,2,43,73,11]}/>
//          case 2:
//            return <QuickSortVisualizer initialArray={[1,23,4,5,45,2,43,73,11]}/>
//          case 3:
//            return <RadixSortVisualizer initialArray={[1,23,4,5,45,2,43,73,11]}/>
//        }
//  }
//  return (
//    <div>
//      <div className='flex gap-2 justify-center'>
//        <Button onClick={()=> setVariant(0)}>Merge Sort</Button>
//        <Button onClick={()=> setVariant(1)}>Heap Sort</Button>
//        <Button onClick={()=> setVariant(2)}>Quick Sort</Button>
//        <Button onClick={()=> setVariant(3)}>Radix sort</Button>
//      </div>
//      {renderVisualizer()}
//    </div>
//  )
//}
//
//export default App

import { useState } from 'react'
import './App.css'
import MergeSortVisualizer from './sorts/mergesort'
import HeapSortVisualizer from './sorts/heapsort'
import QuickSortVisualizer from './sorts/quicksort'
import { Button } from './components/ui/button'
import RadixSortVisualizer from './sorts/radixsort'
import { Textarea } from './components/ui/textarea'

type Variants = 0 | 1 | 2 | 3;

function App() {
  const [variant, setVariant] = useState<Variants>(0)
  const [inputArray, setInputArray] = useState("1,23,4,5,45,2,43,73,11")

  // Parse the comma-separated string into an array of numbers.
  const parsedArray = inputArray
    .split(',')
    .map(str => Number(str.trim()))
    .filter(num => !isNaN(num))

  const renderVisualizer = () => {
    switch (variant) {
      case 0:
        return <MergeSortVisualizer initialArray={parsedArray} />
      case 1:
        return <HeapSortVisualizer initialArray={parsedArray} />
      case 2:
        return <QuickSortVisualizer initialArray={parsedArray} />
      case 3:
        return <RadixSortVisualizer initialArray={parsedArray} />
      default:
        return null
    }
  }

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <Textarea
          className="border p-2"
          value={inputArray}
          onChange={(e) => setInputArray(e.target.value)}
          placeholder="Enter comma separated values"
          rows={3}
          cols={50}
        />
      </div>
      <div className="flex gap-2 justify-center">
        <Button onClick={() => setVariant(0)}>Merge Sort</Button>
        <Button onClick={() => setVariant(1)}>Heap Sort</Button>
        <Button onClick={() => setVariant(2)}>Quick Sort</Button>
        <Button onClick={() => setVariant(3)}>Radix Sort</Button>
      </div>
      {renderVisualizer()}
    </div>
  )
}

export default App

