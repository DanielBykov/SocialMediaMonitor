import React, {Component} from 'react'
import axios from "axios"
import Select from "react-select"
import "./s.sass"

export const SelectCompany = () => {
  const {devModeLocal=false} = window
  const updateCompany = (coID)=>{
    const companyID = parseInt(coID)

    if(devModeLocal){
      window.companyID = companyID
    }

    else if (csrfmiddlewaretoken && companyID) {
      let q = `csrfmiddlewaretoken=${csrfmiddlewaretoken}&company=${companyID}`
      axios({
        method: 'POST',
        url: '/api/update_company/',
        data: q,
        headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'}
      })
        .then(()=>{
        console.log("Reloading")
        location.reload(true)
      })
        .catch((err)=>{
        console.error("Request error")
      })

    } else console.log("Wrong params")
  }
  const updateCompanyDev = (coID)=>{
    let app = ( ( window.getArgs||{} ).app||'sb')
    location.href = '?app='+ app +'&companyID=' + coID
  }

  const escapeHtml = (text)=>{
    const map = {amp: '&', lt: '<', gt: '>', quot: '"', '#039': "'"}
    return text.replace(/&([^;]+);/g, (m, c) => map[c])
  }

  let options = []
  const {companyList, companyID} = window

  if( companyList.length > 0 && parseInt(companyID) )
    options = companyList.map( co => ({value: co.id, label: escapeHtml(co.displayName)}) )

  const handle = (event)=>{
    console.log('Select event: ',event)
    if(devModeLocal){
      updateCompanyDev(event.value)
    } else {
      updateCompany(event.value)
    }
  }

  return (
    <Select
    options={options}
    onChange={handle}
    defaultValue={options.filter(x => x.value === parseInt(companyID))}
    className={'select-company__block'}
    classNamePrefix={'sco'}
  />
  )
}
