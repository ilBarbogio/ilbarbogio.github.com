export const MAIN_DATABASE_NAME="myb_db_main"
export const MAIN_DATABASE_RECORD_STORE_NAME="datasets"
export const DATABASE_NAME="myb_db"
export const DATABASE_RECORD_STORE_NAME="records"

//EVENTS
//toggle calls
export const TOGGLE_SIDEBAR_EVENT="toggle-main-sidebar"
export const TOGGLE_RECORD_INPUT_EVENT="toggle-entry-input"

//action calls: request, act, confirm
// NAME_REQUEST_EVENT -> first step to an event, e.g. call input for modify
// NAME_EVENT -> act on event, e.g. insert in database
// NAME_CONFIRM_EVENT -> confirm event, e.g after db insertion complete, maybe add result value
export const ADD_ENTRY_REQUEST_EVENT="toggle-entry-input-add"
export const ADD_ENTRY_EVENT="add-entry"
export const ADD_ENTRY_CONFIRM_EVENT="add-entry-confirm"

export const DELETE_ENTRY_REQUEST_EVENT="request-delete-entry"
export const DELETE_ENTRY_EVENT="delete-entry"
export const DELETE_ENTRY_CONFIRM_EVENT="delete-entry-confirm"

export const UPDATE_ENTRY_REQUEST_EVENT="toggle-entry-input-update"
export const UPDATE_ENTRY_EVENT="update-entry"
export const UPDATE_ENTRY_CONFIRM_EVENT="update-entry-confirm"

//file manager events
export const UPLOADED_FILE_DATA_LEGACY="uploaded-file-data-legacy"
export const LOADED_DATA_FROM_FILE="loaded-data-from-file"

//local storage
export const LS_KEY_CURRENT_FILE="currentFile"


export const CURRENCY_SYMBOL="€"


export const state={
  records:undefined,
  goals:undefined,
  maxId:undefined,
  user:undefined,
  year:undefined,
  currentFile:undefined,
  yearContainer:undefined,
  availableFiles:[]
}

export const resetState=()=>{
  state.records=undefined
  state.goals=undefined
  state.maxId=undefined
  state.user=undefined
  state.year=undefined
  state.currentFile=undefined
  state.availableFiles=[]
}