import React from 'react'
import Row from './Row'
import HeaderCell from './HeaderCell'
import '../styles/Components.css'


export default function Spreadsheet() {
    
    return (
        <table className="table" >
            <tbody>
                <tr>
                    <HeaderCell contents={'Company'} />
                    <HeaderCell contents={'Contact'} />
                    <HeaderCell contents={'Country'} />
                </tr>
                <Row/>
                <Row/>
            </tbody>
        </table>
    )
}