import {
  readRecordFile, connectMain, createRecordFile,
  setupListeners as setupDataListeners
} from "./scripts/data/opfsdata.js"
import { state, LOADED_DATA_FROM_FILE, LS_KEY_CURRENT_FILE } from "./scripts/variables.js"
import { readDiskData } from "./scripts/data/files.js"


const appSetup=async()=>{
  setupDataListeners()
  window.addEventListener(LOADED_DATA_FROM_FILE,()=>{
    if(state.yearContainer){
      state.yearContainer.setAttribute("year",state.year)
      state.yearContainer.data=state.records
    }
  })

  state.yearContainer=document.createElement("year-container")
  state.yearContainer.classList.add("content")
  document.body.append(state.yearContainer)

  let lastCurrentFile=localStorage.getItem(LS_KEY_CURRENT_FILE)
  if(lastCurrentFile){
    const response=await readRecordFile(lastCurrentFile)
    if(response.result){
      let event=new CustomEvent(LOADED_DATA_FROM_FILE)
      window.dispatchEvent(event)
    }
  }
}

appSetup()