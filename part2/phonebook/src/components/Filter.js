import React from "react"

const Filter = ({onChange, value}) => (
    <>
        <p>filter shown with</p>
        <input onChange={onChange} value={value}/>
    </>
)

export default Filter