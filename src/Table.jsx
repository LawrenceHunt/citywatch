import React  from 'react'
import {Link} from 'react-router-dom'

const DEFAULT_COL = '#'
const STRING_COLS = ['City', 'Country']

// SORT METHOD -----------------------------------------------------------------

const sortRows = (rows, column) => {

  const colType = STRING_COLS.includes(column) ? 'string' : 'number'

  // ensure vals are of the right type - num or string
  const cast = val => {
    if (colType === 'string') return `${val}`
    if (colType === 'number') {
      if (typeof val === 'string') {
        val = val.replace(/[, ]+/g, "").trim() // remove spaces and commas
      }
      return Number(val)                       // cast to a number
    }
    return null
  }

  // ensure vals exist before sorting
  const check = val => typeof val !== 'undefined' && val !== null
    ? cast(val)
    : null

  const sortMethods = {
    'string': rows => rows.sort((a, b) => {
      const valA = check(a[column])
      const valB = check(b[column])
      return valA.localeCompare(valB)
    }),

    'number': rows => rows.sort((a, b) => {
      const valA = check(a[column])
      const valB = check(b[column])
      return valA - valB
    })
  }

  return sortMethods[colType](rows) || rows
}


// TABLE COMPONENT -------------------------------------------------------------

let sortUp = false

export default ({match, rows}) => {

  // get the column name from params
  let column = match.params.column || DEFAULT_COL

  // render loading if csv not yet parsed.
  if (!rows.length) return <div>Loading...</div>

  // get all headings from the data's keys
  const headings = rows.reduce((headersList, row) => {
    Object.keys(row).forEach(key => {
      if (!headersList.includes(key)) headersList.push(key)
    })
    return headersList
  }, [])

  // sanitize the data rows by removing any rows with no values
  rows = rows.filter(row => Object.values(row).some(val => val))

  // check column exists! If not render the default.
  let columnMsg = `Showing cities sorted by '${column}'`
  let columnMsgClass = ""
  if (!headings.includes(column)) {
    columnMsg = `No columns match the URL '${match.params.column}'.`
    columnMsgClass = " error"
    column = DEFAULT_COL
  }

  // sort rows based on column choice
  const displayRows = sortRows(rows, column)

  // reverse sort if toggle button has been pressed.
  if (!sortUp) displayRows.reverse()

  const toggleButton = (
    <span className="toggle" onClick={() => sortUp = !sortUp}>
      {!sortUp ? '👇' : '👆' }
    </span>
  )

  return (
    <div>
      <h1>CITY 🏙 WATCH</h1>

      {<div className={`column-msg${columnMsgClass}`}>
        {columnMsg}
      </div>}

      <table>
        <thead>
          <tr>
            {headings.map((heading, i) => (
              <th className={heading === column ? 'active' : ''} key={`heading-${i}`}>
                <Link to={`/${heading}`}>
                  {heading}
                  {heading === column ? toggleButton : null }
                </Link>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayRows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {headings.map((column, colIndex) => (
                <td key={`column-${colIndex}`}>
                  {typeof row[column] !== 'undefined' ? row[column] : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
