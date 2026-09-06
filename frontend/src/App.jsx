import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000'
const PAGE_SIZE = 10

const emptyForm = {
  code: '',
  name: '',
  email: '',
  phoneNumber: '',
  degreeType: '',
  degreeMajor: '',
}

function App() {
  const [teachers, setTeachers] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${API_URL}/teachers`)
      if (!res.ok) throw new Error('Failed to fetch teachers')
      setTeachers(await res.json())
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchTeachers()
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return teachers
    return teachers.filter((t) =>
      [t.code, t.name, t.email, t.phoneNumber, t.degrees?.type, t.degrees?.school]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    )
  }, [teachers, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageData = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const validate = () => {
    if (!form.code.trim()) return 'ID (code) is required'
    if (form.code.trim().length > 10) return 'ID (code) must be at most 10 characters'
    if (!form.name.trim()) return 'Name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!form.phoneNumber.trim()) return 'Phone number is required'
    if (!form.degreeType.trim()) return 'Degree type is required'
    if (!form.degreeMajor.trim()) return 'Degree major is required'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code.trim(),
          name: form.name.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          degrees: { type: form.degreeType.trim(), major: form.degreeMajor.trim() },
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create teacher')
      setDrawerOpen(false)
      setForm(emptyForm)
      await fetchTeachers()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1 className="title">Teachers</h1>
        <input
          className="search"
          type="text"
          placeholder="Search by code, name, email, phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />
        <button className="btn primary" onClick={() => { setError(''); setDrawerOpen(true) }}>
          + Create new
        </button>
      </header>

      <main className="content">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone number</th>
              <th>Degree type</th>
              <th>Degree major</th>
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">No teachers found</td>
              </tr>
            ) : (
              pageData.map((t) => (
                <tr key={t._id}>
                  <td>{t.code}</td>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.phoneNumber}</td>
                  <td>{t.degrees?.type}</td>
                  <td>{t.degrees?.major}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <button className="btn" disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)}>
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`btn ${p === currentPage ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          <button className="btn" disabled={currentPage >= totalPages} onClick={() => setPage(currentPage + 1)}>
            Next
          </button>
        </div>
      </main>

      {drawerOpen && (
        <div className="drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <div className="drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h2>Create new teacher</h2>
              <button className="close" onClick={() => setDrawerOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="form">
              <label>
                ID <span className="required">*</span>
                <input name="code" value={form.code} onChange={handleChange} maxLength={10} />
              </label>
              <label>
                Name <span className="required">*</span>
                <input name="name" value={form.name} onChange={handleChange} />
              </label>
              <label>
                Email <span className="required">*</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
              </label>
              <label>
                Phone number <span className="required">*</span>
                <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
              </label>
              <label>
                Degree type <span className="required">*</span>
                <input name="degreeType" value={form.degreeType} onChange={handleChange} />
              </label>
              <label>
                Degree major <span className="required">*</span>
                <input name="degreeMajor" value={form.degreeMajor} onChange={handleChange} />
              </label>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="btn primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
