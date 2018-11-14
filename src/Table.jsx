import React  from 'react'
import {Link} from 'react-router-dom'


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

  return (
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
          {rows.map((row, rowIndex) => (
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
