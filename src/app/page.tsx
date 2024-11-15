'use client'

import { useState, ChangeEvent, KeyboardEvent } from 'react'
import { read, utils, writeFile } from 'xlsx'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { Loader2, Save } from 'lucide-react'

export default function ProfessionalExcelImport() {
  const [data, setData] = useState<string[][]>([])
  const [fileName, setFileName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [editCell, setEditCell] = useState<{ row: number; col: number } | null>(null)

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLoading(true)
      setError(null)
      setFileName(file.name)
      
      try {
        const data = await readExcelFile(file)
        setData(data)
      } catch (err) {
        setError('Failed to read the Excel file. Please ensure it is a valid Excel file.')
        setData([])
      } finally {
        setLoading(false)
      }
    }
  }

  const readExcelFile = (file: File): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (evt) => {
        if (evt.target) {
          try {
            const bstr = evt.target.result as string
            const wb = read(bstr, { type: 'binary' })
            const wsname = wb.SheetNames[0]
            const ws = wb.Sheets[wsname]
            const data = utils.sheet_to_json(ws, { header: 1 }) as string[][]
            resolve(data)
          } catch (err) {
            reject('Failed to parse the Excel file. Please ensure it is a valid Excel file.')
          }
        }
      }
      reader.onerror = () => reject('An error occurred while reading the file.')
      reader.readAsBinaryString(file)
    })
  }

  const clearData = () => {
    setData([])
    setFileName('')
    setError(null)
  }

  const handleCellEdit = (row: number, col: number, value: string) => {
    const newData = [...data]
    newData[row][col] = value
    setData(newData)
    setEditCell(null)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, row: number, col: number) => {
    if (e.key === 'Enter') {
      handleCellEdit(row, col, (e.target as HTMLInputElement).value)
    }
  }

  const exportToExcel = () => {
    const ws = utils.aoa_to_sheet(data)
    const wb = utils.book_new()
    utils.book_append_sheet(wb, ws, 'Sheet1')
    writeFile(wb, fileName || 'updated_excel_file.xlsx')
  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold">Professional Excel Import & Edit</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              id="file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="flex-grow bg-white dark:bg-gray-700"
              disabled={loading}
            />
            <Button
              onClick={() => document.getElementById('file-upload')?.click()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Upload'}
            </Button>
            {data.length > 0 && (
              <>
                <Button
                  variant="outline"
                  onClick={clearData}
                  disabled={loading}
                  className="border-blue-600 text-blue-600 hover:bg-blue-100 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
                >
                  Clear
                </Button>
                <Button
                  onClick={exportToExcel}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>

          {fileName && <p className="text-sm text-blue-600 dark:text-blue-400">File: {fileName}</p>}

          {error && (
            <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-100">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading && (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
            </div>
          )}

          {data.length > 0 && (
            <div className="overflow-x-auto border rounded-md bg-white dark:bg-gray-800">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-600 text-white dark:bg-blue-800">
                    {data[0].map((cell, index) => (
                      <TableHead key={index} className="font-bold border-b border-blue-500 dark:border-blue-700">
                        {cell}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.slice(1).map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className={rowIndex % 2 === 0 ? 'bg-blue-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}
                    >
                      {row.map((cell, cellIndex) => (
                        <TableCell
                          key={cellIndex}
                          className="border-b border-blue-200 dark:border-blue-900"
                          onClick={() => setEditCell({ row: rowIndex + 1, col: cellIndex })}
                        >
                          {editCell?.row === rowIndex + 1 && editCell?.col === cellIndex ? (
                            <Input
                              autoFocus
                              defaultValue={cell}
                              onBlur={(e) => handleCellEdit(rowIndex + 1, cellIndex, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, rowIndex + 1, cellIndex)}
                              className="w-full p-0 border-none bg-transparent"
                            />
                          ) : (
                            cell
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}